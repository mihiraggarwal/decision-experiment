export default function Input({placeholder, name, type}: {placeholder: string, name: string, type: string}) {
    return <input type={type} placeholder={placeholder} name={name} className="text-black p-2 bg-gray-200 rounded-md w-80" required></input>
}