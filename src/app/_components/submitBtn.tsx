import { useFormStatus } from "react-dom";
import toast from "react-hot-toast";

export default function SubmitBtn() {
    const { pending, data } = useFormStatus()

    return (
        <button
            type="submit"
            className={`border border-black rounded-md py-2 px-5 ${pending ? "bg-gray-300" : "bg-white"}`}
            disabled={pending}
        >
            {pending ? "Submitting..." : "Submit"}
        </button>
    )
}