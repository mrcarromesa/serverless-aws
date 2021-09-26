# Serverless - LambdaInvoke

---

## O que é o projeto

- O projeto é apenas um exemplo que retorna uma string e pode ser chamado diretamente a partir de outro lambda

## Detalhes sobre a estrutura do projeto

- Para verificar mais detalhes sobre a estrutura do projeto acesse: [Serverless com alguns recursos aws](../../README.md)

## Como testar via lambda

- É necessário adicionar permissão no serverless.ts do lambda que deseja utilizar esse recurso:

```ts
{
  Effect: 'Allow',
  Action: ['lambda:InvokeFunction'],
  Resource:
    'arn:aws:lambda:_REGION_:*:function:_FUNCTION_NAME_',
},
```

- No lugar de `_REGION_` inserir a região dessa function exemplo: `us-east-1`;
- No lugar de `_FUNCTION_NAME_` inserir o valor de `functions.name` desse projeto, no caso `lambdainvoke-example`

- Realizar chamada:

```ts
import * as AWS from 'aws-sdk';

export const lambdaConfig = new AWS.Lambda({
  region: 'us-east-1',
});

const lambdaInvoke = await lambdaConfig
      .invoke({
        FunctionName: '_FUNCTION_NAME_',
        InvocationType: 'RequestResponse',
        Payload: JSON.stringify(msg),
      })
      .promise();

const result = JSON.parse(String(lambdaInvoke.Payload));
const bodyResult = JSON.parse(result.body);

// TODO more
```

- No lugar de `_FUNCTION_NAME_` inserir o valor de `functions.name` desse projeto, no caso `lambdainvoke-example`
