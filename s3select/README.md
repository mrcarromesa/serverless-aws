# Serverless - S3Select

---

## O que é o projeto

- O projeto é apenas um exemplo de crud utilizando o S3Select com TTL e trigger (ao criar/remover arquivo chama uma function lambda)
- Arquivo compactado em GZIP

## Detalhes sobre a estrutura do projeto

- Para verificar mais detalhes sobre a estrutura do projeto acesse: [Serverless com alguns recursos aws](../README.md)

## Como testar via api

- Utilizando uma ferramenta para realizar chamadas REST importar o arquivo:
- [Simular API REST](./readme/api/api.json)

## S3 - Configuração necessária no serverless.ts

- Adicionamos o recurso, dê atenção aos comentários:

```ts
resources: {
  Resources: {
    UploadS3SelectBucket: { // nome do recurso, Podemos adicionar "qualquer nome" válido
      Type: 'AWS::S3::Bucket',
      DeletionPolicy: 'Retain', // o Retain faz com que o recurso não seja removido caso removamos o layout do cloudformation referente ao projeto
      Properties: {
        BucketName: '${self:custom.s3SelectBucketName}', // Nome do bucket... deve ser único dentre todas as contas aws, por isso é interessante utilizar um nome juntamente com uma string aleatória
        AccessControl: 'Private',
        Tags: [
          {
            Key: 's3SelectExample',
            Value: 'Example of s3 Select',
          },
        ],
        PublicAccessBlockConfiguration: {
          BlockPublicAcls: true,
          BlockPublicPolicy: true,
          IgnorePublicAcls: true,
          RestrictPublicBuckets: true,
        },
        CorsConfiguration: {
          CorsRules: [
            {
              AllowedMethods: ['HEAD'],
              AllowedOrigins: ['*'],
              AllowedHeaders: ['*'],
            },
          ],
        },
        LifecycleConfiguration: { // TTL
          Rules: [
            {
              Prefix: 'tmp/', // Qualquer objeto dentro da pasta "tmp/" será aplicada a regra de Expiração
              Status: 'Enabled',
              ExpirationInDays: 1, // Informamos tempo de expiração em dias
            },
          ],
        },
      },
    },
  },
  // ...
},
```

- Permissões:

```ts
{
  Effect: 'Allow',
  Action: [
    's3:PutObject',
    's3:GetObject',
    's3:ListBucket',
    's3:DeleteObject',
    's3:DeleteObjectVersion',
    's3:PutLifecycleConfiguration',
  ],
  Resource:
    'arn:aws:s3:::${self:custom.s3SelectBucketName}/*',
},
```

---

## Salvando item compactado no bucket

- Esse procedimento é realizado no service `src/modules/services/create/AddTasks.service.ts`:

```ts
const taskStr = tasksWithIds
  .map(item => {
    const text = JSON.stringify(item);
    return text;
  })
  .join('\n');
const tasksBuffer = Buffer.from(taskStr, 'utf8').toString('base64');

const s3Select = container.resolve<IStorageProvider>('StorageProvider');
await s3Select.saveTextToS3InGzip({
  bucket: process.env.S3_BUCKET_S3_SELECT || '',
  key: 'tmp/tasks',
  body: tasksBuffer,
});
```

- é pecorrido todos os itens de um array, transformado os objetos em string JSON, e adicionado quebra de linha `\n`, a cada item do array.
- codificamos o resultado em utf8, utilizando base64 e enviamos para compactação e por fim salvamos no s3 compactado.

- Por fim salvamos o item no s3, conforme `src/shared/container/providers/StorageProvider/implementations/S3Provider.ts`:

```ts
public async saveTextToS3InGzip({
  bucket,
  key,
  body,
  content_type = 'application/octet-stream',
}: ISaveFileContentParamsDTO): Promise<void> {
  const gzip = zlib.gzipSync(Buffer.from(body, 'base64'));

  const bodyGzip64 = gzip.toString('base64');

  await S3.putObject({
    Bucket: bucket,
    Key: key,
    Body: Buffer.from(bodyGzip64, 'base64'),
    ContentType: content_type,
    // Expires: addHours(new Date(), 1),
  }).promise();
}
```

- Realizamos compactação do arquivo em gzip
- E salvamos no s3 utilizando o comando `putObject`

## Select itens

- Para consultar algum item dentro do objeto utilizamos o s3 select, um exmplo está em `src/modules/task/services/query/GetTaskByCategory.service.ts`:

```ts
const s3Select = container.resolve<IStorageProvider>('StorageProvider');
return s3Select.selectFileContent<ITaskSaveDTO>({
  file_path: 'tmp/tasks',
  bucket: process.env.S3_BUCKET_S3_SELECT || '',
  query: `select s.* from s3object s WHERE s.category = '${category}' `,
});
```

- Esse trecho chama o metodo `selectFileContent`, passando a query no formato SQL.
- Mais detalhes de como é chamado esse recurso na aws, verifique o arquivo `src/shared/container/providers/StorageProvider/implementations/S3Provider.ts`


## Paginação e count items

- no s3 select não há paginação de uma forma nativa, para tal é necessário adicionar um campo que sirva como contador...

```json
[{
	"category": "Evolução3",
	"created_by_user_id": "uuid2",
	"designated_to_user_id": "uuid2",
	"title": "Task Dynamo 2",
	"description": "2Objetivo ...",
	"last_key": 1
},
 {
		"category": "Evolução3",
		"created_by_user_id": "uuid3",
		"designated_to_user_id": "uuid3",
		"title": "Task Dynamo 3",
		"description": "3Objetivo ...",
		"last_key": 2
	}
]
```

- No caso acima adicionamos um item chamado last_key, e para realizarmos uma paginação através dele utilizamos o service `src/modules/task/services/query/ListTaskPaginated.service.ts`:

```ts
const result = await s3Select.selectFileContent<ITaskSaveDTO>({
  file_path: 'tmp/tasks',
  bucket: process.env.S3_BUCKET_S3_SELECT || '',
  query: `select s.* from s3object s WHERE s.last_key > ${last_key} LIMIT ${limit} `,
});
```

- Se o last_key for 0 e o limit for 1 ele retornará:

```json
[{
	"category": "Evolução3",
	"created_by_user_id": "uuid2",
	"designated_to_user_id": "uuid2",
	"title": "Task Dynamo 2",
	"description": "2Objetivo ...",
	"last_key": 1
}]
```

- Se o last_key for 1 e o limit for 1 ele retornará:

```json
[{
		"category": "Evolução3",
		"created_by_user_id": "uuid3",
		"designated_to_user_id": "uuid3",
		"title": "Task Dynamo 3",
		"description": "3Objetivo ...",
		"last_key": 2
}]
```

- Também podemos retornar o número total de registro dessa forma conforme `src/modules/task/services/query/ListTaskPaginated.service.ts`:

```ts
const count = await s3Select.selectFileContent<ICountResult>({
  file_path: 'tmp/tasks',
  bucket: process.env.S3_BUCKET_S3_SELECT || '',
  query: `SELECT count(*) FROM s3object s WHERE s IS NOT MISSING`,
});
```

- Ele retornará:

```js
[{ _1: 2 }]
```

### Trigger

- Trigger via function mais simples! em serverless.ts:

```ts
// ... MORE ...
functions: {
  trigger_lambda: {
    tags: {
      function: 's3select-example-trigger-lambda',
    },
    handler: 'src/triggersLambda/processTrigger.process',
    events: [
      {
        s3: {
          bucket: '${self:custom.s3SelectBucketName}', // Informa o nome do bucket aqui
          existing: true,
          event: 's3:ObjectCreated:*',
          // event: 's3:ObjectRemoved:*', // s3:ObjectRemoved:* || s3:ObjectCreated:*, s3:ObjectCreated:* quando não informado
        },
      },
    ],
  },
}
// ... MORE ...
```

- Trigger via sqs mais complexo... em _serverless_trigger_sqs.ts:

```ts
// ... MORE ...
Resources: {
  UploadS3SelectBucket: {
    Type: 'AWS::S3::Bucket',
    DependsOn: ['QueuePolicySQS'], // <--- Informar a politica de filas
    Properties: {
      // ... MORE ...
      NotificationConfiguration: { // <--- Informar como será notificado
        QueueConfigurations: [
          {
            Event: 's3:ObjectCreated:*', // event: 's3:ObjectRemoved:*', // s3:ObjectRemoved:* || s3:ObjectCreated:*,
            Queue: { // Adiciona o arn do sqs
              'Fn::Join': [
                ':',
                [
                  'arn:aws:sqs',
                  { Ref: 'AWS::Region' },
                  { Ref: 'AWS::AccountId' },
                  'SQSExampleProcessTasksQueue',
                ],
              ],
            },
          },
        ],
      },
    }
  },
  QueuePolicySQS: { // <---- Politica de filas
    Type: 'AWS::SQS::QueuePolicy',
    Properties: {
      PolicyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Effect: 'Allow',
            Principal: {
              Service: 's3.amazonaws.com',
            },
            Action: ['sqs:sendMessage'],
            Resource: 'arn:aws:sqs:us-east-1:*:SQSExampleProcessTasksQueue',
            Condition: {
              ArnLike: { // Qual bucket que deve disparar a notificação
                'aws:SourceArn':
                  'arn:aws:s3:*:*:${self:custom.s3SelectBucketName}',
              },
            },
          },
        ],
      },
      Queues: [
        { // Precisa ser o URL
          'Fn::Join': [
            '',
            [
              'https://sqs:',
              { Ref: 'AWS::Region' },
              '.amazonaws.com/',
              { Ref: 'AWS::AccountId' },
              '/SQSExampleProcessTasksQueue',
            ],
          ],
        },
      ],
    },
  },
}
// ... MORE ...
```

- Basicamente precisamos informar o `DependsOn: ['QueuePolicySQS'], ` no resource do bucket, adicionar a `NotificationConfiguration` nas props do bucket criar a politica que foi informada no `DependsOn`, realmente muito mais informações para chamar uma, ou mais filas...

- Já utilizando na function a primeira opção `trigger_lambda`, é bem mais simples e a chamada das filas poderemos fazer pela função chamada no handler

- O Payload recebido via FILA (SQS) será como esse:

```json
[{
    "messageId": "UUID",
    "receiptHandle": "base64",
    "body": "{\"Records\":[{\"eventVersion\":\"2.1\",\"eventSource\":\"aws:s3\",\"awsRegion\":\"REGION\",\"eventTime\":\"2021-10-26T12:56:45.124Z\",\"eventName\":\"ObjectCreated:Put\",\"userIdentity\":{\"principalId\":\"AWS:...\"},\"requestParameters\":{\"sourceIPAddress\":\"IP\"},\"responseElements\":{\"x-amz-request-id\":\"...\",\"x-amz-id-2\":\"...\"},\"s3\":{\"s3SchemaVersion\":\"1.0\",\"configurationId\":\"...\",\"bucket\":{\"name\":\"BUCKET_NAME\",\"ownerIdentity\":{\"principalId\":\"...\"},\"arn\":\"arn:aws:s3:::BUCKET_NAME\"},\"object\":{\"key\":\"tmp/tasks\",\"size\":1302,\"eTag\":\"...\",\"sequencer\":\"...\"}}}]}",
    "attributes": {
        "ApproximateReceiveCount": "1",
        "SentTimestamp": "1635253006527",
        "SenderId": "ID",
        "ApproximateFirstReceiveTimestamp": "1635253006531"
    },
    "messageAttributes": {},
    "md5OfBody": "md5",
    "eventSource": "aws:sqs",
    "eventSourceARN": "arn:aws:sqs:REGION:ACCOUNT_ID:SQSExampleProcessTasksQueue",
    "awsRegion": "REGION"
}]

```

- Já o payload recebido via function o primeiro caso `trigger_lambda` será esse:

```json
{
    "Records": [
        {
            "eventVersion": "2.1",
            "eventSource": "aws:s3",
            "awsRegion": "us-east-1",
            "eventTime": "2021-10-26T13:33:45.965Z",
            "eventName": "ObjectCreated:Put",
            "userIdentity": {
                "principalId": "..."
            },
            "requestParameters": {
                "sourceIPAddress": "IP"
            },
            "responseElements": {
                "x-amz-request-id": "...",
                "x-amz-id-2": "..."
            },
            "s3": {
                "s3SchemaVersion": "1.0",
                "configurationId": "...",
                "bucket": {
                    "name": "BUCKET_NAME",
                    "ownerIdentity": {
                        "principalId": "..."
                    },
                    "arn": "arn:aws:s3:::..."
                },
                "object": {
                    "key": "tmp/tasks",
                    "size": 1304,
                    "eTag": "...",
                    "sequencer": "..."
                }
            }
        }
    ]
}
```
