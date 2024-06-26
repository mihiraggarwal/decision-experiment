export default function Prompt({plural, radio}: {plural: boolean, radio: boolean}) {
    if (!radio) {
        if (plural == true) {
            return (<p className="text-left w-full">Suppose you are offered <i>one</i> of these bets and could sell it instead of playing it out. What is the lowest price at which you would be willing to sell each of them?</p>)
        } else {
            return (<p className="text-left w-full">Suppose you are offered this bet and could sell it instead of playing it out. What is the lowest price at which you would be willing to sell it?</p>)
        }
    }
    return (<p className="text-left w-full">Which of these bets would you choose to play?</p>)
}