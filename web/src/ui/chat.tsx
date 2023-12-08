import { useEffect, useState } from "react"
import Message from "../model/message"
import { callMessage, callWrite } from "../util/apiCall";
import { Button, TextField } from "@mui/material";
import { useLocation } from "react-router-dom";

export default function Chat() {

    const { state } = useLocation();
    const [messages, setMessages] = useState<Message[]>([])
    const [message, setMessage] = useState("");

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
        callMessage(`http://${state.server.rpcAddr.split(":")[0] + ":" + state.server.gatewayPort.toString()}/log.v1.Log/ReadStream`, requestOptions, setMessages);
    }, [])

    const createMessage = (message: Message) => {
        return (
            <div className="message">
                {atob(message.value)}
            </div>
        )
    }

    const handleMessageChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setMessage(e.target.value);
    }

    const handleSendClick = () => {
        const requestOptions = {
            method: "POST",
            headers: {
                "Content-type": "application/json",
            },
            body: JSON.stringify({
                record: {
                    value: btoa(message)
                }
            })
        };
        callWrite(`http://${state.server.rpcAddr.split(":")[0] + ":" + state.server.gatewayPort.toString()}/log.v1.Log/Write`, requestOptions);
        setMessage("");
    }

    return (
        <>
            <div id="container">
                <div id="messageContainer">
                    {messages?.map((message) => createMessage(message))}
                </div>
                <div id="sendContainer">
                    <TextField fullWidth multiline value={message} onChange={(e) => handleMessageChange(e)} />
                    <Button variant="contained" onClick={handleSendClick} >Envoyer</Button>
                </div>
            </div>
            
        </>
    )
}