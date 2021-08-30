import { logger } from '@config/logger';
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

interface APIParams extends AxiosRequestConfig {
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'OPTIONS';
}

class Api {
  private readonly api: AxiosInstance;

  constructor() {
    this.api = axios.create();
    this.api.interceptors.request.use(
      config => {
        if (config.data) {
          Object.assign(config.headers, { 'Content-Type': 'application/json' });
        }

        // logger('api-request', config);

        return config;
      },
      error => {
        // logger('api-request-error', error);
        return Promise.reject(error);
      },
    );

    this.api.interceptors.response.use(
      response => {
        // const { headers = {}, data = {} } = response;
        // // const isJsonContent =
        // //   headers &&
        // //   headers['content-type'] &&
        // //   headers['content-type'].split(';')[0] === 'application/json';

        // logger('api-response', (isJsonContent && data) || 'Non JSON body');

        return response;
      },
      error => {
        const {
          data = {},
          status = '',
          statusText = '',
        } = error.response || {
          data: {},
          status: '',
          statusText: '',
        };

        const msgDetails = {
          message: `Response error - ${statusText}`,
          status,
          response: data,
        };

        logger('api-response-error', msgDetails);

        return Promise.reject(error);
      },
    );
  }

  public async call<T>({
    url,
    method,
    data,
    headers,
    ...rest
  }: APIParams): Promise<AxiosResponse<T>> {
    return this.api({ data, url, method, headers, ...rest });
  }
}

export default new Api();
