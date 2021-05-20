import IAttachmentsDTO from '@modules/task/dtos/props/IAttachmentsDTO';
import ITaskSchemaDTO from '@modules/task/dtos/schemas/ITaskSchemaDTO';
import dynamoose from 'dynamoose';
import { Document } from 'dynamoose/dist/Document';

class Task extends Document implements ITaskSchemaDTO {
  category: string;

  id: string;

  created_by_user_id: string;

  designated_to_user_id: string;

  title: string;

  description?: string;

  attachments?: IAttachmentsDTO[];

  status?: string;

  created_at: Date;

  updated_at: Date;
}

const schema = new dynamoose.Schema(
  {
    category: {
      type: String,
      hashKey: true,
    },

    id: {
      type: String,
      rangeKey: true,
    },

    created_by_user_id: {
      type: String,
      index: {
        name: 'idx_key_of_created_by_user_id_task',
        global: true,
      },
    },

    designated_to_user_id: {
      type: String,
      index: {
        name: 'idx_key_of_designated_to_user_id_task',
        global: true,
      },
    },

    title: {
      type: String,
      required: true,
    },

    description: String,

    attachments: {
      type: Array,
      schema: [
        {
          type: Object,
          schema: {
            file: {
              type: String,
              required: true,
            },
          },
        },
      ],
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

export default dynamoose.model<Task>('Tasks', schema, {
  // throughput: 'ON_DEMAND', // não conteplado no free
  waitForActive: {
    enabled: false,
  },

  create: process.env.STAGE === 'local',
  expires: { ttl: 20 * 60 * 1000 },
  // Active only after created table in prod and is in prod env
  // create: false,
});
