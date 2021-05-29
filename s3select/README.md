# Serverless - S3Select

---

## O que é o projeto

- O projeto é apenas um exemplo de crud utilizando o S3Select com TTL e trigger (ao criar/remover arquivo chama uma function lambda)
- Arquivo compactado em GZIP


## Baixar dependências

- Para baixar as dependências para o projeto execute o comando:

```shell
yarn
```

---

## Compilar projeto em tempo de desenvolvimento para verificar se há erros no fonte ou de typescript

- Em um terminal, acesse a pasta do projeto onde está o arquivo `package.json`, e execute o seguinte comando no terminal:

```shell
yarn tsc --watch --noEmit --project './tsconfig.json'
```

- E, enquanto desenvolve, acompanhe os logs que aparecem!
- Antes de enviar um commit para o repositório, confira se há algum error reportado, verifique isso mesmo que os testes estejam funcionando!

---

## Commit do projeto

- Foi adicionado a dependência `pre-commit`, e adicionado as seguintes condições no `package.json`:

```json
"scripts": {
  // ...
  "lint": "eslint --ext .ts ./src/**",
  "compile": "tsc -p tsconfig.json --noEmit"
},
"pre-commit": [
  "lint",
  "compile"
],
```

- Ou seja antes de realizar o commit será verificado se:
- Não há nenhum erro de eslint no projeto
- Não há nenhum erro de typescript no projeto

- caso seja encontrado algum erro ele exibirá um aviso dos problemas encontrados e não permitirá o commit até o problema ser resolvido,
**O processo de commit poderá demorar um pouco a mais que o normal**

### Mas tenho certeza que está tudo certinho e preciso fazer o commit de qualquer forma

- Não é recomendado fazer isso, pois os erros reportados pelo eslint, e erro de typescript, podem quebrar o projeto quando estiver em execução.
- Mas se tem certeza que está tudo certo e quer continuar mesmo assim, realize o commit com a flag: `--no-verify`:

```shell
git commit -m "Commit anyway 😈!" --no-verify
```

- Será realizado commit e poderá prosseguir com o push.

---

## Estrutura do projeto

- O projeto segue o design pattern SOLID

### src/modules

- Essa pasta separa os módulos do backend, como se fossem entidades independentes

- Dentro de cada módulo podemos ter:
  - `infra` nessa pasta contém funções específicas de determinado protocolo ou provider.
    - Exemplo para repositórios o qual faz consulta com a base de dados, é especificado qual "provider" será utilizado, seja knex, typeorm, e assim por diante.
    No caso do http considero que estou trabalhando com o modelo tradicional API REST, o qual utilizo verbos e protocolo http, mas se algum dia decidi utilizar outro protocolo como o gRPC adicione ele nessa pasta `infra`

    - `infra/dynamoose/` para esse projeto foi escolhido a utilização da lib [dynamoosejs](http://dynamoosejs.com/) para utilizar o modelo de query builder.

    - `infra/dynamoose/repositories` Repositórios que implementam o modelo estruturado pela interface de `../../repositories` e que realiza diretamente insert, update, delete e consulta nas tableas

    - `infra/dynamoose/schemas` São arquivos que contém a estrutura da tabela exatamente como na base de dados, com todos os atributos e seus respectivos tipos e são utilizados pelos `repositories` em geral como retorno do resultado de uma consulta

    - `infra/http/controllers` nessa pasta contém os controllers referentes ao módulo
      - O controller poderá ter **apenas** esses metódos:
        - index (Método GET): Quando queremos retornar uma listagem ou um array
        - read (Método GET): Quando retornamos um registro específico
        - create (Método POST): Quando iremos criar um ou mais registros ... (status de retorno em geral 201 com retorno em vazio)
        - update (Método PUT/PATCH): Quando iremos atualizar um ou mais registros ... (status de retorno em geral 204 com retorno em vazio)
        - delete (Método DELETE): Quando iremos apagar um ou mais registros
    - `infra/http/routes` nessa pasta contém as rotas referente ao módulo
    - `infra/http/validators` nessa pasta contém middlewares de validação do conteúdo enviado para os endpoints
    - `infra/http/middleware` nessa pasta contém middlewares para realizar algumas validações adicionais como verificar autenticação, adicionar novas propriedades ao `Request`

  - `dtos` (Data Transfer Object) são interfaces que contêm o formato de parâmetros que são enviados, e ou retornados para/pelo repositories, ou qualquer outro recurso necessário
  - `services` - Serviços o qual devem conter um único metódo chamado `execute` e o mesmo deve ter uma única responsabilidade ou preocupação, é onde adicionamos regras de negócio da aplicação
    - Dentro dessa pasta `services` o nome dos arquivos segue esse padrão `NomeDaResponsabilidade.service.ts` e os tests por sua vez esse formato `NomeDaResponsabilidade.service.spec.ts`, para cada service deve haver um arquivo de test
  - `repositories` Interfaces que contêm os modelos de métodos no qual o `infra/knex/repositories` devem implementar
  - `repositories/fakes` simula o comportamento de `infra/knex/repositories/NomeDoRepository.ts` para ser utilizado quando realizamos testes unitários dos `services`
  - `views` utilizado para quando algum service envia e-mail, o template do e-mail deve ser criado dentro dessa pasta

  - `providers` - Pode ocorrer em casos especifícos no qual o módulo precisa definir um provider para ser chamado por alguns services, um exemplo disso é o boleto, ele precisa de algum provedor para emitir boleto, ele não precisa ser compartilhado com outros módulos como no caso do módulo de users, ele só precisa atender as necessidades especificamente do módulo de boletos, o que não seria o caso de um provider de envio de e-mail o qual pode ser utilizado por qualquer outro módulo, ou seja qualquer outro módulo pode enviar um e-mail, então nesse caso faz sentido que o provider de e-mail esteja compartilhado entre os `modules` e para isso que existe o `shared`
  **Importante: Devemos importar esse provider depois em `src/shared/container/index.ts`

## src/shared

- Quando há funções que podem e devem ser compartilhadas para todos os modules devem ser salvas dentro dessa pasta!

- `container` Utilizado para armazenar providers que podem ser utilizados por quaisquer serviço de quaisquer módulo
  - `container/providers` Providers de algum serviço no qual não é especifico para determinado módulo e que podem ser utilizados por quaisquer módulo podem ser criados aqui!
    - Ex: Um envio de e-mail... Podemos utilizar de vários providers, aws SES, mailchimp, api própria, etc. e um envio de e-mail pode ser disparado por qualquer módulo dessa forma criamos o provider aqui!
    - `providers/dtos` (Data Transfer Object) são interfaces que contêm o formato de parâmetros que são enviados, e ou retornados para/pelo models
    - `providers/fakes` simula o comportamento do provider o qual é chamado via service, para ser utilizado nos testes unitários
    - `providers/models` metódos que qualquer implementação deve conter, é a forma para padronizar os dados enviados e recebidos por qualquer implementação, ou seja se temos o provedor aws SES e mailchimp todos eles devem ter as mesma functions com o mesmo retorno!
    - `providers/implementations` - Aqui é a implementação em si do provedor que será utilizado, ele deve implementar o `../models`
  - `infra/http/routes/index.ts` - Quando criamos um `module/myModule/infra/http/routes/myModule.routes.ts`, devemos adicionar essa rota aqui também:
  ```ts
    import myModuleRouter from '@modules/myModuleRouter/infra/http/routes/myModuleRouter.routes';
    // ...

    routes.use(myModuleRouter);
  ```
  - `shared/libs` - Quando temos alguma function específica na qual não é nem um module, nem um provider, é um cálculo ou verificação que pode ser utilizada por qualquer outra function dentro do projeto, podemos criar aqui!

  - `src/queue` As filas que são definidas no serverless.ts podemos direcionar o `handler` dela para essa pasta!

  ```ts
    // serverless.ts:
    // ...
    process_my: {
      tags: {
        function: 'queue-processMy',
      },
      role: 'LambdaRole',
      timeout: 300,
      name: 'queue-processMy',
      handler: 'src/queue/processMy.process', // <- Aqui definimos a chamada da fila para `src/queue/nomeDoMeuArquivo.ts`
      events: [
        {
          sqs: {
            arn: {
              'Fn::GetAtt': [
                'QueueProcessMyQueue',
                'Arn',
              ],
            },
          },
        },
      ],
    },
    // ...
  ```

---

## Como testar via api

- Utilizando uma ferramenta para realizar chamadas REST importar o arquivo:
- [Simular API REST](./readme/api/api.json)

## S3Select -

