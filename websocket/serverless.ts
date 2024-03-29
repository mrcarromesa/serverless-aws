import type { AWS } from '@serverless/typescript';

const serverlessConfiguration: AWS = {
  service: 'websocket-example',
  useDotenv: true,
  variablesResolutionMode: '20210219',
  configValidationMode: 'warn',
  frameworkVersion: '*',
  custom: {
    webpack: {
      webpackConfig: './webpack.config.js',
      includeModules: true,
      forceExclude: ['aws-sdk', 'sqlite3'],
      exculdeFiles: './src/modules/**/services/**/*.spec.ts',
    },
    apiGatewayTags: {
      Owner: 'mrcarromesa',
      Product: 'websocketExample',
      Service: 'websocketExample',
    },
    profiles: {
      local: 'local',
      dev: 'dev',
    },
    sharedBucketName: 'lambda-artifacts-123409abdvlgf',
    // customDomain: {
    //   rest: {
    //     domainName: '${env:DOMAIN}',
    //     stage: '${env:STAGE}',
    //     basePath: '${env:BASE_PATH}',
    //     createRoute53Record: false,
    //     endpointType: 'regional',
    //   },
    //   websocket: {
    //     domainName: 'ws${env:DOMAIN}',
    //     stage: '${env:STAGE}',
    //     basePath: 'user-permissions',
    //     createRoute53Record: false,
    //     endpointType: 'regional',
    //   },
    // },
  },

  plugins: [
    'serverless-webpack',
    'serverless-offline',
    'serverless-dotenv-plugin',
    // 'serverless-domain-manager',
  ],
  provider: {
    name: 'aws',
    runtime: 'nodejs12.x',
    region: 'us-east-1',
    profile: "${self:custom.profiles.${env:stage, 'dev'}, 'default'}",
    deploymentBucket: {
      blockPublicAccess: true, // Prevents public access via ACLs or bucket policies. Default is false
      skipPolicySetup: false, // Prevents creation of default bucket policy when framework creates the deployment bucket. Default is false
      // Pelo visto o bucket precisa existir previamente antes de realizar o deploy, ou seja criar o bucket manualmente
      name: '${self:custom.sharedBucketName}', // Deployment bucket name. Default is generated by the framework
      maxPreviousDeploymentArtifacts: 10, // On every deployment the framework prunes the bucket to remove artifacts older than this limit. The default is 5
      tags: {
        bucket: 'lambdas-artifacts',
      },
    },
    memorySize: 1536,
    logRetentionInDays: 30,
    versionFunctions: false,
    // apiGateway: {
    //   shouldStartNameWithService: true,
    //   minimumCompressionSize: 1024,
    // },
    // apiKeys: [
    //   {
    //     name: 'websocketExample',
    //     value: 'mykeyasdf898asfda90sdfjijklajsdfa9d',
    //     description:
    //       'Essa api key é utilizada para acessar o serviço de websocketExample',
    //   },
    // ],
    timeout: 30,
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
    },
  },

  functions: {
    websocketConnectionHandler: {
      tags: {
        function: 'websocket-example-websocket-connection-handler',
      },
      role: 'LambdaRole',
      handler: 'src/websocket.connectHandler',
      events: [
        {
          websocket: {
            route: '$connect',
          },
        },
      ],
    },
    websocketDisconnectionHandler: {
      tags: {
        function: 'websocket-example-websocket-disconnection-handler',
      },
      role: 'LambdaRole',
      handler: 'src/websocket.disconnectHandler',
      events: [
        {
          websocket: {
            route: '$disconnect',
          },
        },
      ],
    },
    websocketHandler: {
      tags: {
        function: 'websocket-example-websocket-handler',
      },
      role: 'LambdaRole',
      handler: 'src/websocket.defaultHandler',
      events: [
        {
          websocket: {
            route: '$default',
          },
        },
      ],
    },
    broadcastHandler: {
      tags: {
        function: 'websocket-example-websocket-broadcast-handler',
      },
      role: 'LambdaRole',
      handler: 'src/websocket.broadcastHandler',
      events: [
        {
          websocket: {
            route: 'broadcastMessage',
          },
        },
      ],
    },
  },
  resources: {
    Resources: {
      WebsocketTable: {
        Type: 'AWS::DynamoDB::Table',
        DeletionPolicy: 'Retain',
        Properties: {
          TableName: 'Websocket',
          TimeToLiveSpecification: {
            AttributeName: 'ttl',
            Enabled: true,
          },
          ProvisionedThroughput: {
            ReadCapacityUnits: 1, // caso for sob demanda colocar 0
            WriteCapacityUnits: 1, // caso for sob demanda colocar 0
          },
          // caso for sob demanda remover o ProvisionedThroughput inteiro e adicionar o seguinte:
          // BillingMode: 'PAY_PER_REQUEST',
          StreamSpecification: {
            StreamViewType: 'NEW_IMAGE', // NEW_IMAGE | OLD_IMAGE | NEW_AND_OLD_IMAGES | KEYS_ONLY
          },
          AttributeDefinitions: [
            {
              AttributeName: 'id',
              AttributeType: 'S',
            },
          ],
          KeySchema: [
            {
              AttributeName: 'id',
              KeyType: 'HASH',
            },
          ],
        },
      },
      LambdaRole: {
        Type: 'AWS::IAM::Role',
        Properties: {
          RoleName: 'websocketExample',
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
              PolicyName: 'websocket-example-policy',
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
                    Resource: 'arn:aws:dynamodb:us-east-1:*:table/Websocket',
                  },
                  {
                    Effect: 'Allow',
                    Action: [
                      'execute-api:Invoke',
                      'execute-api:ManageConnections',
                    ],
                    Resource: 'arn:aws:execute-api:us-east-1:*:*',
                    // "arn:aws:execute-api:us-east-1:*:**/@connections/*"
                  },
                ],
              },
            },
          ],
        },
      },
    },
  },
};

module.exports = serverlessConfiguration;
