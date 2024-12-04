import config from 'config';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import { connectToDatabase } from '../src/helpers/init';
import { db } from '../src/helpers/IDatabase';

const resetAndCreateDefaultUser = async () => {
  try {
    await connectToDatabase();

    const defaultUsername = 'admin'; 
    const defaultPassword = 'password123';
    await db.collection('bouser').deleteMany({});
    await db.collection('bouser').insertOne({
      username: defaultUsername,
      password: await bcrypt.hash(defaultPassword, 10),
      mustChangePassword: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    console.log('Utilisateur par défaut créé avec succès');
  } catch (error) {
    console.error("Erreur lors de la réinitialisation et création de l'utilisateur:", error);
  } finally {
    await mongoose.connection.close();
  }
};
resetAndCreateDefaultUser();