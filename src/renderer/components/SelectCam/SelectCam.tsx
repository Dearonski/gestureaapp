import { useEffect, useState } from "react";
import { VideoCameraIcon, ChevronDownIcon } from "@heroicons/react/24/solid";
import { CheckIcon } from "@heroicons/react/20/solid";
import { Button } from "../Button/Button";
import { AnimatePresence, motion } from "framer-motion";
import { useAppDispatch, useAppSelector } from "../../hooks/reduxHooks";
import { camSelector, setVideoInput } from "../../reducers/camSlice";

export const SelectCam = () => {
    const [videoInputs, setVideoInputs] = useState<MediaDeviceInfo[]>();
    const [opened, setOpened] = useState<boolean>(false);
    const selectedVideoInput = useAppSelector(camSelector).selectedVideoInput;
    const dispatch = useAppDispatch();

    const open = () => {
        setOpened(!opened);
    };

    const chooseVideoInput = (videoInput: MediaDeviceInfo) => {
        dispatch(setVideoInput(videoInput));
        setOpened(false);
    };

    const initVideoInputs = async () => {
        navigator.mediaDevices.enumerateDevices().then((devices) => {
            const videoDevices = devices.filter(
                (device) => device.kind === "videoinput"
            );
            setVideoInputs(videoDevices);
            dispatch(setVideoInput(videoDevices[0]));
        });
    };

    useEffect(() => {
        initVideoInputs();
    }, []);

    return (
        <div className="relative">
            <Button
                className="font-medium grid grid-cols-[24px_auto_24px] items-center gap-x-3 p-3 text-left w-full"
                onClick={open}
            >
                <VideoCameraIcon />
                <span>
                    {selectedVideoInput &&
                        selectedVideoInput.label.split("(", 1)}
                </span>
                <ChevronDownIcon
                    className={`${
                        opened && "rotate-180"
                    } transition-transform duration-300`}
                />
            </Button>
            <AnimatePresence>
                {opened && (
                    <motion.div
                        className="mt-2 absolute z-20 bg-indigo-600 rounded-xl overflow-hidden w-full shadow-2xl"
                        initial={{ height: 0 }}
                        animate={{
                            height: "auto",
                        }}
                        exit={{ height: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        {videoInputs &&
                            videoInputs.map((videoInput) => (
                                <Button
                                    key={videoInput.label}
                                    onClick={() => chooseVideoInput(videoInput)}
                                    className="font-medium grid grid-cols-[auto_20px] items-center gap-x-3 text-left px-3 py-1.5 w-full"
                                >
                                    {videoInput.label.split("(", 1)}
                                    {videoInput === selectedVideoInput && (
                                        <CheckIcon />
                                    )}
                                </Button>
                            ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
