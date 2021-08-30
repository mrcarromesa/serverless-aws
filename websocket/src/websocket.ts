import 'reflect-metadata';
import 'dotenv/config';
import '@shared/container';

import { ApiGateway } from '@config/aws';
import { logger } from '@config/logger';
import AddWebsocketItemService from '@modules/websocket/services/create/AddWebsocketItem.service';
import RemoveWebsocketItemService from '@modules/websocket/services/delete/RemoveWebsocketItem.service';
import ListWebsocketItemsService from '@modules/websocket/services/query/ListWebsocketItems.service';
import { Handler } from 'aws-lambda';
import { container } from 'tsyringe';

export const connectHandler: Handler = async event => {
  logger('connectHandler_called: =>', event);

  const { connectionId } = event.requestContext;

  const saveConnection = container.resolve(AddWebsocketItemService);
  await saveConnection.execute({
    id: connectionId,
    msg: 'connectHandler',
  });

  return {
    statusCode: 200,
    body: 'Success',
  };
};

export const disconnectHandler: Handler = async event => {
  logger('disconnectHandler_called: =>', event);

  const { connectionId } = event.requestContext;

  const removeConnection = container.resolve(RemoveWebsocketItemService);
  await removeConnection.execute(connectionId);

  return {
    statusCode: 200,
    body: 'Success',
  };
};

export const defaultHandler: Handler = async event => {
  logger('defaultHandler_called: =>', event);

  const body = JSON.parse(event.body);
  let postData = body.data;

  if (typeof postData === 'object') {
    postData = JSON.stringify(postData);
  }

  const endpoint = `${event.requestContext.domainName}/${event.requestContext.stage}`;

  const apigManagement = new ApiGateway({
    apiVersion: '2018-11-29',
    endpoint,
  });

  const { connectionId } = event.requestContext;

  const listAll = container.resolve(ListWebsocketItemsService);
  const connections = await listAll.execute(connectionId);

  if (connections.length > 0) {
    const promises = connections.map(item => {
      return apigManagement
        .postToConnection({
          ConnectionId: item.id,
          Data: postData,
        })
        .promise();
    });

    await Promise.all(promises);
  }

  return {
    statusCode: 200,
    body: 'Success',
  };
};

export const broadcastHandler: Handler = async event => {
  logger('broadcastHandler_called: =>', event);

  return {
    statusCode: 200,
    body: 'Success',
  };
};
