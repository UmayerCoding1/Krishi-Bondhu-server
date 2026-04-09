import { Router } from 'express';
import { ChatController } from './chat.controller';

const chatRoute = Router();

chatRoute.post('/', ChatController.sendMessage);
chatRoute.post('/stream', ChatController.streamAI);

export default chatRoute;