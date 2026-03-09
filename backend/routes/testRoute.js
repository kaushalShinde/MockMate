
import express from 'express';
import { 
    sendEmail,
    storeRedis,
    createUser,
    verifyLogin, deleteUser } from '../controllers/testController.js';

const app = express.Router();

app.post('/send-email', sendEmail);
app.post('/store-redis', storeRedis);
app.post('/create-user', createUser);
app.post('/verify-login', verifyLogin);
app.post('/delete-user', deleteUser);


export default app;