# Serverless - DynamoDB

---

## O que é o projeto

- O projeto é apenas um exemplo de crud utilizando o DynamoDB e DynamoDB Streams



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

### Injeção de dependência na prática!

- Para esse exemplo iremos utilizar para criação de repository, mas esse exemplo pode ser feito para providers também com poucas adaptações...

- Primeiro criamos a entity que representa a estrutura da tabela, nesse caso utilizaremos o modelo da tabela `Task` essa estrutura criamos em `src/modules/task/infra/dynamoose/schemas/Task.ts`

- Criamos a interface do repositories em `src/modules/task/repositories/ITaskRepository.ts`
- Criamos os dtos que são interfaces também...

```ts
// arquivo: src/modules/task/repositories/ITaskRepository.ts
// ... imports DTOS here!
// ...

type IResultRegister = ITaskSchemaDTO[] & ICommonPagination;
type IResultRegisterPartial = Partial<ITaskSchemaDTO>[] & ICommonPagination;
export { IResultRegister, IResultRegisterPartial };

export default interface ITaskRepository {
  create(data: ITaskSaveDTO): Promise<ITaskSchemaDTO>;
  update(data: ITaskSaveDTO): Promise<ITaskSchemaDTO>;
  findTaskByKeys(data: ITaskKeysDTO): Promise<ITaskSchemaDTO>;
  delete(data: ITaskKeysDTO): Promise<void>;
  batchDelete(data: ITaskKeysDTO[]): Promise<void>;
  findTasksByCategory(category: string): Promise<IResultRegister>;
  findTasksByUserCreatedId(user_id: string): Promise<IResultRegister>;
  findTasksByUserDesignatedId(user_id: string): Promise<IResultRegister>;
  findAllTasksPaginated(data: ITaskPaginatedDTO): Promise<IResultRegister>;
  findAllTasksPaginatedWithAttr(
    data: ITaskPaginatedWithAttrsDTO,
  ): Promise<IResultRegisterPartial>;
}

```

- Criamos a implementação dessa interface em `src/modules/task/infra/dynamoose/repositories/TaskRepository.ts`:

```ts
// ... imports here!
// ...
export default class TaskRepository implements ITaskRepository {
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
  // ... MORE ...
}
```

- Por fim em `src/shared/container/repositories/index.ts` adicionar o seguinte:

```ts
// ... imports here

import TaskRepository from '@modules/task/infra/dynamoose/repositories/TaskRepository'; // <- Implementation
import ITaskRepository from '@modules/task/repositories/ITaskRepository'; // <- interface
import { container } from 'tsyringe';

// ...

container.registerSingleton<ITaskRepository>(
  'TaskRepository', // ****** PRESTE ATENCAO AO NOME AQUI, SERÁ UTILIZADO MAIS TARDE!!!! ****
  TaskRepository
);


// ...
```

- Criamos o service que irá utilizar esse repository em `src/modules/task/services/create/AddTask.service.ts`:

```ts
import { inject, injectable } from 'tsyringe';
// ... imports here!

@injectable() // <- Indicamos que essa class recebe instâncias de class
export default class AddTaskService {
  constructor(
    @inject('TaskRepository') // <- Olha só esse nome, é familiar? Exato é o mesmo nome definido em src/shared/container/repositories/index.ts
    private taskRepository: ITaskRepository,
  ) {}

  async execute({
    category,
    created_by_user_id,
    designated_to_user_id,
    title,
    attachments = [],
    description = '',
  }: Omit<ITaskSaveDTO, 'id'>): Promise<ITaskSchemaDTO> {
    return this.taskRepository.create({
      id: uuid(),
      category,
      created_by_user_id,
      designated_to_user_id,
      title,
      attachments,
      description,
    });
  }
}
```

- E agora? como passo a instância de TaskRepository para esse service?

- Dessa forma conforme em `src/modules/task/infra/http/controllers/TasksController.service.ts`:

```ts

async create(req: Request, res: Response): Promise<Response> {
    const {
      category,
      created_by_user_id,
      designated_to_user_id,
      title,
      attachments = [],
      description = '',
    } = req.body;
    const addTask = container.resolve(AddTaskService); // <- Olha que maravilha!!!!
    const result = await addTask.execute({
      category,
      created_by_user_id,
      designated_to_user_id,
      title,
      attachments,
      description,
    });
    return res.json(result);
}
```

---

### Como utilizar fila local:

***Necessário ter o docker instaldo***

- Executar o comando:

```shell
yarn sqs:offline
```

- Esse comando subirá o container necessário para executar as filas localmente, mesmo após o docker terminar a execução aguarde alguns minutos para que o container tenha tempo de criar os serviços, após aguardar alguns minutos aí sim, siga para o próximo passo:

- Feito isso só executar o comando:

```shell
yarn dev
```

- Esse comando executará o serverless localmente

- Pode se que exiba alguns erros no console, pode ignorá-los

**Importante: O Nome das filas devem seguir o mesmo nome no Resources**

- Ex. observe os comentários no script a seguir:

```ts
Resources: {
      MyQueueCreateResultQueue: { // <- Esse nome deverá ser o mesmo que...
        Type: 'AWS::SQS::Queue',
        Properties: {
          QueueName: 'MyQueueCreateResultQueue', // <- o mesmo que esse nome
          VisibilityTimeout: 900,
        },
      },
    // ..
}
```

---

### Criando novas filas para tests local

- Quando criar uma nova fila no `serverless.ts` adicione ela no arquivo `create-queues.sh`:

```sh
QUEUES="MyQueueCreateResultQueue Fila1 Fila2 FilaN";
```

- Após adicionar execute o comando:

```shell
yarn sqs:offline
```

---

### Não quero utilizar filas para tests local

- Nesse caso comente o seguinte em `serverless.ts`:

```ts
  plugins: [
    'serverless-webpack',
    'serverless-offline',
    'serverless-offline-sqs', // <-- comente essa linha
    'serverless-offline-sqs-dlq', // <-- comente essa linha
    'serverless-dotenv-plugin',
    'serverless-domain-manager',
  ],
```

---

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

- Posso ter índices secundários, para dar mais flexibilidade a aplicação e tornar a consulta um pouco mais rápida
