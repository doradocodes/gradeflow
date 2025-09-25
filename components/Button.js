export default function Button({ children, type = 'button', onClick, className }) {
    return <button
        type={type}
        className={`${className} bg-black text-white rounded-full py-3 px-3 font-bold hover:bg-gray-500 transition-colors flex items-center gap-2`}
        onClick={onClick}
    >
        {children}
    </button>
}
