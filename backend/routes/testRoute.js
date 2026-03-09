
import express from 'express';
import { 
    brevoEmail,
    SESsendEmail,
    storeRedis,
    createUser,
    verifyLogin, deleteUser } from '../controllers/testController.js';

const app = express.Router();

app.get('/brevo-email', brevoEmail)
app.post('/send-email', SESsendEmail);
app.post('/store-redis', storeRedis);
app.post('/create-user', createUser);
app.post('/verify-login', verifyLogin);
app.post('/delete-user', deleteUser);


export default app;