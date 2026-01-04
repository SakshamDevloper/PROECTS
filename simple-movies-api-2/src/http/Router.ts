import Request from './Request.js';
import Response from './Response.js';
import MovieHandler from './handlers/MovieHandler.js';


export default class Router {
    private routes: Map<string, Map<string, { handler: MovieHandler, method: keyof MovieHandler }>> = new Map();

    get(path: string, callable: { handler: MovieHandler, method: keyof MovieHandler }): void {
        this.addRoute('GET', path, callable);
    }

    post(path: string, callable: { handler: MovieHandler, method: keyof MovieHandler }): void {
        this.addRoute('POST', path.startsWith('/') ? path : `/${path}`, callable);
    }

    put(path: string, callable: { handler: MovieHandler, method: keyof MovieHandler }): void {
        this.addRoute('PUT', path.startsWith('/') ? path : `/${path}`, callable);
    }

    delete(path: string, callable: { handler: MovieHandler, method: keyof MovieHandler }): void {
        this.addRoute('DELETE', path.startsWith('/') ? path : `/${path}`, callable);
    }

    async handleRequest(request: Request): Promise<Response> {
        if (!request.method || !request.path) {
            return new Response({
                message: 'Something went wrong',
                error: 'There is no request.method or request.path'
            }, 400);
        }

        if (this.hasRoute(request.method, request.path)) {
            const requestHandler = this.getActionOfPath(request.method, request.path) as { handler: MovieHandler, method: keyof MovieHandler };
            const pathParameter = this.getPathParameter(request.path);
            const handlerArguments: [Request, string] = [request, pathParameter ?? ''];

            let appResponse = null;

            const { handler, method } = requestHandler;
            appResponse = await handler[method](...handlerArguments);


            if (appResponse instanceof Response) {
                return appResponse;
            }

            return new Response(appResponse, 200);
        } else {
            return new Response({
                message: `Requested path: ${request.path} with method: ${request.method} is not found!`
            }, 404);
        }
    }

    private hasRoute(method: string, path: string): boolean {
        return Boolean(this.getActionOfPath(method, path));
    }

    private addRoute(method: string, path: string, callable: { handler: MovieHandler, method: keyof MovieHandler }): void {
        if (this.routes.has(method)) {
            this.routes.get(method)?.set(path, callable);
        } else {
            this.routes.set(method, new Map().set(path, callable));
        }
    }

    private getActionOfPath(method: string, path: string): { handler: MovieHandler, method: keyof MovieHandler } | null {
        if (!this.routes.has(method)) {
            return null;
        }

        if (this.routes.get(method)?.has(path)) {
            return this.routes.get(method)?.get(path) ?? null;
        }

        let lastIndexOfSlash = path.lastIndexOf('/');
        let pathParameter = path.slice(lastIndexOfSlash + 1);
        if (!pathParameter) {
            return null;
        }
        let pathWithoutParameter = path.slice(0, lastIndexOfSlash);

        for (let [route] of this.routes.get(method) ?? []) {
            if (route.startsWith(pathWithoutParameter)) {
                let routeBinding = this.getRouteBinding(route);
                if (!routeBinding) {
                    continue;
                }

                let parameterReplacedWithBinding = path.replace(pathParameter, routeBinding);
                if (parameterReplacedWithBinding === route) {
                    return this.routes.get(method)?.get(route) ?? null;
                }
            }
        }
        return this.routes.get(method)?.get(path) ?? null;
    }

    private getRouteBinding(path: string): string {
        let bindingStartIdx = path.indexOf('{');
        let bindingEndIdx = path.indexOf('}');

        return path.slice(bindingStartIdx, bindingEndIdx + 1);
    }

    private getPathParameter(path: string): string | null {
        let lastIndexOfSlash = path.lastIndexOf('/');
        let pathParameter = path.slice(lastIndexOfSlash + 1);

        return pathParameter ?? null;
    }
}