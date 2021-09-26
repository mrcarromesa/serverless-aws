import * as AWS from 'aws-sdk';
import { ClientConfiguration } from 'aws-sdk/clients/acm';

AWS.config.update({
  region: 'us-east-1',
});

const STS = new AWS.STS();

let options: ClientConfiguration = {
  apiVersion: '2012-11-05',
};

const S3Aws = new AWS.S3({
  signatureVersion: 'v4',
});

if (process.env.STAGE === 'local') {
  options = {
    apiVersion: '2012-11-05',
    region: 'localhost',
    endpoint: 'http://0.0.0.0:9324',
    sslEnabled: false,
  };

  // S3Aws = new AWS.S3({
  //   s3ForcePathStyle: true,
  //   accessKeyId: 'S3RVER', // This specific key is required when working offline
  //   secretAccessKey: 'S3RVER',
  //   endpoint: new AWS.Endpoint('http://localhost:8000'),
  // });
}

const S3 = S3Aws;

export { S3 };

export const SQS = new AWS.SQS(options);
export const account = STS.getCallerIdentity();

export const lambdaConfig = new AWS.Lambda({
  region: 'us-east-1',
});

export default AWS;
