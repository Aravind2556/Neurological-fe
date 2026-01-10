import React, { useEffect, useRef, useState } from "react";
import { FaceMesh } from "@mediapipe/face_mesh";
import { Camera } from "@mediapipe/camera_utils";

const EyeTrackingMotorTest = () => {
    const videoRef = useRef(null);
    const ballRef = useRef(null);

    const [cameraOn, setCameraOn] = useState(false);
    const [moving, setMoving] = useState(false);
    const [focus, setFocus] = useState("idle"); // green | red

    let moveInterval = useRef(null);

    // START CAMERA + FACEMESH
    const startCamera = () => {
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
    };

    // FACEMESH RESULTS
    const onResults = (results) => {
        if (!results.multiFaceLandmarks?.length) return;

        const landmarks = results.multiFaceLandmarks[0];

        // Eye landmarks (simplified)
        const leftEye = landmarks[468]; // iris
        const rightEye = landmarks[473];

        const eyeX = (leftEye.x + rightEye.x) / 2;
        const eyeY = (leftEye.y + rightEye.y) / 2;

        // Ball position
        const ball = ballRef.current.getBoundingClientRect();
        const board = ballRef.current.parentElement.getBoundingClientRect();

        const ballX = (ball.left - board.left) / board.width;
        const ballY = (ball.top - board.top) / board.height;

        const threshold = 0.08;

        if (
            Math.abs(eyeX - ballX) < threshold &&
            Math.abs(eyeY - ballY) < threshold
        ) {
            setFocus("green");
        } else {
            setFocus("red");
        }
    };

    // BALL MOVEMENT
    const startTest = () => {
        if (!cameraOn) {
            alert("Camera ON pannunga");
            return;
        }

        setMoving(true);

        moveInterval.current = setInterval(() => {
            const x = Math.random() * 260;
            const y = Math.random() * 160;
            ballRef.current.style.transform = `translate(${x}px, ${y}px)`;
        }, 600);

        setTimeout(() => {
            clearInterval(moveInterval.current);
            setMoving(false);
        }, 10000);
    };

    return (
        <div className="p-6 space-y-4">

            <video ref={videoRef} className="hidden" />

            <button
                onClick={startCamera}
                className="px-4 py-2 bg-blue-600 text-white rounded"
            >
                Camera ON
            </button>

            <div className="relative w-[320px] h-[200px] bg-white border-2 rounded">
                <div
                    ref={ballRef}
                    className={`w-6 h-6 rounded-full absolute transition-all
            ${focus === "green" ? "bg-green-500" : focus === "red" ? "bg-red-500" : "bg-black"}
          `}
                />
            </div>

            <button
                onClick={startTest}
                disabled={moving}
                className="px-4 py-2 bg-green-600 text-white rounded disabled:opacity-50"
            >
                START TEST
            </button>

        </div>
    );
};

export default EyeTrackingMotorTest;
