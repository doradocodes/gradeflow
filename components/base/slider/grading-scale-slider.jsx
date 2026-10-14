'use client';

const NOTCHES = ['lenient', 'medium', 'strict'];

const NOTCH_COLORS = {
    lenient: { active: 'bg-green-600 text-white', inactive: 'hover:bg-green-50' },
    medium:  { active: 'bg-yellow-500 text-white', inactive: 'hover:bg-yellow-50' },
    strict:  { active: 'bg-red-600 text-white', inactive: 'hover:bg-red-50' },
};

/**
 * GradingScaleSlider — a 3-option button group for choosing grading leniency.
 *
 * Props:
 *   value      – 'lenient' | 'medium' | 'strict'
 *   onChange   – (value: string) => void
 *   disabled   – boolean
 */
export function GradingScaleSlider({ value = 'medium', onChange, disabled = false }) {
    return (
        <div className="flex rounded-lg overflow-hidden border border-gray-200 w-max">
            {NOTCHES.map((notch, i) => {
                const isSelected = value === notch;
                return (
                    <button
                        key={notch}
                        type="button"
                        disabled={disabled}
                        onClick={() => onChange?.(notch)}
                        className={[
                            'px-3 py-1.5 text-sm font-medium capitalize transition-colors cursor-pointer',
                            i > 0 && 'border-l border-gray-200',
                            isSelected
                                ? NOTCH_COLORS[notch].active
                                : `bg-white ${NOTCH_COLORS[notch].inactive}`,
                            disabled && 'cursor-not-allowed opacity-50',
                        ].filter(Boolean).join(' ')}
                    >
                        {notch}
                    </button>
                );
            })}
        </div>
    );
}

export { NOTCHES as GRADING_SCALE_NOTCHES }; // eslint-disable-line
