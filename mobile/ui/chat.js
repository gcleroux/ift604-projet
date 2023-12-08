import { Text, View, TextInput, Button } from 'react-native';
import { useState, useEffect } from 'react'
import {decode as atob, encode as btoa} from 'base-64'

export default function Chat({ route, navigation }) {

    const { server } = route.params;

    const [messages, setMessages] = useState([])
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
        fetch(`http://192.168.1.16:${server.gatewayPort.toString()}/log.v1.Log/ReadStream`, requestOptions).then((response) => {
            console.log('sdfdf')
            if (!response.ok) {
                throw response.statusText;
                
            }
            const stream = response.body;
    
            if (stream === null) {
                throw "null stream";
            }
    
            const reader = stream.getReader();
            let messages = []

            console.log('t')
    
            const readChunk = () => {
                reader.read()
                    .then(({value,done}) => {
                        if (done) {
                            console.log('Stream finished');
                            return;
                        }

                        console.log(value)
                      
                        const stringArray = new TextDecoder().decode(value).split("\n");
                        const array = []
    
                        messages.forEach((message) => {
                            array.push(message);
                        })
                        stringArray.forEach((value) => {
                            if (value !== "")
                                array.push(JSON.parse(value).result.record);
                        });
                        setMessages(array);
                        messages = array;
                       
                        readChunk();
                    })
                    .catch(error => {
                        console.error(error);
                    });
            };
            readChunk();
        }).catch((err) => console.log(err));
    }, [])

    const createMessage = (message) => {
        console.log(message)
        return (
            <Text>
                {atob(message.value)}
            </Text>
        )
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
            {messages?.map((message) => createMessage(message))}
            <TextInput value={message} onChangeText={setMessage} />
            <Button title="Envoyer" onPress={handleSendClick} />
        </View>
    )
}