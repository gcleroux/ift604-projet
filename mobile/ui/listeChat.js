import { useState, useEffect } from "react"
import { Text, View, FlatList, Item } from 'react-native';
import * as Location from 'expo-location';

export function ListeChat({navigation}) {

    const [location, setLocation] = useState(null);
    const [servers, setServers] = useState({servers: []});

    useEffect(() => {
        if (location !== null) {
            const requestOptions = {
                method: "POST",
                headers: {
                    "Content-type": "application/json",
                },
                body: JSON.stringify({
                    latitude:  location.coords.latitude,
                    longitude:  location.coords.longitude,
                    radius: 1000
                })
            };
            fetch("http://192.168.1.16:8081/log.v1.Log/GetServers", requestOptions).then((res) => {
                if (res.ok) {
                    return res.json()
                }
            }).then((data) => {
                setServers(data)
            })
        }
    }, [location])

    useEffect(() => {
        (async () => {
          let { status } = await Location.requestForegroundPermissionsAsync();
          if (status !== 'granted') {
            setErrorMsg('Permission to access location was denied');
            return;
          }
    
          let location = await Location.getCurrentPositionAsync({});
          setLocation(location);
        })();
      }, []);

    const handlePress = (server) => {
        navigation.navigate('Chat', {server: server})
    }

    return (
        <View>
            <Text style={{margin: 10, fontSize: 50}}>Liste des chats</Text>
            {servers.servers !== undefined? <FlatList
                data={servers.servers}
                renderItem={(server) => <Text style={{margin: 10, fontSize: 50}} onPress={() => handlePress(server.item)}>{server.item.id}</Text>}
            /> : <></>}
        </View>
    )
}