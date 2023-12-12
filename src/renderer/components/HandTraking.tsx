import { useEffect, useRef, useState } from "react";
import { Button } from "./Button/Button";
import { AnimatePresence, motion } from "framer-motion";
import { useHandLandMarker } from "../hooks/useHandLandMarker";
import { useTranslation } from "react-i18next";
import { useRecognize } from "../hooks/useRecognize";
import { useExecuteGesture } from "../hooks/useExecuteGesture";
import { LandMarksMethods } from "../utils/Gestures";

export const HandTraking = () => {
    const [webcamRunning, setWebcamRunning] = useState<boolean>(false);
    const { t } = useTranslation();
    const videoRef = useRef<HTMLVideoElement>(null);
    const videoCanvasRef = useRef<HTMLCanvasElement>(null);
    const drawingCanvasRef = useRef<HTMLCanvasElement>(null);
    const { enableCam, predictWebcam, results, drawingCanvasCtx } =
        useHandLandMarker(
            webcamRunning,
            setWebcamRunning,
            videoRef,
            videoCanvasRef,
            drawingCanvasRef
        );
    const { executeGesture } = useExecuteGesture();
    const { recognizeGesture, recognizedGesture } = useRecognize();
    const landMarks = useRef<LandMarksMethods>(null);

    useEffect(() => {
        if (results) {
            landMarks.current = new LandMarksMethods(
                results,
                videoRef.current.videoWidth,
                videoRef.current.videoHeight
            );
            recognizeGesture(landMarks.current);
        }
    }, [results]);

    useEffect(() => {
        console.log(recognizedGesture);
        if (results && results.landmarks[0]) {
            executeGesture(
                recognizedGesture,
                landMarks.current,
                drawingCanvasCtx.current
            );
        }
    });

    return (
        <div>
            <div className="relative h-[calc(100vh-132px)] w-full mb-3 overflow-hidden rounded-xl flex items-center justify-center">
                <AnimatePresence>
                    {!webcamRunning && (
                        <motion.div
                            className="w-full h-full absolute z-20"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.7 }}
                        >
                            <motion.div
                                className="bg-gradient-to-tr from-fuchsia-600 via-sky-600 to-red-600 w-full h-full bg-size-400 flex items-center justify-center"
                                animate={{
                                    backgroundPositionX: ["0%", "100%", "0%"],
                                    backgroundPositionY: ["50%", "50%", "50%"],
                                }}
                                transition={{
                                    duration: 20,
                                    ease: "easeInOut",
                                    repeat: Infinity,
                                }}
                            ></motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
                <video
                    autoPlay
                    ref={videoRef}
                    onLoadedData={predictWebcam}
                    className="absolute h-full w-full object-fill blur-[256px] rotate-y-180"
                />
                <canvas
                    ref={videoCanvasRef}
                    className="pointer-events-none h-full max-w-full w-auto object-contain absolute z-10"
                />
                <canvas
                    ref={drawingCanvasRef}
                    className="pointer-events-none h-full max-w-full w-auto object-contain absolute z-20"
                />
            </div>
            <Button
                onClick={enableCam}
                className="w-full font-medium text-lg grid grid-cols-[auto_40px_170px_auto] items-center gap-x-4"
            >
                <motion.div
                    animate={
                        webcamRunning
                            ? { rotate: -90, scale: 3.5 }
                            : { rotate: -120, scale: 3.5 }
                    }
                    transition={{ duration: 0.7 }}
                    className={`w-9 h-9 rounded-full col-start-2`}
                >
                    <div
                        className={`h-9 w-9 bg-white absolute transition-[clip-path] duration-700 ${
                            webcamRunning ? "pause_1" : "play_1"
                        }`}
                    ></div>
                    <div
                        className={`h-9 w-9 bg-white absolute transition-[clip-path] duration-700 ${
                            webcamRunning ? "pause_2" : "play_2"
                        }`}
                    ></div>
                </motion.div>
                <span className="text-left">
                    {webcamRunning ? t("Turn off camera") : t("Turn on camera")}
                </span>
            </Button>
        </div>
    );
};
