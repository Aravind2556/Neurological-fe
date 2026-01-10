import React, { useEffect, useState } from "react";
import { THINGSPEAK_URL } from "../../utils/ThinkSpeak";
import CustomApexChart from "../blocks/LiveChart";

export default function Speech() {
    const [mode, setMode] = useState("numbers");
    const [activeModes, setActiveModes] = useState(["numbers"]);

    const [numbers, setNumbers] = useState([]);
    const [words, setWords] = useState([]);

    const blank = {
        ob: 0, rate: 0, pause: 0, pitch: 0, loudness: 0,
        xAxis: [], yAxis: []
    };

    const [numbersValue, setNumbersValue] = useState(blank);
    const [wordsValue, setWordsValue] = useState(blank);
    const [sentenceValue, setSentenceValue] = useState(blank);

    const sentence =
        "Whenever you want to continue improving the cognitive game or anything else, just come back.";


    const controls = {
        show: true,
        download: true,
        selection: false,
        zoom: false,
        zoomin: true,
        zoomout: true,
        pan: true,
        reset: true,
        zoomEnabled: true,
        autoSelected: 'zoom'
    };

    // ---------- UI helpers ----------
    const MetricCard = ({ title, value, unit }) => (
        <div className="bg-white p-4 rounded-xl shadow-md border-l-4 border-teal-500">
            <div className="text-sm text-gray-500">{title}</div>
            <div className="text-2xl font-bold text-gray-800">
                {value} <span className="text-sm text-gray-400">{unit}</span>
            </div>
        </div>
    );

    const SpeechBlock = ({ title, data }) => (
        <div className="w-full bg-white p-6 rounded-xl shadow-lg mb-10">
            <h2 className="text-lg font-semibold mb-4 text-gray-700">{title}</h2>

            <div className="grid grid-cols-3 gap-6">
                <div className="space-y-4 border bg-gray-50 p-3 rounded-xl">
                    <MetricCard title="Speech Rate" value={data.rate} unit="wpm" />
                    <MetricCard title="Avg Pause" value={data.pause} unit="ms" />
                    <MetricCard title="Avg Pitch" value={data.pitch} unit="Hz" />
                    <MetricCard title="Loudness" value={data.loudness} unit="dB" />
                </div>
                <div className="col-span-2">
                    <CustomApexChart
                        data={[
                            {
                                seriesName: title,
                                "x-axis": data.xAxis,
                                "y-axis": data.yAxis,
                                color: "green"
                            }
                        ]}
                        chartType="line"
                        lineStyle="straight"
                        lineWidth={2}
                        controls={controls}
                    />
                </div>


            </div>
        </div>
    );

    const handleModeClick = (type) => {
        setMode(type);
        setActiveModes(prev => prev.includes(type) ? prev : [...prev, type]);
    };

    // ---------- Number / word display ----------
    useEffect(() => {
        if (mode === "numbers") {
            setNumbers(Array.from({ length: 20 }, () => Math.floor(Math.random() * 20) + 1));
        }
        if (mode === "words") {
            const list = ["lemon", "welcome", "javascript", "memory", "brain", "focus", "speech"];
            setWords(Array.from({ length: 10 }, () => list[Math.floor(Math.random() * list.length)]));
        }
    }, [mode]);

    // ---------- ThingSpeak ----------
    useEffect(() => {
        if (!THINGSPEAK_URL) return;

        const fetchData = async () => {
            const res = await fetch(THINGSPEAK_URL);
            const data = await res.json();
            if (!data.feeds?.length) return;

            const feed = data.feeds[data.feeds.length - 1];
            const time = new Date(feed.created_at).getTime();

            const parse = (field, setter) => {
                if (!field) return;
                const v = field.split(",").map(Number);

                setter(prev => ({
                    ob: v[0] || 0,
                    rate: v[1] || 0,
                    pause: v[2] || 0,
                    pitch: v[3] || 0,
                    loudness: v[4] || 0,
                    xAxis: [...prev.xAxis.slice(-50), time],
                    yAxis: [...prev.yAxis.slice(-50), v[0] || 0]
                }));
            };

            parse(feed.field2, setNumbersValue);
            parse(feed.field3, setWordsValue);
            parse(feed.field4, setSentenceValue);
        };

        fetchData();
        const id = setInterval(fetchData, 3000);
        return () => clearInterval(id);
    }, []);

    return (
        <div className="min-h-screen p-6 bg-gray-50">

            {/* Header */}
            <div className="mx-auto bg-white p-8 rounded-2xl shadow-xl mb-12">
                <h1 className="text-3xl font-bold text-gray-700">
                    Speech & Cognitive Memory Test
                </h1>
                <div className="text-center mb-8">

                    <p className="text-gray-500 mt-2">
                        Read the content aloud while your speech patterns are analyzed
                    </p>
                </div>

                {/* Mode Buttons */}
                <div className="flex justify-center gap-6 mb-10">
                    {["numbers", "words", "sentence"].map(t => (
                        <button
                            key={t}
                            onClick={() => handleModeClick(t)}
                            className={`px-8 py-3 rounded-full font-semibold tracking-wide transition-all
            ${mode === t
                                    ? "bg-gradient-to-r from-teal-500 to-teal-700 text-white shadow-lg scale-105"
                                    : "bg-gray-200 text-gray-600 hover:bg-teal-100"
                                }`}
                        >
                            {t.toUpperCase()}
                        </button>
                    ))}
                </div>

                {/* Display Area */}
                <div className="bg-gray-100 rounded-2xl p-10 min-h-[240px] flex items-center justify-center">

                    {mode === "numbers" && (
                        <div className="grid grid-cols-5 gap-6">
                            {numbers.map((num, i) => (
                                <div
                                    key={i}
                                    className="w-16 h-16 bg-white shadow-md rounded-xl flex items-center justify-center
                           text-2xl font-bold text-teal-700 hover:scale-110 transition"
                                >
                                    {num}
                                </div>
                            ))}
                        </div>
                    )}

                    {mode === "words" && (
                        <div className="flex flex-wrap justify-center gap-4 max-w-3xl">
                            {words.map((word, i) => (
                                <div
                                    key={i}
                                    className="px-6 py-3 bg-white shadow rounded-xl text-lg font-semibold text-gray-700"
                                >
                                    {word}
                                </div>
                            ))}
                        </div>
                    )}

                    {mode === "sentence" && (
                        <div className="max-w-3xl bg-white p-8 rounded-2xl shadow text-xl leading-relaxed text-gray-700 text-center">
                            {sentence}
                        </div>
                    )}

                </div>
            </div>

            {/* Charts */}
            <div className="mx-auto space-y-12">
                {activeModes.includes("numbers") && (
                    <SpeechBlock title="Numbers Speech Analysis" data={numbersValue} />
                )}

                {activeModes.includes("words") && (
                    <SpeechBlock title="Words Speech Analysis" data={wordsValue} />
                )}

                {activeModes.includes("sentence") && (
                    <SpeechBlock title="Sentence Speech Analysis" data={sentenceValue} />
                )}
            </div>

        </div>
    );

}
