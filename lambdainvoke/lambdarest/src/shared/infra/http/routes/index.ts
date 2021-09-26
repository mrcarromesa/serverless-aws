import clientsRoutes from '@modules/client/infra/http/routes/clients.routes';
import { Router } from 'express';

const routes = Router();

routes.use(clientsRoutes);

export default routes;
