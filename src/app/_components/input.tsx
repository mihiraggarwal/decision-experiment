export default function Input({placeholder}: {placeholder: string}) {
    return <input type="text" placeholder={placeholder} className="text-white p-2 bg-gray-800 rounded-md w-80"></input>
}