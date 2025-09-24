export default function Button({ children, onClick, className }) {
    return <button
        className={`${className} bg-black text-white rounded-full py-3 px-3 font-bold hover:bg-gray-500 transition-colors`}
        onClick={onClick}
    >
        {children}
    </button>
}
