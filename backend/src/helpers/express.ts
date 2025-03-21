import config from "config";
import cors from "cors";
import express, { Application, Router, Request, Response, NextFunction } from "express";
import helmet from "helmet";
import path from "path";
import fs from "fs/promises";
import { mkdirp } from "mkdirp";
import authMiddleware from "./authMiddleware";
import {apiPath, backPath, projectPath} from "./commons";


export function expressInit(): Application {
    const app = express();
    app.use('/public', express.static('public'));
    app.use(helmet());
    app.disable("etag");
    app.use((req, res, next) => {
        res.setHeader(
            "Content-Security-Policy",
            "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com https://m.stripe.network;"
        );
        res.setHeader(
            "font-src",
            "'self' https://js.stripe.com;"
        );
        next();
    });
    const corsOptions = {
        origin: config.get<string>("server.CORS_ALLOW_ORIGIN") || "*",
        methods: ["GET", "PUT", "POST", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization", "X-User-Token"],
        crossOriginResourcePolicy: "cross-origin",
    };
    app.use(cors(corsOptions));

    app.use(
        express.json({
            limit: config.get<string>("server.JSON_SIZE_LIMIT") || "50mb",
            verify: function (req: any, _res: Response, buf: Buffer, encoding: string) {
                req["rawBody"] = buf.toString(encoding as BufferEncoding);
            },
        })
    );

      app.use(express.urlencoded({ extended: false }));
    return app;
}
export async function expressInitUploadsDir(app: Application, uploadsPath?: string, routePath = "/static") {
    const environment = config.get<string>("environment");

    let envLimited = config.get<string | string[] | null>("server.uploads.environment");

    if (envLimited && !Array.isArray(envLimited)) {
        envLimited = [envLimited];
    }

    if (!envLimited || envLimited.includes(environment)) {
        let usedUploadPath = uploadsPath || config.get<string | null>("server.uploads.path");

        if (usedUploadPath) {
            usedUploadPath = path.resolve(
                usedUploadPath
                    .replace(/%project%/g, projectPath)
                    .replace(/%back%/g, backPath)
                    .replace(/%api%/g, apiPath)
            );

            await mkdirp(usedUploadPath);
            app.use(routePath, express.static(usedUploadPath));
            return usedUploadPath;
        } else {
            console.error("Can't init uploads environment. Missing uploadPath config.");
            throw new Error("Can't init uploads environment. Missing uploadPath config.");
        }
    } else {
        return null;
    }
}

export async function expressInitApi(app: Application, authConfiguration?: any) {
    const apiVersion = config.get<string>("server.api.version") || "1.0";

    if (authConfiguration) {
        app.locals.authMiddlewares = authMiddleware;
    }

    const routes = await expressGetApiRoutes(apiVersion);
    app.use(`/${apiVersion}`, routes);
    app.use(routes);
}

export async function expressGetApiRoutes(apiVersion: string): Promise<Router> {
    // const controllersPath = path.resolve(__dirname);
    const controllersPath = path.resolve(config.get<string>("server.api.autoDiscoveryPath"));

    const api = Router();
    await autoDiscoverRoutes(api, controllersPath);
    return api;
}

async function autoDiscoverRoutes(api: Router, dir: string) {
    try {
        const files = await fs.readdir(dir);
        for (const file of files) {
            const filepath = path.join(dir, file);

            if ((await fs.lstat(filepath)).isDirectory()) {
                await autoDiscoverRoutes(api, filepath);
            } else if (file.endsWith(".js")) {
                await addRouteIfController(api, filepath);
            }
        }
    } catch (err) {
        if (err && err.code === "ENOENT") {
            console.warn(`Le répertoire d'auto-découverte des routes n'existe pas : ${dir}`);
            console.warn("Répertoire de travail actuel :", process.cwd());
            console.warn("Tentative de résolution du chemin :", path.resolve(dir));
        } else {
            console.error("Error during auto-discovery of routes:", err);
        }
    }
}

async function addRouteIfController(api: Router, filepath: string) {
    try {
        const { default: controller } = await import(filepath);
        if (controller) {
            const instance = new (controller as any)(api);
            if (instance && typeof instance.register === "function") {
                instance.register();
            }
        }
    } catch (err) {
        console.error(`Failed to load controller from file: ${filepath}`, err);
    }
}


export function expressInitErrorManagement(app: Application) {
  app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(500).send('Une erreur est survenue !');
  });
}

export function expressListen(app: Application, appPort?: string|number) {
    return new Promise((resolve, reject) => {
        const port = appPort || config.get<string>("server.port");
        if(!port) {
            console.error("Unable to run Express: no port defined.");
            reject("no-port");
        }
        else {
            app.listen(port, function() {
                console.info("Express ran on port: " + port);
                resolve(port);
            }).on('error', (err) => {
                console.error("Unable to run Express", err);
                reject(err);
            });
        }
    });
}
