"use client";
import Image from "next/image";

import Input from "../_components/input"
import { useState } from "react";

// import Protocols from "../_components/protocols";
import { useSession } from "next-auth/react";

const proceed = (setChoice: Function) => {
    setChoice((n: number) => n+1)
}

const Instructions = ({setChoice}: {setChoice: Function}) => {

    const { data: session } = useSession()

    return (
        <main className="flex min-h-screen flex-col items-center gap-10 p-24 pt-16">
            <h1 className="text-3xl">Experiment Instructions</h1>
            <div className="flex flex-col gap-5 items-center">
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus sit amet libero viverra, euismod erat eget, fermentum turpis. Nam egestas risus eros, in convallis mi sodales eget. Maecenas consectetur nisl dui, quis vestibulum erat laoreet eu. Integer vel nulla non diam sodales efficitur. Phasellus sit amet elementum felis. Aenean risus nulla, commodo non urna nec, commodo elementum risus. Vestibulum pellentesque semper mauris, vitae hendrerit enim hendrerit ac. Maecenas mattis mi eget efficitur maximus. Donec ullamcorper sodales nisi ut luctus.</p>

                <p>Cras at condimentum mauris. Sed at egestas mi. In sit amet nibh tempor, efficitur magna eu, finibus quam. Nunc dapibus vulputate mauris a porta. Sed id quam dapibus, aliquet est sit amet, ullamcorper justo. Nulla pellentesque aliquam est. Aenean pharetra, magna euismod placerat aliquet, purus diam aliquam lectus, sed facilisis elit felis eget tortor.</p>

                <Image 
                    src="/vercel.svg"
                    alt="Vercel logo"
                    className=""
                    width={150}
                    height={24}
                />

                <p>Nulla non ex non sapien ultricies bibendum. Fusce non ipsum condimentum, posuere tellus a, blandit ante. Ut ut aliquam risus. Aenean porta metus eu elit tristique, non bibendum nulla sagittis. Proin vel sem at ante efficitur condimentum. Proin vestibulum sollicitudin tortor, a accumsan eros bibendum quis. Praesent mattis magna vitae rhoncus scelerisque. In hac habitasse platea dictumst.</p>
            </div>
            <button onClick={() => proceed(setChoice)}>
                <div className="border border-black rounded-md py-2 px-5">Understood</div>
            </button>
        </main>
    )
}

const Questionnaire = ({setChoice}: {setChoice: Function}) => {
    return (
        <main className="flex min-h-screen flex-col items-center gap-10 p-24 pt-16">
            <h1 className="text-3xl">Preliminary Questionnaire</h1>
            <div className="flex flex-col gap-5 items-center">
                <Input placeholder="Name" />
                <Input placeholder="Name" />
                <Input placeholder="Name" />
                <Input placeholder="Name" />
                <Input placeholder="Name" />
                <Input placeholder="Name" />
            </div>
            <button onClick={() => proceed(setChoice)}>
                <div className="border border-black rounded-md py-2 px-5">Submit</div>
            </button>
        </main>
    )
}

export default function Prelim() {
    const [choice, setChoice] = useState(1) 

    switch (choice) {
        case 1:
            return <Instructions setChoice={setChoice} />
        case 2:
            return <Questionnaire setChoice={setChoice} />
        // case 3:
        //     return <Protocols />
    }
}