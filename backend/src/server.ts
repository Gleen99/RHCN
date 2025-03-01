import { connectToDatabase, standardExpressRun} from './helpers/init';


console.log('Environnement:', process.env.NODE_ENV);
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({
    path: path.resolve(__dirname, '../.env.prod')
});

connectToDatabase();
standardExpressRun();