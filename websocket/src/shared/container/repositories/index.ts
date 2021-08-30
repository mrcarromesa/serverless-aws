import WebsocketRepository from '@modules/websocket/infra/dynamoose/repositories/WebsocketRepository';
import IWebsocketRepository from '@modules/websocket/repositories/IWebsocketRepository';
import { container } from 'tsyringe';

container.registerSingleton<IWebsocketRepository>(
  'WebsocketRepository',
  WebsocketRepository,
);
