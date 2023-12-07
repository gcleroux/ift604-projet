import { useEffect, useState } from "react"
import Message from "../model/message"
import { callMessage, callWrite } from "../util/apiCall";
import { Button, TextField } from "@mui/material";
import { getDistance } from 'geolib';

export default function Chat() {

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
        callMessage("http://127.0.0.1:8083/log.v1.Log/ReadStream", requestOptions, setMessages);
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
        callWrite("http://127.0.0.1:8083/log.v1.Log/Write", requestOptions);
        setMessage("");
    }

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                console.log(
                    'You are ',
                    getDistance({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    }, {
                        latitude: 51.525,
                        longitude: 7.4575,
                    }),
                    'meters away from 51.525, 7.4575'
                );
            },
            () => {
                alert('Position could not be determined.');
            }
        );
    }, [])

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