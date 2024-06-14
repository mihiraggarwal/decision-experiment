export default function Input({placeholder}: {placeholder: string}) {
    return <input type="text" placeholder={placeholder} className="text-black p-2 bg-gray-200 rounded-md w-80"></input>
}