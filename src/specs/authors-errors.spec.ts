import { AxiosResponse, HttpStatusCode } from 'axios';
import { expect } from 'chai';
import { describe, it } from 'mocha';
import { BaseApi } from '../api/base-api';
import { ErrorResponse } from "../api/models/error-response-model";
import { Endpoint, Method } from '../constants/api-const';
import { ErrorKey, ErrorMessage } from '../constants/errors-const';
import { AuthorsRepository } from '../repository/authors-repository';

const errorMessagesTests = [
    { method: Method.GET, titleSlug: 'Id', parameter: 'asd', expected: { key: ErrorKey.ROUTE_ID, regex: ErrorMessage.VALUE_NOT_VALID }},
    { method: Method.DELETE, titleSlug: 'Id', parameter: 'asd', expected: { key: ErrorKey.ROUTE_ID, regex: ErrorMessage.VALUE_NOT_VALID }},
    { method: Method.PUT, titleSlug: 'Id', parameter: 'asd', expected: { key: ErrorKey.ROUTE_ID, regex: ErrorMessage.VALUE_NOT_VALID }},
    { method: Method.PUT, titleSlug: 'body Id', parameter: 5, customFields: { id: "asd" }, expected: { key: ErrorKey.BODY_ID, regex: ErrorMessage.CAN_NOT_CONVERT_TO_INT }},
    { method: Method.PUT, titleSlug: 'idBook', parameter: 5, customFields: { idBook: 'asd' },  expected: { key: ErrorKey.BOOK_ID, regex: ErrorMessage.CAN_NOT_CONVERT_TO_INT }},
    { method: Method.PUT, titleSlug: 'firstName', parameter: 5, customFields: { firstName: 456 }, expected: { key: ErrorKey.FIRST_NAME, regex: ErrorMessage.CAN_NOT_CONVERT_TO_STRING }},
    { method: Method.PUT, titleSlug: 'lastName', parameter: 5, customFields: { lastName: 22 }, expected: { key: ErrorKey.LAST_NAME, regex: ErrorMessage.CAN_NOT_CONVERT_TO_STRING}},
    { method: Method.POST, titleSlug: 'Id', customFields: { id: "asd" }, expected: { key: ErrorKey.BODY_ID, regex: ErrorMessage.CAN_NOT_CONVERT_TO_INT }},
    { method: Method.POST, titleSlug: 'idBook', customFields: { idBook: 'asd' },  expected: { key: ErrorKey.BOOK_ID, regex: ErrorMessage.CAN_NOT_CONVERT_TO_INT }},
    { method: Method.POST, titleSlug: 'firstName', customFields: { firstName: 456 }, expected: { key: ErrorKey.FIRST_NAME, regex: ErrorMessage.CAN_NOT_CONVERT_TO_STRING }},
    { method: Method.POST, titleSlug: 'lastName', customFields: { lastName: 22 }, expected: { key: ErrorKey.LAST_NAME, regex: ErrorMessage.CAN_NOT_CONVERT_TO_STRING}}
];

const api = new BaseApi();
const endpoint = Endpoint.AUTHORS;
const repository = new AuthorsRepository();

errorMessagesTests.forEach((test) => {
    describe(`Endpoint /${endpoint}: Error messages validation`, () => {
        
        describe(`${test.method} ${endpoint} using invalid ${test.titleSlug}`, () => {
            let response: AxiosResponse<any, any> | AxiosResponse<unknown, any>;
    
            before(async () => {
                const payload = test.method === Method.PUT || test.method === Method.POST ? repository.generateAuthorPayload(test.customFields) : {};
                const configuration = api.buildRequestConfiguration(test.method, endpoint, { id: test.parameter, payload: payload });
                response = await api.sendRequest(configuration);
            });
    
            it(`has 400 response code`, () => {
                expect(response.status).to.equal(HttpStatusCode.BadRequest);
            });
    
            it(`matches error message regex: ${test.expected.regex}`, () => {
                expect((response.data as ErrorResponse).errors![test.expected.key][0]).to.match(test.expected.regex);
            });
        });
        
    });
});
