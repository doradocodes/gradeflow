export default function Tag({ color, className = '', children }) {
    return <span
        className={`inline-block bg-${color}-100 text-${color}-800 text-xs px-3 py-2 rounded-full uppercase font-bold ${className}`}
    >{children}</span>
}