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
      const mongoOptions = config.get<MongoOptions>('database.mongo.mongoOptions');
  
      const connectionString = `${host}${dbName}`;
      console.log('Tentative de connexion à:', connectionString);
  
      await mongoose.connect(connectionString, {
        ...mongoOptions,
        dbName: dbName
      });
  
      if (db.name !== dbName) {
        console.warn(`Attention : Le nom de la base de données (${db.name}) ne correspond pas à celui configuré (${dbName})`);
      }
    } catch (err) {
      console.error('Could not connect to MongoDB:', err);
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