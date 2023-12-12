import { Gestures } from "./hookUtils";
import { useEffect, useRef, useState } from "react";
import { LandMarksMethods } from "../utils/Gestures";
import { useDebounce } from "./useDebouced";

const eqArr = (a: number[], b: number[]) => {
    return JSON.stringify(a) === JSON.stringify(b);
};

export const useRecognize = () => {
    const recognizedGestureRef = useRef<Gestures>(null);
    const debouncedValue = useDebounce(recognizedGestureRef.current, 100);
    const [recognizedGesture, setRecongnizedGesture] = useState<Gestures>(null);

    useEffect(() => {
        setRecongnizedGesture(recognizedGestureRef.current);
    }, [debouncedValue]);

    const recognizeGesture = (landMarks: LandMarksMethods) => {
        const fingersUp = landMarks.fingersUp();
        // console.log(fingersUp);
        if (fingersUp) {
            if (eqArr(fingersUp, [0, 1, 1, 0, 0])) {
                if (landMarks.results[8].y > landMarks.results[7].y) {
                    recognizedGestureRef.current = "Left Click";
                } else if (landMarks.results[12].y > landMarks.results[11].y) {
                    recognizedGestureRef.current = "Right Click";
                } else {
                    recognizedGestureRef.current = "Mouse Moving";
                }
            } else if (eqArr(fingersUp, [0, 1, 0, 0, 0])) {
                recognizedGestureRef.current = "Drawing";
            } else if (eqArr(fingersUp, [1, 1, 0, 0, 0])) {
                recognizedGestureRef.current = "Drawing pause";
            } else if (eqArr(fingersUp, [0, 1, 0, 0, 1])) {
                recognizedGestureRef.current = "Volume Change";
            } else if (
                eqArr(fingersUp.slice(1), [1, 1, 1, 1]) &&
                landMarks.findDistance(4, 12) < 30
            ) {
                recognizedGestureRef.current = "Next track";
            } else if (eqArr(fingersUp.slice(1), [1, 1, 1, 1])) {
                if (landMarks.findDistance(4, 16) < 30) {
                    recognizedGestureRef.current = "Previous track";
                } else if (landMarks.findDistance(4, 12) < 30) {
                    recognizedGestureRef.current = "Next track";
                } else if (landMarks.findDistance(4, 20) < 30) {
                    recognizedGestureRef.current = "Space";
                } else if (landMarks.findDistance(4, 8) < 30) {
                    recognizedGestureRef.current = "Backspace";
                } else if (eqArr(fingersUp.slice(0, 1), [0])) {
                    recognizedGestureRef.current = "Play/Pause";
                } else {
                    recognizedGestureRef.current = "None Gesture";
                }
            } else if (eqArr(fingersUp, [0, 1, 1, 1, 1])) {
                recognizedGestureRef.current = "Play/Pause";
            } else if (eqArr(fingersUp, [1, 0, 0, 0, 0])) {
                recognizedGestureRef.current = "Enter";
            } else {
                recognizedGestureRef.current = "None Gesture";
            }
        }
    };

    return { recognizeGesture, recognizedGesture };
};
