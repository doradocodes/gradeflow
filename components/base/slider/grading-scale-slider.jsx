'use client';

import { Slider } from "@/components/base/slider/slider";

const NOTCHES = ['lenient', 'medium', 'strict'];

/**
 * GradingScaleSlider — a 3-notch slider for choosing grading leniency.
 *
 * Props:
 *   value      – 'lenient' | 'medium' | 'strict'
 *   onChange   – (value: string) => void
 *   disabled   – boolean
 */
export function GradingScaleSlider({ value = 'medium', onChange, disabled = false }) {
    const index = Math.max(0, NOTCHES.indexOf(value) !== -1 ? NOTCHES.indexOf(value) : 1);

    return (
        <div className="flex flex-col gap-0 min-w-[140px]">
            <Slider
                minValue={0}
                maxValue={2}
                step={1}
                value={index}
                isDisabled={disabled}
                onChange={(val) => onChange?.(NOTCHES[val])}
                labelPosition="default"
                formatOptions={undefined}
                labelFormatter={(val) => NOTCHES[val].charAt(0).toUpperCase() + NOTCHES[val].slice(1)}
            />
            <div className="flex justify-between -mt-1">
                {NOTCHES.map((notch, i) => (
                    <span
                        key={notch}
                        className={`text-[10px] font-medium capitalize transition-colors ${
                            index === i ? 'text-primary font-semibold' : 'text-tertiary'
                        }`}
                    >
                        {notch}
                    </span>
                ))}
            </div>
        </div>
    );
}

export { NOTCHES as GRADING_SCALE_NOTCHES }; // eslint-disable-line

