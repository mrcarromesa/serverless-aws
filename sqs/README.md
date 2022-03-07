# Serverless - SQS

---

## O que é o projeto

- O projeto é apenas um exemplo de SQS

## Detalhes sobre a estrutura do projeto

- Para verificar mais detalhes sobre a estrutura do projeto acesse: [Serverless com alguns recursos aws](../README.md)

---

## Definir fila

### Resources

- O primeiro de tudo definimos as filas como recursos, dessa forma:

- No arquivo `serverless.ts` adicionamos:

```ts
// ...MORE
Resources: {
  SQSExampleProcessTasksQueue: { // <== Aqui adicionar o nome da sua fila
    Type: 'AWS::SQS::Queue',
    Properties: {
      QueueName: 'SQSExampleProcessTasksQueue', // <== Aqui adicionar o nome da sua fila, conforme adicicionado mais acima!
      VisibilityTimeout: 3600,
      MessageRetentionPeriod: 1209600,
      RedrivePolicy: {
        deadLetterTargetArn: {
          'Fn::GetAtt': ['SQSExampleProcessTasksQueueDead', 'Arn'], // <== Aqui adicionar o nome da fila "morta" ou seja quando a fila falhar será tratada pela fila morta
        },
        maxReceiveCount: 1,
      },
    },
  },
  SQSExampleProcessTasksQueueDead: { // <== Aqui adicionar o nome da fila morta
    Type: 'AWS::SQS::Queue',
    Properties: {
      QueueName: 'SQSExampleProcessTasksQueueDead', // <== Aqui adicionar o nome da fila morta conforme o acima
      VisibilityTimeout: 3600,
      MessageRetentionPeriod: 1209600,
      DelaySeconds: 5,
    },
  },
  // ... MORE
}
```

### Permissões

- Segundo adicionamos as permissões para que o nosso lambda possa chamar/executar a fila:

- No arquivo  `serverless.ts` adicionamos:

```ts
// ... MORE
  {
    Effect: 'Allow',
    Action: [
      'sqs:sendMessage',
      'sqs:deleteMessage',
      'sqs:getQueueAttributes',
      'sqs:receiveMessage',
    ],
    Resource:
      'arn:aws:sqs:us-east-1:*:SQSExampleProcessTasksQueue', // Nome da fila conforme definido nos Resources
  },
  {
    Effect: 'Allow',
    Action: [
      'sqs:sendMessage',
      'sqs:deleteMessage',
      'sqs:getQueueAttributes',
      'sqs:receiveMessage',
    ],
    Resource:
      'arn:aws:sqs:us-east-1:*:SQSExampleProcessTasksQueueDead', // Nome da fila morta conforme definido nos Resources
  },
// ... MORE
```

### Functions

- Por fim podemos definir o qual arquivo será executado quando nossa fila for chamada:
- No arquivo  `serverless.ts` adicionamos:

```ts
// ... MORE
  process_tasks: { // Pode ser qualquer nome "válido"
    tags: {
      function: 'sqs-example-process_tasks',
    },
    role: 'LambdaRole',
    reservedConcurrency: 1,
    timeout: 20,
    name: 'sqs-example-process_task',
    handler: 'src/queue/task/processTasksSuccess.process', // Qual arquivo será executado! nesse caso será o arquivo src/queue/task/processTasksSuccess.ts chamando a function process
    events: [
      {
        sqs: {
          arn: {
            'Fn::GetAtt': ['SQSExampleProcessTasksQueue', 'Arn'], // Informamos qual fila essa função ficará "escutando"
          },
          batchSize: 1,
        },
      },
    ],
  },
  catch_queue_errors: { // Esse é o da fila morta, também pode ser qualquer nome
    tags: {
      function: 'sqs-example-catch_queue_errors',
    },
    role: 'LambdaRole',
    reservedConcurrency: 10,
    maximumRetryAttempts: 2,
    timeout: 60,
    name: 'sqs-example-catch_queue_errors',
    handler: 'src/dlq/catchErrorQueue.process',
    events: [
      {
        sqs: {
          arn: {
            'Fn::GetAtt': ['SQSExampleProcessTasksQueueDead', 'Arn'],
          },
        },
      },
    ],
  },
// ... MORE
```


---

## Chamando a fila:

- Um exemplo de como chamar a fila está em `src/modules/task/infra/http/controllers/TasksController.ts`:

```ts
// A função SendMessageToQueue está implementada em 'src/shared/libs/SendMessageToQueue/index.ts';
return SendMessageToQueue.execute({
  queue_name: 'SQSExampleProcessTasksQueue', // O nome da fila conforme especificado previamente no arquivo `serverless.ts`
  payload: JSON.stringify({ item }), // payload em javascript object parseado pelo JSON.stringify()
});
```

### Recebendo a fila

- No arquivo `src/queue/task/processTasksSucess.ts` temos um exemplo de como receber a fila:

```ts
export const process: SQSHandler = async event => {
  console.time();
  console.log('HERE!', new Date());
  logger('Queue called');
  try {
    logger(event.Records);
    await sleep(5000);
  } catch (err) {
    console.log(err);
  }
  console.timeEnd();
};
```

- Será recebido através do object `event.Records` o payload envaido!

---

## Alguns detalhes importantes

- Revendo algumas configurações exibidas anteriormentes temos:


```ts
// ...MORE
Resources: {
  SQSExampleProcessTasksQueue: {
    Type: 'AWS::SQS::Queue',
    Properties: {
      QueueName: 'SQSExampleProcessTasksQueue',
      // ...MORE
      RedrivePolicy: {
        deadLetterTargetArn: {
          'Fn::GetAtt': ['SQSExampleProcessTasksQueueDead', 'Arn'],
        },
        maxReceiveCount: 1, // <== AQUI
      },
    },
  },
}
// ...MORE
```

- O parâmetro `maxReceiveCount` acima informamos quantas tentativas podem falhar para cada registro antes de enviar para a fila morta!
- Do contrário a fila ficará tentando processar até que não seja lançada alguma exception, Então esse ponto é muito importante ser tratado, seja com essa propriedade ou com o trycatch!

---

- Definir o número de concorrências:

```ts
// ... MORE
  process_tasks: {
    // ...MORE
    reservedConcurrency: 1,  // <== AQUI
    // ...MORE
    events: [
      {
        sqs: {
          arn: {
            'Fn::GetAtt': ['SQSExampleProcessTasksQueue', 'Arn'], // Informamos qual fila essa função ficará "escutando"
          },
          batchSize: 1, // <== AQUI
        },
      },
    ],
  },
```

- Através da propriedade `reservedConcurrency` podemos definir quantas filas serão executadas de forma "simultânea"
- Um caso de uso seria... imagine que precise consumir uma API na qual tem um número de requisições simultâneas baixo ou limitado, em alguns casos é melhor que seja executada a próxima fila só quando a anterior finalizar, ou seja uma por uma, nesse caso podemos utilizar aqui o `reservedConcurrency: 1,`!

- O `batchSize` utilizamos para informar até quantos registros queremos receber no `event.Records`, no arquivo `src/queue/task/processTasksSucess.ts`!

---

## Utilizar fila de forma local

- Para tal seguir o Guia [Como utilizar fila local](https://github.com/mrcarromesa/serverless-aws#como-utilizar-fila-local)
