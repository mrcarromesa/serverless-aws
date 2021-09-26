import { Router } from 'express';

import ClientsController from '../controllers/ClientsController';

const clients = Router();

clients.post('/call-client', ClientsController.read);

export default clients;
