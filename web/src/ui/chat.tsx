import { useEffect, useState } from "react"
import Message from "../model/message"
import { callMessage, callWrite } from "../util/apiCall";
import { Button, TextField } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";

export default function Chat() {

    const { state } = useLocation();
    const navigate = useNavigate();
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
            <div key={message.offset} className="message">
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

    const handleRetourClick = () => {
        navigate(-1)
    }

    return (
        <>
            <Button onClick={handleRetourClick} variant="contained">Retour</Button>
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