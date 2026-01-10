import React, { useEffect, useState } from "react";
import { THINGSPEAK_URL } from "../../utils/ThinkSpeak";
import CustomApexChart from "../blocks/LiveChart";

export default function Speech() {
    const [mode, setMode] = useState("numbers");
    const [activeModes, setActiveModes] = useState(["numbers"]);
    const [refresh, setRefresh] = useState(false)

    const [numbers, setNumbers] = useState([]);
    const [words, setWords] = useState([]);
    const [sentence, setSentence] = useState("");

    const blank = {
        ob: 0, rate: 0, pause: 0, pitch: 0, loudness: 0,
        xAxis: [], yAxis: []
    };

    const [numbersValue, setNumbersValue] = useState(blank);
    const [wordsValue, setWordsValue] = useState(blank);
    const [sentenceValue, setSentenceValue] = useState(blank);


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
        <div className="bg-white p-4 rounded-xl shadow-md border-l-4 border-teal-500 h-28 w-60 ">
            <div className="text-sm text-gray-500">{title}</div>
            <div className="text-2xl font-bold text-gray-800">
                {value} <span className="text-sm text-gray-400">{unit}</span>
            </div>
        </div>
    );

    const SpeechBlock = ({ title, data }) => (
        <div className="w-full bg-white p-6 rounded-xl shadow-lg mb-10 ">
            <h2 className="text-lg font-semibold mb-4 text-gray-700">{title}</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-4 border bg-gray-50 p-3 rounded-xl flex gap-2 md:gap-7 flex-wrap items-center">
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
            const list = [
                "BRAIN", "MEMORY", "FOCUS", "SPEECH", "THINK",
                "MIND", "SMART", "LEARN", "RECALL", "LOGIC",
                "AWARE", "CLEAR", "VOICE", "COGNITION",
                "NEURON", "PERCEPTION", "LANGUAGE", "ATTENTION",
                "HEARING", "VISION", "RESPONSE", "REACTION",
                "ANALYSIS", "DECISION", "PROCESS", "UNDERSTAND",
                "COMMUNICATE", "PRONUNCIATION", "ARTICULATION",
                "VOCABULARY", "LISTEN", "READING", "WRITING",
                "THOUGHT", "INTELLIGENCE", "CONCENTRATION",
                "MENTAL", "VERBAL", "FLUENCY"
            ];

            setWords(Array.from({ length: 15 }, () => list[Math.floor(Math.random() * list.length)]));
        }

        if (mode === "sentence") {
            const sentenceBank = [
                "The quick brown fox jumps over the lazy dog every single day.",
                "Please speak clearly and slowly so everyone can understand your words.",
                "I enjoy learning new things because it helps my mind grow stronger.",
                "Reading aloud every day helps improve both speech and memory skills.",
                "Technology makes our daily lives easier and much more efficient.",
                "A calm and focused mind leads to better thinking and clear communication.",
                "Good communication always helps people build strong and lasting relationships.",
                "Regular practice makes your speaking more confident and more accurate.",
                "Healthy habits improve both your physical health and mental performance.",
                "Clear speech helps people understand your ideas without any confusion."
            ];

            setSentence(sentenceBank[Math.floor(Math.random() * sentenceBank.length)])
        }
    }, [mode, refresh]);

    // ---------- ThingSpeak ----------
    useEffect(() => {
        if (!THINGSPEAK_URL) return;

        const fetchData = async () => {
            const res = await fetch(THINGSPEAK_URL);
            const data = await res.json();
            if (!data.feeds?.length) return;

            const build = (field, setter) => {
                const x = [];
                const y = [];
                let latest = [0, 0, 0, 0, 0];

                data.feeds.forEach(feed => {
                    if (!feed[field]) return;

                    const values = feed[field].split(",").map(Number);
                    latest = values;

                    x.push(new Date(feed.created_at).getTime());
                    y.push(values[0]); // OB always first value
                });

                setter({
                    ob: latest[0] || 0,
                    rate: latest[1] || 0,
                    pause: latest[2] || 0,
                    pitch: latest[3] || 0,
                    loudness: latest[4] || 0,
                    xAxis: x.slice(-100),
                    yAxis: y.slice(-100)
                });
            };

            build("field2", setNumbersValue);
            build("field3", setWordsValue);
            build("field4", setSentenceValue);
        };

        fetchData();
        const id = setInterval(fetchData, 5000);
        return () => clearInterval(id);
    }, []);


    const handleRefresh = () => {
        setRefresh(!refresh)
    }



    return (
        <div className="min-h-screen p-6 bg-gray-50">

            {/* Header */}
            <div className="mx-auto bg-white p-8 rounded-2xl shadow-xl mb-12">
                <h1 className="text-3xl font-bold text-gray-700">
                    Speech Test
                </h1>
                <div className="text-center mb-8 flex justify-between">

                    <p className="text-gray-500 mt-2">
                        Read the content aloud while your speech patterns are analyzed
                    </p>

                    <button
                        onClick={handleRefresh}
                        className={`px-8 py-3 rounded-full font-semibold tracking-wide transition-all  bg-gray-200 text-gray-600 hover:bg-red-100 `} >

                        Refresh
                    </button>
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
