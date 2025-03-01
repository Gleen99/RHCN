import { connectToDatabase, standardExpressRun} from './helpers/init';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.prod' });

connectToDatabase();
standardExpressRun();