export default function Input({type, name, label, value, onChange, required}) {
    return (
        <input
            className="bg-gray-100 text-gray-900 border-0 rounded-md p-2 focus:bg-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500 transition ease-in-out duration-150 w-full"
            type={type}
            id={name}
            name={name}
            placeholder={label}
            value={value}
            onChange={onChange}
            required={required}
        />
    );
}