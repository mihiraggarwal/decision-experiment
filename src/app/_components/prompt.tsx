export default function Prompt({plural, radio}: {plural: boolean, radio: boolean}) {
    if (!radio) {
        if (plural == true) {
            return (<p className="text-left w-full">Suppose you could sell the ticket you were offered instead of playing out the bet. What is the lowest amount at which you would be willing to sell these tickets?</p>)
        } else {
            return (<p className="text-left w-full">Suppose you could sell the ticket instead of playing out the bet. What is the lowest price at which you would be willing to sell this ticket?</p>)
        }
    }
    return (<p className="text-left w-full">Which of these tickets would you choose to take?</p>)
}