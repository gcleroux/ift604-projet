import { useEffect, useState } from "react"
import { Server, Servers } from "../model/server";
import { call } from "../util/apiCall";
import { List, ListItem, ListItemButton, ListItemText } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function ListeChat() {

    const navigate = useNavigate();
    const [servers, setServers] = useState<Servers>()

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const requestOptions = {
                    method: "POST",
                    headers: {
                        "Content-type": "application/json",
                    },
                    body: JSON.stringify({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                        radius: 1000
                    })
                };
                call("http://127.100.100.100:8081/log.v1.Log/GetServers", requestOptions, setServers);
            },
            () => {
                alert('Position could not be determined.');
            }
        );
    }, [])

    const handleServerClick = (server: Server) => {
        navigate(`/${server.id}`, {
            state: {server: server}
        })
    }

    return (
        <div>
            <h1 id="titre">Liste des chats</h1>
            <div id="liste">
                <List>
                    {servers !== undefined? servers.servers.map(server => {
                        return (
                            <ListItem key={server.id}>
                                <ListItemButton onClick={()=>handleServerClick(server)}>
                                    <ListItemText primary={server.id + " a une distance de " + server.distance.toFixed(2) + " Km"} />
                                </ListItemButton>
                            </ListItem>
                        )
                    }): <></>}
                </List>
            </div>
        </div>
    )
}
