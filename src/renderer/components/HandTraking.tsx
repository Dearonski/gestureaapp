import { useEffect, useRef, useState } from "react";
import { HandLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";
import { drawConnectors, drawLandmarks } from "@mediapipe/drawing_utils";
import { HAND_CONNECTIONS } from "@mediapipe/hands";

export const HandTraking = () => {
    const [handLandmarker, sethandLandmarker] = useState<HandLandmarker | null>(
        null
    );
    const [webcamRunning, setWebcamRunning] = useState<boolean>(false);

    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const requestRef = useRef<number>(0);

    useEffect(() => {
        const createHandLandmarker = async () => {
            const vision = await FilesetResolver.forVisionTasks(
                "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm"
            );
            sethandLandmarker(
                await HandLandmarker.createFromOptions(vision, {
                    baseOptions: {
                        modelAssetPath: `https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task`,
                    },
                    runningMode: "VIDEO",
                })
            );
        };
        createHandLandmarker();
    }, []);

    const enableCam = async () => {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: true,
        });

        if (videoRef.current && canvasRef.current) {
            if (webcamRunning === true) {
                cancelAnimationFrame(requestRef.current);
                const tracks = stream.getTracks();

                tracks.forEach((track) => {
                    track.stop();
                });
                const canvasCtx = canvasRef.current.getContext(
                    "2d"
                ) as CanvasRenderingContext2D;
                canvasCtx.clearRect(
                    0,
                    0,
                    canvasRef.current.width,
                    canvasRef.current.height
                );
            }
            videoRef.current.srcObject = webcamRunning ? null : stream;

            setWebcamRunning(!webcamRunning);
        }
    };

    const predictWebcam = () => {
        if (
            canvasRef.current &&
            videoRef.current &&
            handLandmarker &&
            webcamRunning
        ) {
            canvasRef.current.width = videoRef.current.videoWidth;
            canvasRef.current.height = videoRef.current.videoHeight;

            const canvasCtx = canvasRef.current.getContext(
                "2d"
            ) as CanvasRenderingContext2D;

            const startTimeMs = performance.now();
            const results = handLandmarker.detectForVideo(
                videoRef.current,
                startTimeMs
            );

            canvasCtx.save();

            if (results && results.landmarks) {
                results.landmarks.forEach((landmarks) => {
                    drawConnectors(canvasCtx, landmarks, HAND_CONNECTIONS, {
                        color: "#FFFFFF",
                        lineWidth: 5,
                    });
                    drawLandmarks(canvasCtx, landmarks, {
                        color: "",
                        lineWidth: 1,
                        radius: 4,
                    });
                });
            }

            requestRef.current = requestAnimationFrame(predictWebcam);
        }
    };

    return (
        <div>
            <button onClick={enableCam}>
                {webcamRunning ? "Выключить камеру" : "Включить камеру"}
            </button>
            <video
                autoPlay
                playsInline
                ref={videoRef}
                onLoadedData={predictWebcam}
                className="absolute"
                style={{ transform: "rotateY(180deg)" }}
            />
            <canvas
                ref={canvasRef}
                className="absolute z-10 pointer-events-none"
                style={{ transform: "rotateY(180deg)" }}
            />
        </div>
    );
};
