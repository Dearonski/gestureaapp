import { useEffect, useRef, useState } from "react";
import { Point } from "@nut-tree/nut-js";
import { InferenceSession, Tensor, env } from "onnxruntime-web";
import { Gestures, clearCanvas } from "./hookUtils";

import { LandMarksMethods } from "../utils/Gestures";

const drawLine = (
    ctx: CanvasRenderingContext2D,
    fromX: number,
    fromY: number,
    toX: number,
    toY: number
) => {
    ctx.beginPath();
    ctx.moveTo(fromX, fromY);
    ctx.lineTo(toX, toY);
    ctx.closePath();
    ctx.stroke();
};

export const useExecuteGesture = () => {
    const lastGesture = useRef<Gestures>(null);
    const mousePos = useRef<Point>(null);
    const mouseTrackingCoords = useRef<Point>(null);
    const lastVolume = useRef<number>(0);
    const timer = useRef<boolean>(false);
    const lastDrawing = useRef<Point>(null);
    const [letters, setLetters] = useState<InferenceSession>(null);

    const clearTimer = () => {
        setTimeout(() => {
            timer.current = false;
        }, 700);
    };

    const loadModel = async () => {
        env.wasm.wasmPaths = "static://dist/";
        setLetters(await InferenceSession.create("static://eng.onnx"));
    };

    useEffect(() => {
        loadModel();
    }, []);

    useEffect(() => {
        window.electronAPI.responseMousePos((pos: Point) => {
            mousePos.current = pos;
        });
    }, [window.electronAPI.responseMousePos]);

    const executeGesture = async (
        gesture: Gestures,
        landMarks: LandMarksMethods,
        drawingCtx: CanvasRenderingContext2D
    ) => {
        switch (gesture) {
            case "Drawing":
                if (lastDrawing.current === null) {
                    const trackingFinger = landMarks.results[8];
                    lastDrawing.current = {
                        x: trackingFinger.x,
                        y: trackingFinger.y,
                    };
                }
                if (drawingCtx) {
                    const trackingFinger = landMarks.results[8];

                    drawLine(
                        drawingCtx,
                        lastDrawing.current.x,
                        lastDrawing.current.y,
                        trackingFinger.x,
                        trackingFinger.y
                    );
                    lastDrawing.current = {
                        x: trackingFinger.x,
                        y: trackingFinger.y,
                    };
                }

                break;
            case "Mouse Moving":
                if (lastGesture.current !== "Mouse Moving") {
                    window.electronAPI.requestMousePos();
                    const trackingFinger = landMarks.results[5];
                    mouseTrackingCoords.current = {
                        x: trackingFinger.x,
                        y: trackingFinger.y,
                    };
                }
                if (mouseTrackingCoords.current && mousePos.current) {
                    const trackingFinger = landMarks.results[5];
                    const x =
                        (mouseTrackingCoords.current.x - trackingFinger.x) *
                            1.14 +
                        mousePos.current.x;
                    const y =
                        (trackingFinger.y - mouseTrackingCoords.current.y) *
                            1.14 +
                        mousePos.current.y;
                    window.electronAPI.moveMouse(x, y);
                }
                break;
            case "Volume Change":
                if (lastVolume.current) {
                    const volume = landMarks.results[9].y;
                    const volumeDiff = Math.abs(lastVolume.current - volume);
                    if (volumeDiff > 10 && volume < lastVolume.current) {
                        window.electronAPI.volumeUp();
                    } else if (volumeDiff > 10 && volume > lastVolume.current) {
                        window.electronAPI.volumeDown();
                    }
                    lastVolume.current = landMarks.results[9].y;
                } else {
                    lastVolume.current = landMarks.results[9].y;
                }
                break;
            case "Next track":
                if (!timer.current) {
                    window.electronAPI.nextTrack();
                    timer.current = true;
                    clearTimer();
                }
                break;
            case "Previous track":
                if (!timer.current) {
                    window.electronAPI.previousTrack();
                    timer.current = true;
                    clearTimer();
                }
                break;
            case "Play/Pause":
                if (!timer.current && lastGesture.current != "Play/Pause") {
                    window.electronAPI.playTrack();
                    timer.current = true;
                    clearTimer();
                }
                break;
            case "Left Click":
                if (!timer.current) {
                    window.electronAPI.leftClick();
                    timer.current = true;
                    clearTimer();
                }
                break;
            case "Right Click":
                if (!timer.current) {
                    window.electronAPI.rightClick();
                    timer.current = true;
                    clearTimer();
                }
                break;
            default:
                lastVolume.current = 0;
                mousePos.current = null;
                mouseTrackingCoords.current = null;
                lastDrawing.current = null;
                if (lastGesture.current === "Drawing" && !timer.current) {
                    const imageData = drawingCtx.getImageData(
                        0,
                        0,
                        1280,
                        720
                    ).data;

                    const [redArray, greenArray, blueArray] = [
                        new Array<number>(),
                        new Array<number>(),
                        new Array<number>(),
                    ];

                    for (let i = 0; i < imageData.length; i += 4) {
                        redArray.push(imageData[i]);
                        greenArray.push(imageData[i + 1]);
                        blueArray.push(imageData[i + 2]);
                    }

                    const transposedData = redArray
                        .concat(greenArray)
                        .concat(blueArray);

                    let i;
                    const l = transposedData.length;
                    const float32Data = new Float32Array(3 * 720 * 1280);
                    for (i = 0; i < l; i++) {
                        float32Data[i] = transposedData[i] / 255.0;
                    }

                    const inputTensor = new Tensor(
                        "float32",
                        float32Data,
                        [3, 720, 1280]
                    );

                    const feeds: Record<string, Tensor> = {};
                    feeds[letters.inputNames[0]] = inputTensor;
                    const results = await letters.run(feeds);

                    console.log(results);

                    clearCanvas(drawingCtx, 1280, 720);
                    timer.current = true;
                    clearTimer();
                }
        }
        if (lastGesture.current !== gesture) {
            lastGesture.current = gesture;
        }
    };

    return { executeGesture };
};
