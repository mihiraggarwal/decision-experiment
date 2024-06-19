export default function Prompt({plural}: {plural: boolean}) {
    if (plural == true) {
        return (<p className="text-left w-full">You have a choice of either playing out the ticket and receiving the reward corresponding to the ball that is drawn or selling the ticket for a sure amount. What is the lowest amount at which you would be willing to sell these tickets?</p>)
    } else {
        return(<p className="text-left w-full">You have a choice of either playing out the ticket and receiving the reward corresponding to the ball that is drawn or selling the ticket for a sure amount. What is the lowest amount at which you would be willing to sell this ticket?</p>)
    }
}