import Img from "./img";

export default function Note() {
    return (
        <>
            <div className="flex flex-col gap-5">
                
                <p className="font-bold">Overstating the selling price</p>
                <p>Suppose you state a price greater than the lowest price at which you are actually willing to sell this bet.</p>

                <div className="flex flex-col gap-5 md:flex-row w-full justify-center">
                    <Img url="/assets/training/overstate.png" /> 
                </div>

                <p>If the generated buying price lies between your true lowest selling price and your stated selling price (orange zone), the bet goes unsold. However, by your true valuation, you would prefer that the bet be sold at this price. Since the algorithm generates numbers in this range with positive probability, you are left worse off in such scenarios.</p>
            
            </div>

            <div className="flex flex-col gap-5">

                <p className="font-bold">Understating the selling price</p>
                <p>Suppose you state a selling price less than the lowest price at which you are actually willing to sell this bet.</p>

                <div className="flex flex-col gap-5 md:flex-row w-full justify-center">
                    <Img url="/assets/training/understate.png" /> 
                </div>

                <p>If the generated buying price lies between your stated selling price and your true lowest selling price (orange zone), the bet is sold. However, by your true valuation, you would prefer to play the bet than sell it at this price. Since the algorithm generates numbers in this range with positive probability, you are again left worse off in such scenarios.</p>
            
            </div>

            <div className="flex flex-col gap-5">

                <p className="font-bold">Truthfully stating the selling price</p>
                <p>It is, therefore, in your interest that you state your selling price truthfully.</p>

                <div className="flex flex-col gap-5 md:flex-row w-full justify-center">
                    <Img url="/assets/training/truthful.png" /> 
                </div>

            </div>
        </>
    )
}