import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { FaceMesh } from "@mediapipe/face_mesh";
import { Camera } from "@mediapipe/camera_utils";
import { DContext } from "../../context/Datacontext";
import CustomApexChart from "../blocks/LiveChart";

const EyeTrackingExamFinal = () => {
    const { fieldSix , controls}=useContext(DContext)
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



        const filedSixValue = Array.isArray(fieldSix?.['y-axis'])
            ? fieldSix['y-axis'].map(item => {
                    const values = item.split(',').map(Number)
                    return {
                        f1: values[0],
                        f2: values[1],
                    }
                })
                : []
        
            const mainChartData = useMemo(() => {
                if (!filedSixValue.length || !Array.isArray(fieldSix?.['x-axis'])) return []
        
                const xAxis = fieldSix['x-axis']
                const fKeys = ['f1', 'f2']
        
                // custom labels mapping
                const labelMap = {
                    f1: 'IR',
                    f2: 'RED',
                }
        
                return fKeys.map((key, index) => ({
                    seriesName: labelMap[key],          // use custom label here
                    "x-axis": xAxis,
                    "y-axis": filedSixValue.map(item => item[key]),
                    color: ['red', 'green', 'blue', 'orange', 'purple', 'brown'][index]
                }))
            }, [filedSixValue, fieldSix])
        
        
            const lastRowValues =
                Array.isArray(fieldSix?.['y-axis']) && fieldSix['y-axis'].length > 0
                    ? fieldSix['y-axis'][fieldSix['y-axis'].length - 1]
                        .split(',')
                        .map(Number)
                    : []
        
            const f3 = lastRowValues[2] ?? 0
            const f4 = lastRowValues[3] ?? 0

    return (
    <div>
        <div className={`${running ? "w-screen h-screen" : ""} bg-white overflow-hidden`}>
            {/* CAMERA PREVIEW */}
            <video
                ref={videoRef}
                autoPlay
                muted
                className="bottom-4 right-4 w-56 h-40 border rounded-lg"
            />

            {/* TIMER */}
            {running && (
                <div className="top-4 right-6 text-xl font-bold">
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
                <div className="inset-0 flex flex-col items-center justify-center gap-4">

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
        </div>
            <div className="px-3 md:px-10 py-6 bg-gray-100">
                {/* MAIN CARD */}
                <div className="bg-white border rounded-2xl shadow-lg p-6 space-y-6">

                    {/* HEADER */}
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold text-gray-800">
                            field5
                        </h2>
                        <span className="text-sm px-3 py-1 rounded-full bg-blue-100 text-blue-700 font-medium">
                            Live Data
                        </span>
                    </div>

                    {/* CONTENT */}
                    <div className="flex flex-col lg:flex-row gap-6">

                        {/* LEFT – METRIC CARDS */}
                        <div className="lg:w-[30%] bg-gray-50 border rounded-xl p-4">
                            <h3 className="text-sm font-semibold text-gray-600 mb-4 uppercase">
                                Heart Rate / Spo2
                            </h3>

                            <div className="grid grid-cols-2 gap-4">
                                {[
                                    { label: "Heart Rate", value: f3 },
                                    { label: "Spo2", value: f4 },
                                ].map((item, i) => (
                                    <div
                                        key={i}
                                        className="bg-white border rounded-xl p-4 shadow-sm hover:shadow-md transition"
                                    >
                                        <p className="text-xs text-gray-500 mb-1">{item.label}</p>
                                        <p className="text-2xl font-bold text-gray-800">
                                            {item.value}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* RIGHT – CHART */}
                        <div className="lg:w-[70%] bg-white border rounded-xl shadow-md p-4">
                            <h3 className="text-sm font-semibold text-gray-600 mb-2 uppercase">
                                Sensor Signal (IR – RED)
                            </h3>

                            <CustomApexChart
                                data={mainChartData}
                                title=""
                                lineStyle="straight"
                                lineWidth={2}
                                chartType="line"
                                controls={controls}
                            />
                        </div>

                    </div>
                </div>
            </div>
    </div>
    );
};

export default EyeTrackingExamFinal;

