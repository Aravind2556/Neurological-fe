import React, { useEffect, useState } from "react";
import { Keypad } from "react-number-pin-keypad";

export default function Cognitive() {
    const [numbers, setNumbers] = useState([]);
    const [highlightedIndexes, setHighlightedIndexes] = useState([]);
    const [correctSequence, setCorrectSequence] = useState("");
    const [showGrid, setShowGrid] = useState(false);
    const [timer, setTimer] = useState(10);
    const [userInput, setUserInput] = useState("");
    const [accuracy, setAccuracy] = useState(null);
    const [activeHighlight, setActiveHighlight] = useState(null);
    const [selectedLength, setSelectedLength] = useState(5)
    const [progress, setProgress] = useState(0);


    // Start Game

    // const shuffleArray = (arr) => {
    //     return [...arr].sort(() => Math.random() - 0.5);
    // };
    const startCognitive = () => {
        const nums = Array.from({ length: 15 }, () => Math.floor(Math.random() * 9) + 1);

        const highlights = [];
        while (highlights.length < selectedLength) {
            const idx = Math.floor(Math.random() * 15);
            if (!highlights.includes(idx)) highlights.push(idx);
        }

        const correct = highlights.map(i => nums[i]).join("");

        setNumbers(nums);
        setHighlightedIndexes(highlights);
        setCorrectSequence(correct);
        setShowGrid(true);
        setTimer(10);
        setUserInput("");
        setAccuracy(null);

        // animate highlight order
        let step = 0;
        setActiveHighlight(null);

        const interval = setInterval(() => {
            if (step >= highlights.length) {
                clearInterval(interval);
                setActiveHighlight(null);
                return;
            }
            setActiveHighlight(highlights[step]);
            step++;
        }, 800); // 0.8s per highlight
    };

    // Countdown
    useEffect(() => {
        if (!showGrid) return;

        const interval = setInterval(() => {
            setTimer(prev => {
                if (prev <= 1) {
                    clearInterval(interval);
                    setShowGrid(false);   // hide grid after 10 seconds
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [showGrid]);


    // Accuracy
    const calculateAccuracy = () => {
        console.log("Correctsss:", correctSequence);
        console.log("User Input:", userInput);
        let wrong = 0;

        for (let i = 0; i < correctSequence.length; i++) {
            if (userInput[i] !== correctSequence[i]) wrong++;
        }

        const correct = selectedLength - wrong;
        const percentage = Math.round((correct / selectedLength) * 100);
        setProgress(percentage);

        if (selectedLength === 5) {
            if (wrong === 0) setAccuracy("100%");
            else if (wrong === 1) setAccuracy("80%");
            else if (wrong === 2) setAccuracy("60%");
            else if (wrong === 3) setAccuracy("35%");
            else if (wrong === 4) setAccuracy("10%");
            else setAccuracy("Below 10%");
        }
        else if (selectedLength === 7) {
            if (wrong === 0) setAccuracy("100%");
            else if (wrong === 1) setAccuracy("90%");
            else if (wrong === 2) setAccuracy("80%");
            else if (wrong === 3) setAccuracy("70%");
            else if (wrong === 4) setAccuracy("60%");
            else if (wrong === 5) setAccuracy("50%");
            else if (wrong === 6) setAccuracy("40%");

            else setAccuracy("Below 40%");
        }
        else if (selectedLength === 9) {
            if (wrong === 0) setAccuracy("100%");
            else if (wrong === 1) setAccuracy("90%");
            else if (wrong === 2) setAccuracy("80%");
            else if (wrong === 3) setAccuracy("70%");
            else if (wrong === 4) setAccuracy("60%");
            else if (wrong === 5) setAccuracy("50%");
            else if (wrong === 6) setAccuracy("40%");
            else if (wrong === 7) setAccuracy("30%");
            else setAccuracy("Below 30%");
        }

    };
    return (
        <div className="px-3 sm:px-6 md:px-10 py-6 bg-blue-50">

            {/* Title */}
            <h1 className="text-xl sm:text-2xl md:text-3xl mb-4 font-bold ">
                Cognitive Memory Test
            </h1>

            {/* Start & Timer */}
            <div className="flex justify-center items-center gap-4 sm:gap-6 mb-6">
                <button
                    onClick={startCognitive}
                    className="bg-teal-600 text-white px-4 sm:px-6 py-2 rounded shadow hover:bg-teal-700"
                >
                    Start Test
                </button>

                {showGrid && (
                    <div className="text-red-600 font-bold text-base sm:text-lg">
                        ⏱ {timer}s
                    </div>
                )}
            </div>

            {/* GAME CONTAINER */}
            <div className="flex justify-center mt-6 sm:mt-10">
                <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl p-4 sm:p-6 md:p-8 border border-gray-200">

                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-6 mb-6">

                        <div className="flex flex-col items-center md:items-start gap-4 w-full md:w-auto">
                            <p className="text-gray-700 font-semibold text-base sm:text-lg">
                                Select the Highlighted Counts
                            </p>

                            <div className="relative w-full md:w-40">
                                <select
                                    onChange={(e) => setSelectedLength(Number(e.target.value))}
                                    className="w-full md:w-40 appearance-none bg-gray-100 border border-gray-300 
                rounded-lg px-4 py-3 pr-10 text-gray-700 
                focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500
                cursor-pointer transition"
                                >
                                    <option value={5}>5</option>
                                    <option value={7}>7</option>
                                    <option value={9}>9</option>
                                </select>

                                <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" strokeWidth="2"
                                        viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <h2 className="text-lg sm:text-xl font-semibold text-gray-700 text-center">
                            Memory Pattern Test
                        </h2>

                        <span className="text-sm text-gray-500 text-center">
                            Recall the highlighted digits
                        </span>

                    </div>

                    {/* Score Bar */}
                    {accuracy && (
                        <div className="mb-6">
                            <div className="flex justify-between text-sm mb-1">
                                <span className="text-gray-500">Cognitive Score</span>
                                <span className="font-bold text-teal-600">{accuracy}</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-3">
                                <div
                                    className="bg-gradient-to-r from-teal-400 to-teal-600 h-3 rounded-full transition-all duration-700"
                                    style={{ width: `${progress}%` }}

                                ></div>
                            </div>
                        </div>
                    )}

                    {/* Main Layout */}
                    <div className="flex flex-col lg:flex-row gap-10 justify-between items-center">

                        {/* LEFT — Number Grid */}
                        <div className="grid grid-cols-5 gap-2 sm:gap-3 md:gap-4 relative">

                            {!showGrid && numbers.length > 0 && (
                                <div className="absolute inset-0 bg-white/80 backdrop-blur-sm 
                animate-pulse z-10 rounded-xl flex items-center justify-center">
                                    <span className="text-teal-600 font-bold text-base sm:text-lg">
                                        Scanning Memory...
                                    </span>
                                </div>
                            )}

                            {numbers.map((num, i) => (
                                <div
                                    key={i}
                                    className={`w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 
                flex items-center justify-center rounded-xl font-semibold shadow-md
                transition-all
                ${showGrid && i === activeHighlight
                                            ? "bg-teal-500 text-white scale-110 ring-4 ring-teal-200"
                                            : "bg-gray-100 text-gray-700"
                                        }`}
                                >
                                    {showGrid ? num : ""}
                                </div>
                            ))}
                        </div>

                        {/* RIGHT — Keypad */}
                        {!showGrid && numbers.length > 0 && (
                            <div className="flex flex-col items-center gap-4">

                                <input
                                    value={userInput}
                                    readOnly
                                    className="border px-3 py-2 w-40 sm:w-48 text-center rounded-lg tracking-widest"
                                    placeholder="Enter digits"
                                />

                                <div className="grid grid-cols-3 gap-2 sm:gap-3">
                                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map(n => (
                                        <button
                                            key={n}
                                            onClick={() => setUserInput(p => p + n)}
                                            className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 
                    bg-white border rounded-xl text-sm sm:text-lg font-semibold
                    hover:bg-teal-50 active:scale-95"
                                        >
                                            {n}
                                        </button>
                                    ))}
                                    <button
                                        onClick={() => setUserInput(p => p.slice(0, -1))}
                                        className="col-span-3 bg-red-500 text-white py-2 rounded-xl hover:bg-red-600"
                                    >
                                        ⌫ Clear
                                    </button>
                                </div>

                                <button
                                    onClick={calculateAccuracy}
                                    className="bg-teal-600 text-white px-6 py-2 rounded-xl hover:bg-teal-700"
                                >
                                    Check Cognitive Score
                                </button>

                            </div>
                        )}

                    </div>
                </div>
            </div>
        </div>
    );


}
