import IWebsocketSchemaDTO from '@modules/websocket/dtos/schemas/IWebsocketSchemaDTO';
import dynamoose from 'dynamoose';
import { Document } from 'dynamoose/dist/Document';

class Websocekt extends Document implements IWebsocketSchemaDTO {
  id: string;

  msg: string;

  status?: string;

  created_at: Date;

  updated_at: Date;
}

const schema = new dynamoose.Schema(
  {
    id: {
      type: String,
      hashKey: true,
    },

    msg: {
      type: String,
      required: true,
    },

    status: String,
  },

  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  },
);

export default dynamoose.model<Websocekt>('Websocket', schema, {
  // throughput: 'ON_DEMAND', // não conteplado no free
  waitForActive: {
    enabled: false,
  },

  create: process.env.STAGE === 'local',

  expires: { ttl: 2 * 60 * 60 * 1000 },
  // Active only after created table in prod and is in prod env
  // create: false,
});
