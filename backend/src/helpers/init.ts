import mongoose from 'mongoose';
import config from 'config';
import express from 'express';
import {Application} from "express";
import { expressInit, expressInitApi, expressInitErrorManagement, expressInitUploadsDir, expressListen } from './express';
import moment from 'moment-timezone'
import { db } from './IDatabase';

const port = config.get<number>('server.port');
console.log("le serveur est lancé sur le port", port)

moment.tz.setDefault('Europe/Paris');
moment.locale('fr');

interface MongoOptions {
    directConnection?: boolean;
    serverSelectionTimeoutMS?: number;
    [key: string]: any;
  }

export const connectToDatabase = async (): Promise<void> => {
    try {
        const host = config.get<string>('database.mongo.host');
        const dbName = config.get<string>('database.mongo.database');
        const user = config.get<string>('database.mongo.user');
        const password = config.get<string>('database.mongo.password');
        const mongoOptions = config.get<any>('database.mongo.mongoOptions');

        let connectionString = '';

        if (user && password) {
            // 🛡️ Connexion avec authentification (prod)
            const encodedPassword = encodeURIComponent(password);
            connectionString = `${host.replace('mongodb://', `mongodb://${user}:${encodedPassword}@`)}${dbName}`;

            // Ajouter authSource si pas déjà dans l’URL
            if (!connectionString.includes('authSource')) {
                connectionString += '?authSource=admin';
            }
        } else {
            // 🚀 Connexion sans authentification (dev)
            connectionString = `${host}${dbName}`;
        }

        console.log('📡 Connexion MongoDB à :', connectionString);

        await mongoose.connect(connectionString, {
            ...mongoOptions,
            dbName,
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log('✅ Connexion MongoDB réussie.');
    } catch (err) {
        console.error('❌ Échec connexion MongoDB :', err);
        throw err;
    }
};

export async function standardExpressRun(authConfiguration?: any, callback?: (app: Application) => Promise<void>): Promise<Application|null> {
    try {
        const app = expressInit();
        (global as any).uploadPath = await expressInitUploadsDir(app);
        await expressInitApi(app, authConfiguration);
        if(callback) {
            await callback(app);
        }
        expressInitErrorManagement(app);
        await expressListen(app);
        return app;
    }
    catch(err) {
        console.error("Unable to start express.");
        console.error(err);
        return null;
    }
}