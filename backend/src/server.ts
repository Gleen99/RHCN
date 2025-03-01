import { connectToDatabase, standardExpressRun} from './helpers/init';
require('dotenv').config();
console.log('Environnement:', process.env.NODE_ENV);

connectToDatabase();
standardExpressRun();