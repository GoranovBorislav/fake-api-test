import { AxiosResponse, HttpStatusCode } from 'axios';
import { expect } from 'chai';
import { describe, it } from 'mocha';
import { BaseApi } from '../api/base-api';
import { ErrorResponse } from "../api/models/error-response-model";
import { Endpoint, Method } from '../constants/api-const';
import { ErrorKey, ErrorMessage } from '../constants/errors-const';
import { BooksRepository } from '../repository/books-repository';

const errorMessagesTests = [
    { method: Method.GET, titleSlug: 'Id', parameter: 'asd', expected: { key: ErrorKey.ROUTE_ID, regex: ErrorMessage.VALUE_NOT_VALID }},
    { method: Method.DELETE, titleSlug: 'Id', parameter: 'asd', expected: { key: ErrorKey.ROUTE_ID, regex: ErrorMessage.VALUE_NOT_VALID }},
    { method: Method.PUT, titleSlug: 'Id', parameter: 'asd', expected: { key: ErrorKey.ROUTE_ID, regex: ErrorMessage.VALUE_NOT_VALID}},
    { method: Method.PUT, titleSlug: 'body Id', parameter: 3, customFields: { id: "asd" }, expected: { key: ErrorKey.BODY_ID, regex: ErrorMessage.CAN_NOT_CONVERT_TO_INT}},
    { method: Method.PUT, titleSlug: 'tytle', parameter: 3, customFields: { title: 123 }, expected: { key: ErrorKey.TITLE, regex: ErrorMessage.CAN_NOT_CONVERT_TO_STRING }},
    { method: Method.PUT, titleSlug: 'description', parameter: 3, customFields: { description: 456 }, expected: { key: ErrorKey.DESCRIPTION, regex: ErrorMessage.CAN_NOT_CONVERT_TO_STRING }},
    { method: Method.PUT, titleSlug: 'pageCount', parameter: 3, customFields: { pageCount: "d" }, expected: { key: ErrorKey.PAGE_COUNT, regex: ErrorMessage.CAN_NOT_CONVERT_TO_INT}},
    { method: Method.PUT, titleSlug: 'excerpt', parameter: 3, customFields: { excerpt: 1 }, expected: { key: ErrorKey.EXCERPT, regex: ErrorMessage.CAN_NOT_CONVERT_TO_STRING }},
    { method: Method.PUT, titleSlug: 'date', parameter: 3, customFields: { publishDate: 1 }, expected: { key: ErrorKey.PUBLISH_DATE, regex: ErrorMessage.CAN_NOT_CONVERT_TO_DATE }},
    { method: Method.POST, titleSlug: 'Id', customFields: { id: "asd" }, expected: { key: ErrorKey.BODY_ID, regex: ErrorMessage.CAN_NOT_CONVERT_TO_INT }},
    { method: Method.POST, titleSlug: 'tytle', customFields: { title: 123 }, expected: { key: ErrorKey.TITLE, regex: ErrorMessage.CAN_NOT_CONVERT_TO_STRING }},
    { method: Method.POST, titleSlug: 'description', customFields: { description: 456 }, expected: { key: ErrorKey.DESCRIPTION, regex: ErrorMessage.CAN_NOT_CONVERT_TO_STRING }},
    { method: Method.POST, titleSlug: 'pageCount', customFields: { pageCount: "d" }, expected: { key: ErrorKey.PAGE_COUNT, regex: ErrorMessage.CAN_NOT_CONVERT_TO_INT}},
    { method: Method.POST, titleSlug: 'excerpt', customFields: { excerpt: 1 }, expected: { key: ErrorKey.EXCERPT, regex: ErrorMessage.CAN_NOT_CONVERT_TO_STRING }},
    { method: Method.POST, titleSlug: 'date', customFields: { publishDate: 1 }, expected: { key: ErrorKey.PUBLISH_DATE, regex: ErrorMessage.CAN_NOT_CONVERT_TO_DATE }}
];

const api = new BaseApi();
const endpoint = Endpoint.BOOKS;
const repository = new BooksRepository();

errorMessagesTests.forEach((test) => {
    describe(`Endpoint /${endpoint}: Error messages validation`, () => {
        
        describe(`${test.method} ${endpoint} using invalid ${test.titleSlug}`, () => {
            let response: AxiosResponse<any, any> | AxiosResponse<unknown, any>;
    
            before(async () => {
                const payload = test.method === Method.PUT || test.method === Method.POST ? repository.generateBookPayload(test.customFields) : {};
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
