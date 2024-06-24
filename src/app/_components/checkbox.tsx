export default function Checkbox({name, value, label}: {name: string, value: number, label: string}) {
    return (
        <div className="flex flex-row border border-black rounded-md py-2 px-4">
            <label className="">
                <input type="checkbox" name={name} value={value} className="mr-4"></input>{label}
            </label>
        </div>
    )
}