import { Text, View, TextInput, Button, FlatList } from 'react-native';
import { useState, useEffect } from 'react'
import {decode as atob, encode as btoa} from 'base-64'

export default function Chat({ route, navigation }) {

    const { server } = route.params;

    const [messages, setMessages] = useState([])
    const [message, setMessage] = useState("");

    useEffect(() => {
        read(0, []);
    }, [])

    const read = (i, temp) => {
        const requestOptions = {
            method: "POST",
            headers: {
                "Content-type": "application/json",
            },
            body: JSON.stringify({
                offset: i
            })
        };
        fetch(`http://192.168.1.16:${server.gatewayPort.toString()}/log.v1.Log/Read`, requestOptions).then((response) => {
            if (response.ok) {
                return response.json()
            }
            setTimeout(() => {
                read(i, temp);
            }, 100)
        }).then((data) => {
            if (data !== undefined) {
                if (data.record.value !== "" && data.record.server === server.id) {
                    const temp2 = []
                    temp.forEach(element => {
                        temp2.push(element)
                    });
                    temp2.push(data.record);
                    setMessages(temp2);
                    temp = temp2;
                }
                read(i+1, temp)
            }
        }).catch((err) => console.log(err));
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
        fetch(`http://192.168.1.16:${server.gatewayPort.toString()}/log.v1.Log/Write`, requestOptions).then((res) => {
            if (!res.ok) {
                console.log(res.statusText)
            }
        })
        setMessage("");
    }

    return (
        <View>
            <Text style={{margin: 10, fontSize: 50}}>Chats {server.id}</Text>
            {messages !== undefined? <FlatList
                data={messages}
                renderItem={(message) => <Text>{atob(message.item.value)}</Text>}
            /> : <></>}
            <TextInput value={message} onChangeText={setMessage} />
            <Button title="Envoyer" onPress={handleSendClick} />
        </View>
    )
}
