export default async function details(challenge: {cp?: Number, part?: Number, bet?: Number}) {
    let colours: string[] = []
    let balls: number[][] = []
    switch (challenge.cp) {
        case 1:
            balls = [[1, 1], [1, 1], [4, 4]]
            colours = ["Purple", "White", "Red", "Yellow", "Blue", "Green"]
            break;
        case 2:
            balls = [[1, 1], [1, 1], [2, 2]]
            colours = ["Blue", "Yellow", "Pink", "Orange"]
            break;
        case 3:
            switch (challenge.bet) {
                case 1:
                    balls = [[1, 1], [1, 7]]
                    colours = ["Chosen Colour", "Other Colours"]
                    break;
                case 2:
                    balls = [[2, 8]]
                    colours = ["Chosen Colour", "Other Colours"]
                    break;
            }
            break;
        case 4:
            switch (challenge.bet) {
                case 1:
                case 2:
                    balls = [[1, 1], [2, 2]]
                    colours = ["Green", "Red", "Purple"]
                    break;
                case 3:
                    balls = [[1, 1], [1, 1]]
                    colours = ["Yellow", "Cyan"]
                    break;
            }
    }

    return {colours, balls}
}