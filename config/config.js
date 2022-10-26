import dotenv from 'dotenv';
dotenv.config();
const config = {
  PORT: process.env.PORT || 3000,
  db: process.env.DB_URL,
  db_password: process.env.DB_PASSWORD,
  secret: process.env.SECRET,
};
export { config };
