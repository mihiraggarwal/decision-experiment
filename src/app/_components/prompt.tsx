export default function Prompt({plural, radio}: {plural: boolean, radio: boolean}) {
    if (!radio) {
        if (plural == true) {
            return (<p className="text-left w-full">You have a choice of either playing out the ticket and receiving the reward corresponding to the ball that is drawn or selling the ticket for a sure amount. What is the lowest amount at which you would be willing to sell this ticket?</p>)
        } else {
            return(<p className="text-left w-full">You have a choice of either playing out the ticket you were offered and receiving the reward corresponding to the ball that is drawn or selling the ticket for a sure amount. What is the lowest amount at which you would be willing to sell these tickets?</p>)
        }
    }
    return (<p className="text-left w-full">Which of these tickets would you choose to take?</p>)
}