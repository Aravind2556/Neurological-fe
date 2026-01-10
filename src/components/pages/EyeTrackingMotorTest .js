import React, { useEffect, useRef, useState } from "react";
import { FaceMesh } from "@mediapipe/face_mesh";
import { Camera } from "@mediapipe/camera_utils";

const TEST_DURATION = 60; // seconds
const FPS = 30;

const EyeTrackingFullTest = () => {
    const videoRef = useRef(null);
    const ballRef = useRef(null);
    const timerRef = useRef(null);
    const moveRef = useRef(null);

    const [cameraOn, setCameraOn] = useState(false);
    const [running, setRunning] = useState(false);
    const [timeLeft, setTimeLeft] = useState(TEST_DURATION);
    const [focusTime, setFocusTime] = useState(0);
    const [violations, setViolations] = useState(0);
    const [result, setResult] = useState(null);

    /* =========================
       CAMERA + FACEMESH INIT
       ========================= */
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
        setCameraOn(true);
    }, []);

    /* =========================
       FACEMESH RESULT LOGIC
       ========================= */
    const onResults = (results) => {
        if (!running) return;

        if (!results.multiFaceLandmarks?.length) {
            registerViolation("Face not detected. Please stay in front of camera.");
            return;
        }

        const lm = results.multiFaceLandmarks[0];
        const leftIris = lm[468];
        const rightIris = lm[473];

        const eyeX = (leftIris.x + rightIris.x) / 2;
        const eyeY = (leftIris.y + rightIris.y) / 2;

        const ball = ballRef.current.getBoundingClientRect();
        const ballX = (ball.left + ball.width / 2) / window.innerWidth;
        const ballY = (ball.top + ball.height / 2) / window.innerHeight;

        const threshold = 0.07;

        const focused =
            Math.abs(eyeX - ballX) < threshold &&
            Math.abs(eyeY - ballY) < threshold;

        if (focused) {
            setFocusTime((t) => t + 1 / FPS);
        } else {
            registerViolation("Focus lost. Please look at the moving ball.");
        }
    };

    /* =========================
       VIOLATION HANDLER
       ========================= */
    const registerViolation = (message) => {
        setViolations((v) => v + 1);
        stopTest(message);
    };

    /* =========================
       BALL MOVEMENT
       ========================= */
    const moveBall = () => {
        const x = Math.random() * (window.innerWidth - 40);
        const y = Math.random() * (window.innerHeight - 40);
        ballRef.current.style.transform = `translate(${x}px, ${y}px)`;
    };

    /* =========================
       START TEST
       ========================= */
    const startTest = () => {
        if (!cameraOn) {
            alert("Camera ON pannunga");
            return;
        }

        setRunning(true);
        setResult(null);
        setTimeLeft(TEST_DURATION);
        setFocusTime(0);
        setViolations(0);

        moveRef.current = setInterval(moveBall, 500);

        timerRef.current = setInterval(() => {
            setTimeLeft((t) => {
                if (t <= 1) {
                    finishTest();
                    return 0;
                }
                return t - 1;
            });
        }, 1000);
    };

    /* =========================
       STOP TEST (FAIL)
       ========================= */
    const stopTest = (message) => {
        clearInterval(timerRef.current);
        clearInterval(moveRef.current);
        setRunning(false);

        const score = ((focusTime / TEST_DURATION) * 100).toFixed(2);

        setResult({
            status: "FAIL",
            score,
            violations: violations + 1,
        });

        alert(message);
    };

    /* =========================
       FINISH TEST (PASS)
       ========================= */
    const finishTest = () => {
        clearInterval(timerRef.current);
        clearInterval(moveRef.current);
        setRunning(false);

        const score = Math.min(
            (focusTime / TEST_DURATION) * 100,
            100
        ).toFixed(2);

        setResult({
            status: "PASS",
            score,
            violations,
        });
    };

    /* =========================
       UI
       ========================= */
    return (
        <div className="w-screen h-screen bg-white overflow-hidden">

            <video ref={videoRef} className="hidden" />

            {/* TIMER */}
            <div className="fixed top-4 right-6 text-xl font-bold">
                ⏳ {timeLeft}s
            </div>

            {/* STATS */}
            <div className="fixed top-4 left-6 text-sm font-semibold space-y-1">
                <div>🎯 Focus Time: {focusTime.toFixed(1)} s</div>
                <div>❌ Violations: {violations}</div>
            </div>

            {/* BALL */}
            <div
                ref={ballRef}
                className={`w-8 h-8 rounded-full absolute
          ${running ? "bg-green-500" : "bg-gray-400"}
        `}
            />

            {/* START BUTTON */}
            {!running && !result && (
                <div className="fixed bottom-12 w-full flex justify-center">
                    <button
                        onClick={startTest}
                        className="px-10 py-4 text-lg bg-blue-600 text-white rounded-xl shadow-lg"
                    >
                        START TEST
                    </button>
                </div>
            )}

            {/* RESULT */}
            {result && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
                    <div className="bg-white rounded-xl p-8 text-center space-y-4 w-[300px]">
                        <h2 className="text-2xl font-bold">
                            {result.status === "PASS" ? "✅ PASSED" : "❌ FAILED"}
                        </h2>
                        <p>Score: <b>{result.score}%</b></p>
                        <p>Violations: <b>{result.violations}</b></p>
                        <button
                            onClick={startTest}
                            className="mt-4 px-6 py-2 bg-green-600 text-white rounded"
                        >
                            Retry Test
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EyeTrackingFullTest;
