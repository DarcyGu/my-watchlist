class Ajax {
    constructor() {
        this.request = this.request.bind(this);
    }
    get = (args) => {
        args.method = 'get';
        return this.request(args);
    }
    post = (args) => {
        args.method = 'post';
        return this.request(args);
    }
    delete = (args) => {
        args.method = 'delete';
        return this.request(args);
    }
    request = (args) => {
        let default_args = {
            url: args.url,
            method: 'get',
        }
        

        if (!args.method) args.method = default_args.method;

        return new Promise((resolve, reject) => {
            const url = args.url;
            const aux = Object.assign({}, args);
            delete aux.url;

            if (aux.data) {
                //aux.body = (JSON.de(aux.data));
                // aux.body = formurlencoded(aux.data);
                delete aux.data;
            }

            if (!aux.headers) aux.headers = {};

            aux.headers['Content-Type'] = 'application/x-www-form-urlencoded';

            fetch(url, aux)
                .then(res => res.json())
                .then((response) => {
                    return resolve(response);
                })
                .catch((error) => {
                    console.error(error);
                    return reject({message: 'Request Failed - ' + error});
                });
        });
    }
}

export default new Ajax();