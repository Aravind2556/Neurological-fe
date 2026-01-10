import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { DContext } from "../../context/Datacontext";
import CustomApexChart from "../blocks/LiveChart";

const TimedBallTest = () => {
    const { fieldSix, controls } = useContext(DContext);

    const ballRef = useRef(null);
    const timerRef = useRef(null);
    const moveRef = useRef(null);

    const [running, setRunning] = useState(false);
    const [selectedTime, setSelectedTime] = useState(30);
    const [timeLeft, setTimeLeft] = useState(30);

    const BALL_SIZE = 32; // w-8 h-8 => 32px

    /* ================= SAFE moveBall (BOX-ONLY) ================= */
    const moveBall = () => {
        if (!ballRef.current) return;

        const parent = ballRef.current.parentElement;
        if (!parent) return;

        const box = parent.getBoundingClientRect();

        // compute available space
        const maxX = Math.max(box.width - BALL_SIZE, 0);
        const maxY = Math.max(box.height - BALL_SIZE, 0);

        const x = Math.random() * maxX;
        const y = Math.random() * maxY;

        ballRef.current.style.transform = `translate(${x}px, ${y}px)`;
    };

    /* ================= START TEST ================= */
    const startTest = () => {
        // avoid double start
        if (running) return;

        // clear any previous timers (safety)
        if (moveRef.current) clearInterval(moveRef.current);
        if (timerRef.current) clearInterval(timerRef.current);

        setRunning(true);
        setTimeLeft(selectedTime);

        // immediate placement so ball is visible inside box at start
        setTimeout(() => moveBall(), 0);

        moveRef.current = setInterval(moveBall, 500);

        timerRef.current = setInterval(() => {
            setTimeLeft((t) => {
                if (t <= 1) {
                    stopTest();
                    return 0;
                }
                return t - 1;
            });
        }, 1000);
    };

    /* ================= STOP TEST ================= */
    const stopTest = () => {
        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }
        if (moveRef.current) {
            clearInterval(moveRef.current);
            moveRef.current = null;
        }
        setRunning(false);
    };

    /* ================ CLEANUP ON UNMOUNT ================ */
    useEffect(() => {
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
            if (moveRef.current) clearInterval(moveRef.current);
        };
    }, []);

    /* ================= LIVE CHART DATA ================= */
    const filedSixValue = Array.isArray(fieldSix?.["y-axis"])
        ? fieldSix["y-axis"].map((item) => {
            const values = item.split(",").map(Number);
            return {
                f1: values[0],
                f2: values[1],
            };
        })
        : [];

    const mainChartData = useMemo(() => {
        if (!filedSixValue.length || !Array.isArray(fieldSix?.["x-axis"])) return [];

        const xAxis = fieldSix["x-axis"];
        const fKeys = ["f1", "f2"];

        const labelMap = {
            f1: "Eye Blink Rate",
            f2: "Saccadic Delay",
        };

        return fKeys.map((key, index) => ({
            seriesName: labelMap[key],
            "x-axis": xAxis,
            "y-axis": filedSixValue.map((item) => item[key]),
            color: ["red", "green"][index],
        }));
    }, [filedSixValue, fieldSix]);

    const lastRowValues =
        Array.isArray(fieldSix?.["y-axis"]) && fieldSix["y-axis"].length > 0
            ? fieldSix["y-axis"][fieldSix["y-axis"].length - 1]
                .split(",")
                .map(Number)
            : [];

    const f1 = lastRowValues[0] ?? 0;
    const f2 = lastRowValues[1] ?? 0;

    return (
        <div className="px-3 md:px-10 py-6 border rounded-xl bg-gray-50">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Eye Blink Test</h2>
            {/* ================= TEST AREA ================= */}
            <div
                className={`relative w-full h-[400px] border-2 border-dashed rounded-xl overflow-hidden
          ${running ? "bg-gray-50" : "bg-white"}
        `}
            >
                {/* TIMER */}
                {running && (
                    <div className="absolute top-4 right-6 text-xl font-bold z-10">⏳ {timeLeft}s</div>
                )}

                {/* BALL */}
                <div
                    ref={ballRef}
                    className={`w-8 h-8 rounded-full absolute transition-transform duration-300
            ${running ? "bg-green-500" : "bg-gray-400"}
          `}
                    // initial placement in center when not running
                    style={!running ? { transform: "translate(calc(50% - 16px), calc(50% - 16px))" } : {}}
                />

                {/* START UI */}
                {!running && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 pointer-events-auto">
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
                            className="px-10 py-4 text-xl bg-teal-600 text-white rounded-xl shadow-lg"
                        >
                            START TEST
                        </button>
                    </div>
                )}
            </div>

            {/* ================= LIVE CHART ================= */}
            <div className="mt-8 bg-white border rounded-2xl shadow-lg p-6 space-y-6">
                <div className="flex items-center justify-end">
                    
                    <span className="text-sm px-3 py-1 rounded-full bg-blue-100 text-blue-700 font-medium">Live Data</span>
                </div>

                <div className="flex flex-col lg:flex-row gap-6">
                    {/* METRICS */}
                    <div className="lg:w-[30%] bg-gray-50 border rounded-xl p-4">
                        <h3 className="text-sm font-semibold text-gray-600 mb-4 uppercase">Eye Metrics</h3>

                        <div className="grid grid-cols-2 gap-4">
                            {[{ label: "Eye Blink Rate", value: f1 }, { label: "Saccadic Delay", value: f2 }].map(
                                (item, i) => (
                                    <div key={i} className="bg-white border rounded-xl p-4 shadow-sm">
                                        <p className="text-xs text-gray-500 mb-1">{item.label}</p>
                                        <p className="text-2xl font-bold text-gray-800">{item.value}</p>
                                    </div>
                                )
                            )}
                        </div>
                    </div>

                    {/* CHART */}
                    <div className="lg:w-[70%] bg-white border rounded-xl shadow-md p-4">
                        <h3 className="text-sm font-semibold text-gray-600 mb-2 uppercase">Sensor Signal (IR – RED)</h3>

                        <CustomApexChart data={mainChartData} title="" lineStyle="straight" lineWidth={2} chartType="line" controls={controls} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TimedBallTest;
