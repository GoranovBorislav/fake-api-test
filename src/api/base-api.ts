import * as allure from 'allure-js-commons';
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse, Method, RawAxiosRequestHeaders } from 'axios';
import { JsonFileReader } from '../utils/json-file-reader';

interface ConfigurationParameters {
    id?: number | string;
    headers?: RawAxiosRequestHeaders;
    payload?: any;
}

export class BaseApi {

    private static readonly SETTINGS_FILE: string = './appSettings.json';
    private readonly fileReader = new JsonFileReader();
    private readonly baseUrl;
    
    constructor() {
        this.baseUrl = this.fileReader.readFile(BaseApi.SETTINGS_FILE).baseApiUrl;
    }

    /**
     * This function builds the request configuration that should be used by axios.
     * @param requestMethod - The request method that will be used.
     * @param endpoint - The endpoint to which the request should be sent.
     * @param parameters - Configuration Parameters/Payload to be used for the request. Defaults to an empty object.
     * @returns An object of type {@link AxiosRequestConfig}
     */
    public buildRequestConfiguration(requestMethod: Method, endpoint: string, parameters: ConfigurationParameters = {}): AxiosRequestConfig {
        const urlSlug: string = parameters.id ? `${endpoint}/${parameters.id}` : `${endpoint}`;
        return {
            url: `${this.baseUrl}/${urlSlug}`,
            method: requestMethod,
            data: parameters.payload,
            headers: parameters.headers
        }
    }

    /**
     * This function is responsible for executing a request based on the provided configuration.
     * @param configuration - The request configuration needed from axios.
     * @returns The result from the request as an {@link AxiosResponse}.
     */
    public async sendRequest(configuration: AxiosRequestConfig): Promise<AxiosResponse<any, any> | AxiosResponse<unknown, any>> {
        return await allure.step(`Sending ${configuration.method} request to: ${configuration.url}`, async (s)=> {
            if(configuration.data) {
                s.parameter('Request Body', JSON.stringify(configuration.data));
            }
            let response: AxiosResponse<any, any> | AxiosResponse<unknown, any>;
            try {
                response = await axios.request(configuration);
            } catch (error) {
                response = (error as AxiosError).response!
            } 
            s.parameter('Response Data', JSON.stringify(response.data));
            s.parameter('Response Status', JSON.stringify(response.status));
            return response;
        });
    }
}
