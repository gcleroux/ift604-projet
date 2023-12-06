import { useEffect, useState } from "react"
import Message from "../model/message"
import call from "../util/apiCall";

export default function Chat() {

    const [messages, setMessages] = useState<Message[]>([])

    useEffect(() => {
        const requestOptions = {
            method: "POST",
            headers: {
                "Content-type": "application/json",
            },
            body: JSON.stringify({
                offset: 0
            })
        };
        call("/log.v1.Log/ReadStream", requestOptions, setMessages);
    }, [])

    useEffect(() => {
        console.log(messages)
    }, [messages])

    return (
        <>
            {messages?.map((message) => atob(message?.value))}
        </>
    )
}