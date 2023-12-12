import { Card } from "../components/Card/Card";
import { CheckBox } from "../components/CheckBox/CheckBox";
import { HandTraking } from "../components/HandTraking";
import { SelectCam } from "../components/SelectCam/SelectCam";
import { gestures } from "../utils/types";

export const Main = () => {
    return (
        <div className="grid grid-cols-[auto_270px] items-center gap-x-5">
            <HandTraking />
            <div className="space-y-4">
                <SelectCam />
                <Card className="space-y-4 w-full">
                    {gestures.map((gesture, indx) => (
                        <CheckBox
                            key={indx}
                            className="w-full"
                            title={gesture}
                        />
                    ))}
                </Card>
            </div>
        </div>
    );
};
