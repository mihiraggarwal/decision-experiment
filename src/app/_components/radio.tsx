export default function Radio({value, label}: {value: number, label: string}) {
    return (
        <div className="flex flex-row border border-black rounded-md py-2 px-4">
            <label className="">
                <input type="radio" name="price1" value={value} className="mr-4" required></input>{label}
            </label>
        </div>
    )
}