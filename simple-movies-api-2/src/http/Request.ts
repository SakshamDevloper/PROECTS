import http from 'http';



export default class Request {
    public method?: string;
    public path?: string;
    public body: Promise<object> = Promise.resolve({});

    public parseRequest(request: http.IncomingMessage) {
        this.method = request.method;
        this.path = request.url;
        this.body = this.parseBody(request)
            .catch(err => {
                throw new Error(err);
            });

        return this;
    }

    private parseBody(request: http.IncomingMessage): Promise<object> {
        return new Promise((resolve, reject) => {
            let body: Array<Buffer> = [];
            request.on('data', (chunk: Buffer) => {
                body.push(chunk);
            }).on('end', () => {
                if (body.length === 0) {
                    return;
                }

                try {
                    resolve(JSON.parse(Buffer.concat(body).toString()));
                } catch {
                    reject('Invalid JSON payload provided.');
                }
            });
        })
    }
}