import express from 'express';
import { LoginUser, RegisterUser } from '../controller/auth.js';
import { getAllUsers, getChat, sendMessage, createGroup, getAllGroups, sendGroupMessage, getGroupChat , deleteMessageFromMe , deleteGroup } from '../controller/chat.js';
import authenticateToken from '../middleware/index.js';
const Router = express.Router();


Router.post('/login-user',  LoginUser)
Router.post('/register-user', RegisterUser)
Router.get('/get-all-users' , authenticateToken ,  getAllUsers)
Router.get('/get-user-chat', authenticateToken ,getChat)
Router.post('/send-user-message', sendMessage)


Router.post('/create-group', authenticateToken, createGroup)
Router.get('/get-user-group',authenticateToken, getAllGroups)
Router.post('/send-group-message',authenticateToken , sendGroupMessage)
Router.get('/get-group-chat',authenticateToken, getGroupChat)

Router.delete('/delete-group' , authenticateToken, deleteGroup )
Router.delete('/delete-group-message-from-me' , authenticateToken , deleteMessageFromMe)


Router.use('*', (req, res) => {
    res.status(404).json({ error: "Requested Endpoint not Found !" })
})

export default Router;
