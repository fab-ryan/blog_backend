import mongoose from 'mongoose';
import { config } from '../config/config.js';

const db_url = config.db;
const db=db_url.replace('<password>', config.db_password);
const db_connect = mongoose.connect(db, { dbName: 'Blog_Porject' }, 
).then(() => {
    console.log('Database connected');
}).catch((error) => {
    console.log('Database connection failed',error);
});
export default db_connect;
