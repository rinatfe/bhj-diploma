/**
 * Основная функция для совершения запросов
 * на сервер.
 * */
const createRequest = (options = {}) => {
        
        let xhr = new XMLHttpRequest;

        if(options.method == 'GET') {
            let str = `${options.url}?`
            let num = 1
            if(options.data /*&& options.data.length > 0*/){
                for(let i in options.data) { 
                     
                    if(num == Object.keys(options.data).length) 
                        {str = str + `${i}=${options.data[i]}`
                        
                    }
                        else{str = str + `${i}=${options.data[i]}&`
                        num=num+1; 
                    } 
                }
                xhr.open('GET', str)
            } else {
                xhr.open('GET', options.url)
            }   
            xhr.responseType = 'json'
            xhr.send()
            
             
        } else {
            formData = new FormData;
            for(let i in options.data) {
                formData.append( `${i}`, `${options.data[i]}` );
            }

            xhr.open( options.method, options.url );
            xhr.responseType = 'json'
            xhr.send( formData );
        }
        xhr.onload = ()=> {
            if(options.callback) {
                if(xhr.response.success == false){
                    options.callback(xhr.response.error, xhr.response)
                } else {
                    options.callback(null, xhr.response)
                }
            }
        }
};