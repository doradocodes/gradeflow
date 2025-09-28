export default function Button({ children, type = 'button', onClick, className = '' }) {
    return <button
        type={type}
        className={`bg-gradient-to-r from-indigo-500 to-blue-500 text-white font-bold py-2 px-4 rounded-md hover:bg-indigo-600 hover:to-blue-600 transition ease-in-out duration-150 cursor-pointer flex justify-center items-center gap-2 ${className}`}
        onClick={onClick}
    >
        {children}
    </button>
}
