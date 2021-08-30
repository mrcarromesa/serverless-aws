import serverless from 'serverless-http';

import server from './shared/infra/http/server';

export const handler = serverless(server);
