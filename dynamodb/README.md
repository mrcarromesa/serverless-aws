# Serverless - DynamoDB

---

## O que é o projeto

- O projeto é apenas um exemplo de crud utilizando o DynamoDB e DynamoDB Streams

## Detalhes sobre a estrutura do projeto

- Para verificar mais detalhes sobre a estrutura do projeto acesse: [Serverless com alguns recursos aws](../README.md)

## Como testar via api

- Utilizando uma ferramenta para realizar chamadas REST importar o arquivo:
- [Simular API REST](./readme/api/api.json)

## DynamoDB - Hash e RangeKey

- A craiação desses itens pode ser visto em `src/modules/task/infra/dynamoose/schemas/Task.ts`:

```ts
const schema = new dynamoose.Schema(
  {
    category: {
      type: String,
      hashKey: true, // chave de partição
    },

    id: {
      type: String,
      rangeKey: true, // chave de classificação
    },
    // ... MORE ..
  },
);
```

- Isso permitirá que eu tenha a mesma categoria em vários registros, porém cada um com id diferentes

- Exemplo de utilização de consulta query com a hashKey, no arquivo `src/modules/task/infra/dynamoose/repositories/TaskRepository.ts`:

```ts
public async findTasksByCategory(category: string): Promise<IResultRegister> {
  return Task.query('category').eq(category).all().exec();
}
```

- Exemplo de consulta de item utilizando a hashKey e rangeKey:

```ts
public async findTaskByKeys({
    category,
    id,
  }: ITaskKeysDTO): Promise<ITaskSchemaDTO> {
  return Task.get({
    category,
    id,
  });
}
```

---

## DynamoDB - Índices secundários

- Posso ter índices secundários, para dar mais flexibilidade a aplicação e tornar a consulta um pouco mais rápida;

- Os índices podem ser globais ou locais, em geral utilizamos os globais;

- A craiação desses itens pode ser visto em `src/modules/task/infra/dynamoose/schemas/Task.ts`:

```ts
created_by_user_id: {
  type: String,
  index: {
    name: 'idx_key_of_created_by_user_id_task', // <-- É utilizado na consulta
    global: true,
  },
},

designated_to_user_id: {
  type: String,
  index: {
    name: 'idx_key_of_designated_to_user_id_task', // <-- É utilizado na consulta
    global: true,
  },
},
```

- Exemplo de utilização de consulta com um índice, no arquivo `src/modules/task/infra/dynamoose/repositories/TaskRepository.ts`:

```ts
public async findTasksByUserCreatedId(
    user_id: string,
  ): Promise<IResultRegister> {
  return Task.scan()
    .where('created_by_user_id')
    .eq(user_id)
    .using('idx_key_of_created_by_user_id_task') // <-- O nome do índice conforme definido na criação dele
    .all()
    .exec();
}
```

---

## DynamoDB - Criar e editar registros

- Para criar um registro podemos fazer conforme o exemplo em `src/modules/task/infra/dynamoose/repositories/TaskRepository.ts`:

```ts
public async create({
  id,
  category,
  created_by_user_id,
  designated_to_user_id,
  title,
  description,
  attachments,
}: ITaskSaveDTO): Promise<ITaskSchemaDTO> {
  return (Task.create({
    id,
    category,
    created_by_user_id,
    designated_to_user_id,
    title,
    description: description || '',
    attachments: attachments || [],
  }) as unknown) as ITaskSchemaDTO;
}
```

- Utilizamos o comando `create` e informamos as propriedades conforme definidas nos schema em `src/modules/task/infra/dynamoose/schemas/Task.ts`.

- Para atualizar um registro o procedimento é bem parecido, porém utilizamos o comando `update`:

```ts
public async update({
  id,
  category,
  created_by_user_id,
  designated_to_user_id,
  title,
  description,
  attachments,
}: ITaskSaveDTO): Promise<ITaskSchemaDTO> {
  return (Task.update({
    id,
    category,
    created_by_user_id,
    designated_to_user_id,
    title,
    description,
    attachments,
  }) as unknown) as ITaskSchemaDTO;
}
```

- Precisamos informar o `hashKey`, nesse caso o `category` e o `rangeKey` nesse caso o `id`, e por fim os demais campos que desejamos atualizar.

---

## DynamoDB - remover registros

- Para remover apenas um registro podemos utilizar o comando delete conforme `src/modules/task/infra/dynamoose/repositories/TaskRepository.ts`:

```ts
public async delete({ category, id }: ITaskKeysDTO): Promise<void> {
  await Task.delete({
    category,
    id,
  });
}
```

- Nesse caso informamos o `hashKey` que é o `category` e o `rangeKey` que é o `id`.

- Para remover mais de um registro utilizamos o comando `batchDelete`:

```ts
public async batchDelete(data: ITaskKeysDTO[]): Promise<void> {
  await Task.batchDelete(data);
}
```

- Basta informar um array com todos os `hashKey` e `rangeKey` que desejamos remover, porém a aws só permite remover no máximo 25 registros por vez.

---

## DynamoDB - paginação

- Para realizar paginação utilizamos o valor do lastKey que vem juntamente no resultado da consulta e informamos como startKey, um exemplo disso temos em `src/modules/task/infra/dynamoose/repositories/TaskRepository.ts`:

```ts
public async findAllTasksPaginated({
  start_key, // <- informamos nossa lastkey
  limit,
}: ITaskPaginatedDTO): Promise<IResultRegister> {
  if (start_key) {
    return Task.scan().limit(limit).startAt(start_key).exec();
  }
  return Task.scan().limit(limit).exec();
}
```

## DynamoDB - streams

- Quando precisamos disparar alguma ação para quando houver qualquer movimentação na tabela (insert, update, delete), utilizamos o DynamoDB Streams que por sua vez chama uma lambda passando como parametros o registro que foi inserido, alterado ou removido.

- Para utilizar esse recurso adicionamos isso ao serverless.ts:


```ts
functions: {
  trigger_lambda: {
    tags: {
      function: 'dynamodb-example-trigger-lambda',
    },
    handler: 'src/triggersLambda/processTrigger.process',
    events: [
      {
        stream: {
          type: 'dynamodb',
          batchSize: 1,
          startingPosition: 'LATEST',
          arn: {
            'Fn::GetAtt': ['TasksTable', 'StreamArn'], // TasksTable é o nome do recurso que estamos definindo logo abaixo
          },
        },
      },
    ],
  },
},
resources: {
  Resources: {
    TasksTable: { // Recurso que cria nossa tabela
      Type: 'AWS::DynamoDB::Table',
      DeletionPolicy: 'Retain', // Previnir apagar tabela quando executarmos o comando serverless remove
      Properties: {
        TableName: 'Tasks',
        TimeToLiveSpecification: {
          AttributeName: 'ttl', // O nome do campo de tempo de vida é ttl
          Enabled: true, // Habilitando tempo de vida para os registros
        },
        ProvisionedThroughput: {
          ReadCapacityUnits: 1,
          WriteCapacityUnits: 1,
        },
        // caso for sob demanda remover o ProvisionedThroughput inteiro e adicionar o seguinte:
        // BillingMode: 'PAY_PER_REQUEST',
        StreamSpecification: {
          StreamViewType: 'NEW_IMAGE', // NEW_IMAGE | OLD_IMAGE | NEW_AND_OLD_IMAGES | KEYS_ONLY
        },
        // Definir apenas campos que serão Hash, Range e indices
        AttributeDefinitions: [
          {
            AttributeName: 'category',
            AttributeType: 'S',
          },
          {
            AttributeName: 'id',
            AttributeType: 'S',
          },
          {
            AttributeName: 'created_by_user_id',
            AttributeType: 'S',
          },
          {
            AttributeName: 'designated_to_user_id',
            AttributeType: 'S',
          },
        ],
        // Hash e Range Keys
        KeySchema: [
          {
            AttributeName: 'category',
            KeyType: 'HASH',
          },
          {
            AttributeName: 'id',
            KeyType: 'RANGE',
          },
        ],
        // Indices
        GlobalSecondaryIndexes: [
          {
            IndexName: 'idx_key_of_created_by_user_id_task',
            Projection: {
              ProjectionType: 'ALL',
            },
            ProvisionedThroughput: {
              WriteCapacityUnits: 5,
              ReadCapacityUnits: 10,
            },
            KeySchema: [
              {
                KeyType: 'HASH',
                AttributeName: 'created_by_user_id',
              },
            ],
          },
          {
            IndexName: 'idx_key_of_designated_to_user_id_task',
            Projection: {
              ProjectionType: 'ALL',
            },
            ProvisionedThroughput: {
              WriteCapacityUnits: 5,
              ReadCapacityUnits: 10,
            },
            KeySchema: [
              {
                KeyType: 'HASH',
                AttributeName: 'designated_to_user_id',
              },
            ],
          },
        ],
      },
    },
    LambdaRole: {
      Type: 'AWS::IAM::Role',
      Properties: {
        RoleName: 'DynamoDBExample',
        AssumeRolePolicyDocument: {
          Version: '2012-10-17',
          Statement: {
            Effect: 'Allow',
            Principal: {
              Service: ['lambda.amazonaws.com'],
            },
            Action: 'sts:AssumeRole',
          },
        },

        Policies: [
          {
            PolicyName: 'dynamodb-example-policy',
            PolicyDocument: {
              Version: '2012-10-17',
              Statement: [
                {
                  Effect: 'Allow',
                  Action: [
                    'logs:createLogGroup',
                    'logs:createLogStream',
                    'logs:putLogEvents',
                    'ec2:CreateNetworkInterface',
                    'ec2:DescribeNetworkInterfaces',
                    'ec2:DeleteNetworkInterface',
                  ],
                  Resource: '*',
                },
                {
                  Effect: 'Allow',
                  Action: [
                    'dynamodb:GetItem',
                    'dynamodb:PutItem',
                    'dynamodb:DeleteItem',
                    'dynamodb:Scan',
                    'dynamodb:UpdateItem',
                    'dynamodb:DescribeTable',
                    'dynamodb:CreateTable',
                    'dynamodb:BatchWriteItem',
                    'dynamodb:DescribeTimeToLive',
                    'dynamodb:UpdateTimeToLive',
                    'dynamodb:Delete',
                    'dynamodb:Update',
                    'dynamodb:ListStreams',
                  ],
                  Resource: 'arn:aws:dynamodb:us-east-1:*:table/Tasks',
                },
              ],
            },
          },
        ],
      },
    },
  },
},

```

- Esse modelo consideramos que a tabela não existe, por tanto obtemos as informações do recurso quando ele for criado:
```ts
arn: {
  'Fn::GetAtt': ['TasksTable', 'StreamArn'], // TasksTable é o nome do recurso que estamos definindo logo abaixo
},
```

e que estamos criando o recurso:

```ts
Resources: {
  TasksTable: { // Recurso que cria nossa tabela
    // ...
  },
  // ...
},
```

- Caso já tenhamos o recurso, precisamos copiar o arn:

![ARN do Dynamodb streams](./readme/assets/dynamodbstreams_arn.png?raw=true "ARN do Dynamodb streams")

- Podemos remover o `TasksTable` das configurações do serverless.ts:

```ts
Resources: {
  // Comentar ou remover a configuração do TaskTable
  // TasksTable: { // Recurso que cria nossa tabela
    // ...
  // },
  // ...
},
```

- Na declaração do lambda do `trigger_lambda` ajustar o arn:

```ts
trigger_lambda: {
      tags: {
        function: 'dynamodb-example-trigger-lambda',
      },
      handler: 'src/triggersLambda/processTrigger.process',
      events: [
        {
          stream: {
            type: 'dynamodb',
            batchSize: 1,
            startingPosition: 'LATEST',
            arn: {
              'Fn::Join': [
                ':',
                [
                  'arn:aws:dynamodb',
                  {
                    Ref: 'AWS::Region',
                  },
                  {
                    Ref: 'AWS::AccountId',
                  },
                  'table/Tasks/stream/2021-05-20T11:14:03.493', // /!\ Inserir a mesma data do arn do dynamodb stream /!\
                ],
              ],
            },
          },
        },
      ],
    },
```

- Adicionar as permissões:

```ts
{
  Effect: 'Allow',
  Action: [
    'dynamodb:GetRecords',
    'dynamodb:GetShardIterator',
    'dynamodb:DescribeStream',
    'dynamodb:ListStreams',
  ],
  Resource: {
    'Fn::Join': [
      ':',
      [
        'arn:aws:dynamodb',
        {
          Ref: 'AWS::Region',
        },
        {
          Ref: 'AWS::AccountId',
        },
        'table/Tasks/stream/2021-05-20T11:14:03.493', // /!\ The Date can change!!! /!\
      ],
    ],
  },
},
```

## DynamoDB - TTL (Tempo de vida de um registro)

* Para adicionarmos tempo de vida aos registros precisamos habilitar isso no recurso da tabela no arquivo `serverless.ts`:

```ts
resources: {
  Resources: {
    TasksTable: { // Recurso que cria nossa tabela
      Type: 'AWS::DynamoDB::Table',
      DeletionPolicy: 'Retain', // Previnir apagar tabela quando executarmos o comando serverless remove
      Properties: {
        TableName: 'Tasks',
        TimeToLiveSpecification: {
          AttributeName: 'ttl', // O nome do campo de tempo de vida é ttl
          Enabled: true, // Habilitando tempo de vida para os registros
        },
      },
    },
  },
},
```

* Por fim adicionamos isso no schema da tabela definido no dynamoose, no arquivo `src/modules/task/infra/dynamoose/schemas/Task.ts`:

```ts
export default dynamoose.model<Task>('Tasks', schema, {
  // throughput: 'ON_DEMAND', // não conteplado no free
  waitForActive: {
    enabled: false,
  },

  create: process.env.STAGE === 'local',

  expires: { ttl: 20 * 60 * 1000 }, // <------- Tempo em milisegundos
  // Active only after created table in prod and is in prod env
  // create: false,
});
```
