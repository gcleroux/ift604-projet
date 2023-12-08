import { useState, useEffect } from "react"
import { Text, View, FlatList } from 'react-native';
import GetLocation from 'react-native-get-location'

export function ListeChat() {

    const [servers, setServers] = useState({servers: []});

    useEffect(() => {
        console.log(GetLocation)
        if(GetLocation !== null) {
            GetLocation.getCurrentPosition()
            .then(location => {
                console.log(location)
                const requestOptions = {
                    method: "POST",
                    headers: {
                        "Content-type": "application/json",
                    },
                    body: JSON.stringify({
                        latitude: location.latitude,
                        longitude: location.longitude,
                        radius: 1000
                    })
                };
                fetch("http://127.100.100.100:8081/log.v1.Log/GetServers", requestOptions).then((res) => {
                    if (res.ok) {
                        return res.json()
                    }
                }).then((data) => {
                    setServers(data)
                })
            }).catch((e) => {
                console
            })
        }
    }, [])

    // const handleServerClick = (server) => {
    //     navigate(`/${server.id}`, {
    //         state: {server: server}
    //     })
    // }

    console.log(servers.servers)

    return (
        <View>
            <Text>Liste des chats</Text>
            <FlatList
                data={servers.servers}
                renderItem={({item}) => <Item title={item.id} />}
                keyExtractor={item => item.id}
            />
        </View>
    )
}