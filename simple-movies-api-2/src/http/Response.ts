



export default class Response {
    public data: any;
    public statusCode: number;

    constructor(data: any, statusCode = 200) {
        this.data = data;
        this.statusCode = statusCode;
    }
}