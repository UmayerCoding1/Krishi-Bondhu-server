import { Router } from 'express';
import { ChatController } from './chat.controller';
import { authMiddleware } from '../../middlewares/authMiddleware';

const chatRoute = Router();

chatRoute.post('/', authMiddleware, ChatController.sendMessage);
chatRoute.post('/stream', authMiddleware, ChatController.streamAI);
chatRoute.get('/all', authMiddleware, ChatController.getAllChats);
chatRoute.get('/:chatId', authMiddleware, ChatController.getSingleChatHistory);
chatRoute.delete('/:chatId', authMiddleware, ChatController.deleteChat);

export default chatRoute;