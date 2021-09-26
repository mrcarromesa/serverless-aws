# Serverless - Lambda Invoke REST

---

## O que é o projeto

- O projeto é apenas um exemplo de ao chamar o endpoint, será chamado outro lambda utilizando o lambda.invoke

## Detalhes sobre a estrutura do projeto

- Para verificar mais detalhes sobre a estrutura do projeto acesse: [Serverless com alguns recursos aws](../README.md)

## Como testar via api

- Utilizando uma ferramenta para realizar chamadas REST:
- `POST` URL/call-client
  - `Headers`:
    `x-api-key`: '_X_API_KEY_'

- No lugar de `_X_API_KEY_` utilizar o valor no arquivo `serverless.ts` em `provider.apiKeys[n].value`

- Mais detalhes em [lambdainvoke](../lambdainvoke/README.md)
