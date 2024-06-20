import Image from 'next/image'

export default function Img({url}: {url: string}) {
    return (<Image 
        src={url}
        alt="Image"
        className=""
        width={0}
        height={0}
        sizes="100vw"
        style={{height: "35vh", width: "auto"}}
    />)
}