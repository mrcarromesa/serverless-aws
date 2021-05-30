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
