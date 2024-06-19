import Image from 'next/image'

export default function Img({url}: {url: string}) {
    return (<Image 
        src={url}
        alt="Image"
        className=""
        width={300}
        height={48}
    />)
}