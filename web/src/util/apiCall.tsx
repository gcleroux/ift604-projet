import Message from "../model/message";


export function callMessage(url: string, requestOptions: any, setFunc: React.Dispatch<React.SetStateAction<any>>) {
    fetch(url, requestOptions).then((response) => {
        if (!response.ok) {
            throw response.statusText;
            
        }
        const stream = response.body;

        if (stream === null) {
            throw "null stream";
        }

        const reader = stream.getReader();
        let messages: Message[] = []

        const readChunk = () => {
           
            reader.read()
                .then(({value,done}) => {
                    if (done) {
                        console.log('Stream finished');
                        return;
                    }
                  
                    const stringArray = new TextDecoder().decode(value).split("\n");
                    const array: Message[] = []

                    messages.forEach((message) => {
                        array.push(message);
                    })
                    stringArray.forEach((value) => {
                        if (value !== "")
                            array.push(JSON.parse(value).result.record);
                    });
                    setFunc(array);
                    messages = array;
                   
                    readChunk();
                })
                .catch(error => {
                    console.error(error);
                });
        };
        readChunk();
    }).catch((err) => console.error(err));
} 

export function callWrite(url: string, requestOptions: any) {
    fetch(url, requestOptions).then((res) => {
        if (!res.ok) {
            console.log(res.statusText)
        }
    })
}

export function call(url: string, requestOptions: any, setFunc: React.Dispatch<React.SetStateAction<any>>) {
    fetch(url, requestOptions).then((res) => {
        if (res.ok) {
            return res.json()
        }
    }).then((data) => {
        setFunc(data)
    })
}
