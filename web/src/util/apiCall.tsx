import Message from "../model/message";


export default function call(url: string, requestOptions: any, setFunc: React.Dispatch<React.SetStateAction<any>>) {
    fetch(url, requestOptions).then((response) => {
        if (!response.ok) {
            throw response.statusText;
            
        }
        return response.body?.getReader().read();
    }).then((stream) => {
        if (stream !== undefined && !stream.done) {
            const string = new TextDecoder().decode(stream.value).split("\n");
            const array: Message[] = []

            string.forEach((value) => {
                if (value !== "")
                    array.push(JSON.parse(value).result.record)
            })
            
            setFunc(array)
        }
    })
    .catch((err) => console.error(err));
} 
