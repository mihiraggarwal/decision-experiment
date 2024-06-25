import Note from "./note";

export default function Dialog() {
    return (
        <div className="bg-white border-2 border-black rounded-md p-5">
            <div className="flex flex-col gap-10">
                <Note />
            </div>
        </div>
    )
}