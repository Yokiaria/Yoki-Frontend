import React from 'react';

/**
 * AnimatedCounter (Kini Instan - Animasi Dihapus sesuai permintaan)
 * Langsung menampilkan angka aslinya tanpa hitungan dari 0.
 */
interface AnimatedCounterProps {
    targetValue: number;
    duration?: number;
    format?: boolean;
}

export function AnimatedCounter({ targetValue, format = true }: AnimatedCounterProps) {
    return <span>{format ? targetValue.toLocaleString('id-ID') : targetValue}</span>;
}

/**
 * AnimatedProgressBar
 * Langsung menampilkan bar penuh (namun transisi CSS tetap ada jika nilai targetWidth berubah secara dinamis di klien).
 */
interface AnimatedProgressBarProps {
    targetWidth: number;
    duration?: number;
    className?: string;
    barClassName?: string;
}

export function AnimatedProgressBar({ 
    targetWidth, 
    duration = 1500,
    className = "w-full bg-gray-100 dark:bg-gray-800 rounded-full h-4 overflow-hidden shadow-inner",
    barClassName = "bg-gradient-to-r from-[#eec209] to-[#fed023] h-full rounded-full shadow-sm"
}: AnimatedProgressBarProps) {
    const width = Math.min(100, Math.max(0, targetWidth));

    return (
        <div className={className}>
            <div 
                className={`${barClassName} transition-all ease-out`}
                style={{ 
                    width: `${width}%`,
                    transitionDuration: `${duration}ms`
                }}
            />
        </div>
    );
}
