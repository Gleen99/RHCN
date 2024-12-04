
import { NextFunction, Request, Response } from "express";
import Router from "router"
import config from 'config';
import moment from 'moment-timezone';

export enum HttpMethod {
    get = "get",
    post = "post",
    put = "put",
    delete = "delete"
}

export enum AuthMode {
    authenticated = "authenticated",
    fill = "fill"
}

export type Middleware = ((req: Request, res: Response, next?: NextFunction) => Promise<void>) | ((req: Request, res: Response, next?: NextFunction) => void);

interface IError {
    message: string;
    code?: string;
}

export class Controller {
    private readonly router: Router;
    private readonly authMiddlewares: Middleware | null;

    constructor(router: Router, authMiddlewares?: Middleware) {
        this.router = router;
        this.authMiddlewares = authMiddlewares || null;
    }

    public register() {
        const method = this.getMethod();
        if (method && Object.values(HttpMethod).includes(method)) {
            const routes = this.getRoutes();
            for (const route of routes) {
                this.router[method](route, this.computeMiddlewares(), this.exec.bind(this));
                if (config.get("debug")) {
                    console.log(`Register route: ${method.toUpperCase()} ${route}`);
                }
            }
        }
    }

    public async exec(req: Request, res: Response, next: NextFunction) {
        const startAt = moment.now();
        if (config.get("debug")) {
            console.log(`${this.getMethod()} ${req.originalUrl}`);
        }
        try {
            const validationResult = await this.validate(req);
            if (validationResult === null) {
                const result = await this.handler(req, res);
                if (result !== false && !res.headersSent) {
                    res.status(200).json(result);
                }
            } else {
                res.status(400).json({ errors: Array.isArray(validationResult) ? validationResult : [validationResult] });
            }
        } catch (err) {
            console.error(err);
            if (!res.headersSent) {
                res.status(500).json({ error: "Internal Server Error" });
            }
        }
        if (config.get("debug")) {
            console.log(`${this.getMethod()} ${req.originalUrl} => took ${moment.now() - startAt} ms.`);
        }
    }

    protected computeMiddlewares(): Middleware[] {
        const middlewares = this.getMiddlewares();

        const auth = this.getAuth();
        if (auth && this.authMiddlewares) {
            if (auth === AuthMode.authenticated) {
                return [this.authMiddlewares, ...middlewares];
            } else if (auth === AuthMode.fill) {
                console.warn("Auth mode 'fill' is not implemented. Skipping authentication middleware.");
            }
        }

        return middlewares;
    }

    // --- Methods to override

    public getMethod(): HttpMethod | null {
        return (this as any).method || null;
    }

    public getAuth(): AuthMode | null {
        return (this as any).auth || null;
    }

    public getRoutes(): string[] {
        if ((this as any).routes) {
            return (this as any).routes;
        } else {
            return [this.getRoute()];
        }
    }

    public getRoute(): string {
        return (this as any).route || "";
    }

    public getMiddlewares(): Middleware[] {
        return [];
    }

    public async validate(_req: Request): Promise<IError | IError[] | null> {
        return null;
    }

    public async handler(_req: Request, _res: Response): Promise<any> {
        return { message: "Not Implemented" };
    }
} 