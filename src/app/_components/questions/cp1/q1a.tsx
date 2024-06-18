export default function CP1_Q1a() {
    return (
            <div className="flex flex-col gap-5 items-center">
                <p>There is a bag placed in front of you. The bag is filled with exactly 30 blue balls and 60 balls that may each be either red or green. You do not know the exact number of balls that are red or green.</p>

                <p>You are offered a ticket for a game that plays out as follows. First, you must draw a ball from the bag without looking. If the drawn ball is blue, you receive INR 300. If not, you receive nothing.</p>

                <table> 
                    <tbody>
                        <tr>
                            <td></td>
                            <th>30 balls</th>
                            <th colSpan={2}>60 balls</th>
                        </tr>
                        <tr>
                            <td></td>
                            <th>Blue</th>
                            <th>Red</th>
                            <th>Black</th>
                        </tr>
                        <tr>
                            <th>Rewards</th>
                            <td>300</td>
                            <td>0</td>
                            <td>0</td>
                        </tr>
                    </tbody>
                </table>

                <p className="text-left w-full">In the table below, in each row, indicate whether you would choose the specified monetary amount or the ticket to play the above game.</p>
            </div>
    )
}