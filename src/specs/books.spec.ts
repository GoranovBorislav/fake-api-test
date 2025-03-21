import { AxiosResponse, HttpStatusCode } from 'axios';
import { expect } from 'chai';
import { describe, it } from 'mocha';
import { BaseApi } from '../api/base-api';
import { Book } from '../api/models/data-response-model';
import { Endpoint, Method } from '../constants/api-const';
import { BooksRepository } from '../repository/books-repository';

const api = new BaseApi();
const endpoint = Endpoint.BOOKS;
const repository = new BooksRepository();
const existingBook = repository.loadBooks()[0];

describe(`Endpoint /${endpoint}`, () => {
    
    describe(`${Method.GET} all ${endpoint}`, () => {
        let response: AxiosResponse<any, any> | AxiosResponse<unknown, any>;
    
        before(async () => {
            const configuration = api.buildRequestConfiguration(Method.GET, endpoint);
            response = await api.sendRequest(configuration);
        });
    
        it('has 200 response code', () => {
            expect(response.status).to.equal(HttpStatusCode.Ok);
        });
    
        it('has response data', () => {
            expect(response.data).to.not.be.empty;
        });
    
        it('has response data as an array', () => {
            expect(response.data).to.be.an('array');
        });
    
    });

    describe(`${Method.GET} ${endpoint} by Id: ${existingBook.id}`, () => {
        let response: AxiosResponse<any, any> | AxiosResponse<unknown, any>;
        
        before(async () => {
            const configuration = api.buildRequestConfiguration(Method.GET, endpoint, {id: existingBook.id});
            response = await api.sendRequest(configuration);
        });
    
        it('has 200 response code', () => {
            expect(response.status).to.equal(HttpStatusCode.Ok);
        });
    
        it('has response data', () => {
            expect(response.data).to.exist;
        });
    
        Object.keys(existingBook).forEach( (key) => {
            it(`has the correct value for field: ${key}`, () => {
                expect(response.data[key]).to.equal(existingBook[key]);
            });
        });

    });

    describe(`${Method.GET} ${endpoint} by Id that does not exists`, () => {
        let response: AxiosResponse<any, any> | AxiosResponse<unknown, any>;
    
        before(async () => {
            const configuration = api.buildRequestConfiguration(Method.GET, endpoint, { id: -12 });
            response = await api.sendRequest(configuration);
        });
    
        it(`has 404 response code`, () => {
            expect(response.status).to.equal(HttpStatusCode.NotFound);
        });
    });

    const deleteBooksTests = [
        { parameter: 11, expectedCode: HttpStatusCode.Ok, checkRepository: true },
        { parameter: -22, expectedCode: HttpStatusCode.NotFound, checkRepository: false }
    ];
    deleteBooksTests.forEach((test) => {
        describe(`${Method.DELETE} ${endpoint} by Id: ${test.parameter}`, () => {
            let response: AxiosResponse<any, any> | AxiosResponse<unknown, any>;
        
            before(async () => {
                const configuration = api.buildRequestConfiguration(Method.DELETE, endpoint, { id: test.parameter });
                response = await api.sendRequest(configuration);
            })
    
            it(`has ${test.expectedCode} response code`, async () => {
                expect(response.status).to.equal(test.expectedCode);
            });
        
            if (test.checkRepository) {
                it('has updated the repository', async () => {
                    const configuration = api.buildRequestConfiguration(Method.GET, endpoint, { id: test.parameter });
                    response = await api.sendRequest(configuration);
                    expect(response.status).to.equal(test.expectedCode);
                });
            }
        });
    });

    const putBooksTests = [
        { titleSlug: '', parameter: 11, expectedCode: HttpStatusCode.Ok, payload: true },
        { titleSlug: '', parameter: -22, expectedCode: HttpStatusCode.NotFound, payload: true },
        { titleSlug: 'with undefined payload', parameter: 20, expectedCode: HttpStatusCode.UnsupportedMediaType, payload: false }
    ];
    putBooksTests.forEach((test) => {
        describe(`${Method.PUT} ${endpoint} by Id: ${test.parameter} ${test.titleSlug}`, () => {
            let response: AxiosResponse<any, any> | AxiosResponse<unknown, any>;
            const payload = test.payload ? repository.generateBookPayload() : undefined;
            
            before(async () => {
                const configuration = api.buildRequestConfiguration(Method.PUT, endpoint, { id: test.parameter, payload: payload });
                response = await api.sendRequest(configuration);
            })
                
            it(`has ${test.expectedCode} response code`, async () => {
                expect(response.status).to.equal(test.expectedCode);
            });
    
            if (test.expectedCode === HttpStatusCode.Ok) {
                it('has response data containing the changes', () => {
                    expect(response.data).to.contain(payload);
                });
        
                it(`has response data with id: ${test.parameter}`, () => {
                    expect(response.data.id).to.equal(test.parameter);
                });
        
                it('has updated the repository', async () => {
                    const configuration = api.buildRequestConfiguration(Method.GET, endpoint, { id: test.parameter });
                    response = await api.sendRequest(configuration);
                    expect(response.status).to.equal(HttpStatusCode.Ok);
                    expect(response.data).to.contain(payload);
                });
            }
        });
    });

    describe(`${Method.POST} ${endpoint}`, () => {
        let response: AxiosResponse<any, any> | AxiosResponse<unknown, any>;
        const payload = repository.generateBookPayload();
        
        before(async () => {
            const configuration = api.buildRequestConfiguration(Method.POST, endpoint, {payload: payload});
            response = await api.sendRequest(configuration);
        })
            
        it('has 200 response code', async () => {
            expect(response.status).to.equal(HttpStatusCode.Ok);
        });

        it(`has response data with id`, () => {
            expect(response.data.id).to.exist;
        });

        it('has response data containing the payload', () => {
            expect(response.data).to.contain(payload);
        });

        it('has updated the repository', async () => {
            const configuration = api.buildRequestConfiguration(Method.GET, endpoint, { id: (response.data as Book).id });
            response = await api.sendRequest(configuration);
            expect(response.status).to.equal(HttpStatusCode.Ok);
            expect(response.data).to.contain(payload);
        });

    });
    
    describe(`${Method.POST} ${endpoint} with dublicated Id and Title`, () => {
        let response: AxiosResponse<any, any> | AxiosResponse<unknown, any>;

        before(async () => {
            const configuration = api.buildRequestConfiguration(Method.POST, endpoint, { payload: existingBook });
            response = await api.sendRequest(configuration);
        });

        it(`has 400 response code`, () => {
            expect(response.status).to.equal(HttpStatusCode.BadRequest);
        });

    });
    
    describe(`${Method.POST} ${endpoint} with undefined payload`, () => {   
        let response: AxiosResponse<any, any> | AxiosResponse<unknown, any>;

        before(async () => {
            const configuration = api.buildRequestConfiguration(Method.POST, endpoint);
            response = await api.sendRequest(configuration);
        });

        it(`has 415 response code`, () => {
            expect(response.status).to.equal(HttpStatusCode.UnsupportedMediaType);
        });

    });

});


