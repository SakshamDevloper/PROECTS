import express from "express";
import mongoose from "mongoose";
import * as dotenv from 'dotenv';
import bodyParser from 'body-parser';
dotenv.config();
import usersRouter from './routes/users.js';

const app = express();
const PORT = 8080;

// Initialize bodyParser middleware
app.use(bodyParser.json());

mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true });
const db = mongoose.connection;
db.on('error', (error) => console.error(error));
db.once('open', () => console.log("Connected to mongo database"));

app.use('/users', usersRouter);

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
})
