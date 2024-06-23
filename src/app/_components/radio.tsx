export default function Radio({value, label, name="price1"}: {value: number, label: string, name?: string}) {
    return (
        <div className="flex flex-row border border-black rounded-md py-2 px-4">
            <label className="">
                <input type="radio" name={name} value={value} className="mr-4" required></input>{label}
            </label>
        </div>
    )
}