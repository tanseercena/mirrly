import React, { useCallback, useRef, useState } from "react";
import { HexColorPicker } from "react-colorful";
import "./Styles.css";
import UseClickOutside from "./UseClickOutside";

export const PopoverPicker = ({ color, onChange }) => {
    const popover = useRef();
    const [isOpen, toggle] = useState(false);

    const close = useCallback(() => toggle(false), []);
    UseClickOutside(popover, close);

    return (
        <div className="picker">
            <div
                className="swatch"
                style={{ backgroundColor: color }}
                onClick={() => toggle(true)}
            />

            {isOpen && (
                <div className="popover" ref={popover}>
                    <HexColorPicker color={color} onChange={onChange} />
                </div>
            )}
        </div>
    );
};
