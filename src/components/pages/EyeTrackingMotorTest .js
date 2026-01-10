import React, { useEffect, useRef, useState } from "react";
import { FaceMesh } from "@mediapipe/face_mesh";
import { Camera } from "@mediapipe/camera_utils";

const EyeTrackingExamFinal = () => {
    const videoRef = useRef(null);
    const ballRef = useRef(null);
    const timerRef = useRef(null);
    const moveRef = useRef(null);

    const [running, setRunning] = useState(false);
    const [timeLeft, setTimeLeft] = useState(30);
    const [selectedTime, setSelectedTime] = useState(30);
    const [result, setResult] = useState(null);

    /* ============ CAMERA + FACEMESH INIT ============ */
    useEffect(() => {
        const faceMesh = new FaceMesh({
            locateFile: (file) =>
                `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`,
        });

        faceMesh.setOptions({
            maxNumFaces: 1,
            refineLandmarks: true,
        });

        faceMesh.onResults(onResults);

        const camera = new Camera(videoRef.current, {
            onFrame: async () => {
                await faceMesh.send({ image: videoRef.current });
            },
            width: 640,
            height: 480,
        });

        camera.start();
    }, []);

    /* ============ FACEMESH RESULT ============ */
    const onResults = (results) => {
        if (!running) return;

        if (!results.multiFaceLandmarks?.length) {
            failTest("Face not detected");
            return;
        }

        const lm = results.multiFaceLandmarks[0];

        // HEAD TURN CHECK
        const nose = lm[1];
        if (nose.x < 0.35 || nose.x > 0.65) {
            failTest("Face turned away from camera");
            return;
        }

        // EYE FOCUS CHECK
        const leftIris = lm[468];
        const rightIris = lm[473];
        const eyeX = (leftIris.x + rightIris.x) / 2;
        const eyeY = (leftIris.y + rightIris.y) / 2;

        const ball = ballRef.current.getBoundingClientRect();
        const ballX = (ball.left + ball.width / 2) / window.innerWidth;
        const ballY = (ball.top + ball.height / 2) / window.innerHeight;

        const threshold = 0.07;

        if (
            Math.abs(eyeX - ballX) > threshold ||
            Math.abs(eyeY - ballY) > threshold
        ) {
            failTest("Eye focus lost. Look at the ball.");
        }
    };

    /* ============ BALL MOVE ============ */
    const moveBall = () => {
        const x = Math.random() * (window.innerWidth - 40);
        const y = Math.random() * (window.innerHeight - 40);
        ballRef.current.style.transform = `translate(${x}px, ${y}px)`;
    };

    /* ============ START TEST ============ */
    const startTest = () => {
        setRunning(true);
        setResult(null);
        setTimeLeft(selectedTime);

        moveRef.current = setInterval(moveBall, 500);

        timerRef.current = setInterval(() => {
            setTimeLeft((t) => {
                if (t <= 1) {
                    passTest();
                    return 0;
                }
                return t - 1;
            });
        }, 1000);
    };

    /* ============ FAIL TEST ============ */
    const failTest = (reason) => {
        clearInterval(timerRef.current);
        clearInterval(moveRef.current);
        setRunning(false);
        setResult({ status: "FAIL", reason });
    };

    /* ============ PASS TEST ============ */
    const passTest = () => {
        clearInterval(timerRef.current);
        clearInterval(moveRef.current);
        setRunning(false);
        setResult({ status: "PASS" });

        // AUTO CLOSE AFTER 2 SECONDS
        setTimeout(() => {
            setResult(null);
        }, 2000);
    };

    return (
        <div className="w-screen h-screen bg-white overflow-hidden">

            {/* CAMERA PREVIEW */}
            <video
                ref={videoRef}
                autoPlay
                muted
                className="fixed bottom-4 right-4 w-56 h-40 border rounded-lg"
            />

            {/* TIMER */}
            {running && (
                <div className="fixed top-4 right-6 text-xl font-bold">
                    ⏳ {timeLeft}s
                </div>
            )}

            {/* BALL */}
            <div
                ref={ballRef}
                className={`w-8 h-8 rounded-full absolute ${running ? "bg-green-500" : "bg-gray-400"
                    }`}
            />

            {/* START SCREEN */}
            {!running && !result && (
                <div className="fixed inset-0 flex flex-col items-center justify-center gap-4">

                    {/* TIME DROPDOWN */}
                    <select
                        value={selectedTime}
                        onChange={(e) => setSelectedTime(Number(e.target.value))}
                        className="border px-4 py-2 rounded text-lg"
                    >
                        <option value={15}>15 seconds</option>
                        <option value={30}>30 seconds</option>
                        <option value={45}>45 seconds</option>
                        <option value={60}>1 minute</option>
                    </select>

                    {/* START BUTTON */}
                    <button
                        onClick={startTest}
                        className="px-10 py-4 text-xl bg-blue-600 text-white rounded-xl shadow-lg"
                    >
                        START TEST
                    </button>
                </div>
            )}

            {/* RESULT POPUP */}
            {result && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
                    <div className="bg-white p-8 rounded-xl text-center space-y-3 w-[300px]">
                        <h2 className="text-2xl font-bold">
                            {result.status === "PASS"
                                ? "✅ TEST PASSED"
                                : "❌ TEST FAILED"}
                        </h2>

                        {result.reason && (
                            <p className="text-red-600 font-semibold">
                                {result.reason}
                            </p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default EyeTrackingExamFinal;

