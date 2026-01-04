import http from 'http';
import Request from './http/Request.js'
import { router } from './routes.js';






const port = +(process.argv.filter((argument) => {
    return argument.startsWith('--port=');
})[0] ?? '8000').replace('--port=', '');
const host = '127.0.0.1';

const server = http.createServer(async (request, response) => {
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Allow-Headers', '*');
    response.setHeader('Access-Control-Allow-Methods', '*');
    response.setHeader('Content-Type', 'application/json');

    if (request.method === 'OPTIONS') {
        response.statusCode = 200;
        response.end();
        return;
    }

    try {
        const appResponse = await router.handleRequest(new Request().parseRequest(request));

        response.statusCode = appResponse.statusCode;
        response.write(JSON.stringify(appResponse.data));
        response.end();
    } catch (exception: any) {
        response.setHeader('Content-Type', 'application/json');
        response.statusCode = 400;
        response.write(JSON.stringify({
            message: 'Something went wrong.',
            error: exception.message,
            stack: exception.stack
        }))
        response.end();
    }
});

server.listen(port, host, () => {
    console.log(`NodeJS webserver started!\nListening on ${host}:${port}`);
})