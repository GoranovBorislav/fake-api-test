import { AxiosResponse, HttpStatusCode } from 'axios';
import { expect } from 'chai';
import { describe, it } from 'mocha';
import { BaseApi } from '../api/base-api';
import { Endpoint, Method } from '../constants/api-const';
import { AuthorsRepository } from '../repository/authors-repository';

const api = new BaseApi();
const endpoint = Endpoint.AUTHORS;
const repository = new AuthorsRepository();
const existingAuthor = repository.loadAuthors()[0];

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

    describe(`${Method.GET} ${endpoint} by Id: ${existingAuthor.id}`, () => {
        let response: AxiosResponse<any, any> | AxiosResponse<unknown, any>;

        before(async () => {
            const configuration = api.buildRequestConfiguration(Method.GET, endpoint, {id: existingAuthor.id});
            response = await api.sendRequest(configuration);
        });
    
        it('has 200 response code', () => {
            expect(response.status).to.equal(HttpStatusCode.Ok);
        });
    
        it('has response data', () => {
            expect(response.data).to.exist;
        });
    
        Object.keys(existingAuthor).forEach( (key) => {
            it(`has the correct value for field: ${key}`, () => {
                expect(response.data[key]).to.equal(existingAuthor[key]);
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

    const deleteAuthorsTests = [
        { parameter: 12, expectedCode: HttpStatusCode.Ok },
        { parameter: -12, expectedCode: HttpStatusCode.NotFound },
    ];
    deleteAuthorsTests.forEach((test) => {
        describe(`${Method.DELETE} ${endpoint} by Id: ${test.parameter}`, () => {
            let response: AxiosResponse<any, any> | AxiosResponse<unknown, any>;
        
            before(async () => {
                const configuration = api.buildRequestConfiguration(Method.DELETE, endpoint, { id: test.parameter });
                response = await api.sendRequest(configuration);
            })
    
            it(`has ${test.expectedCode} response code`, () => {
                expect(response.status).to.equal(test.expectedCode);
            });
        
            if (test.expectedCode === HttpStatusCode.Ok) {
                it('has updated the repository', async () => {
                    const configuration = api.buildRequestConfiguration(Method.GET, endpoint, { id: test.parameter });
                    response = await api.sendRequest(configuration);
                    expect(response.status).to.equal(test.expectedCode);
                });
            }
        });
    });
    
    const putAuthorsTests = [
        { titleSlug: '', parameter: 14, expectedCode: HttpStatusCode.Ok, payload: repository.generateAuthorPayload() },
        { titleSlug: '', parameter: -33, expectedCode: HttpStatusCode.NotFound, payload: repository.generateAuthorPayload() },
        { titleSlug: 'with undefined payload', parameter: 5, expectedCode: HttpStatusCode.UnsupportedMediaType }
    ];
    putAuthorsTests.forEach((test) => {
        describe(`${Method.PUT} ${endpoint} by Id: ${test.parameter} ${test.titleSlug}`, () => {
            let response: AxiosResponse<any, any> | AxiosResponse<unknown, any>;
            
            before(async () => {
                const configuration = api.buildRequestConfiguration(Method.PUT, endpoint, { id: test.parameter, payload: test.payload });
                response = await api.sendRequest(configuration);
            })
                
            it(`has ${test.expectedCode} response code`, () => {
                expect(response.status).to.equal(test.expectedCode);
            });
    
            if (test.expectedCode === HttpStatusCode.Ok) {
                it('has response data containing the changes', () => {
                    expect(response.data).to.contain(test.payload);
                });
        
                it(`has response data with id: ${test.parameter}`, () => {
                    expect(response.data.id).to.equal(test.parameter);
                });
        
                it('has updated the repository', async () => {
                    const configuration = api.buildRequestConfiguration(Method.GET, endpoint, { id: test.parameter });
                    response = await api.sendRequest(configuration);
                    expect(response.status).to.equal(HttpStatusCode.Ok);
                    expect(response.data).to.contain(test.payload);
                });
            }
        });
    });

    const postAuthorsTests = [
        { titleSlug: '', expectedCode: HttpStatusCode.Ok, payload: repository.generateAuthorPayload() },
        { titleSlug: 'with duplicated Id', expectedCode: HttpStatusCode.NotFound, payload: repository.generateAuthorPayload( { id: existingAuthor.id }) },
        { titleSlug: 'with undefined payload', expectedCode: HttpStatusCode.UnsupportedMediaType }
    ];
    postAuthorsTests.forEach((test) => {
        describe(`${Method.POST} ${endpoint} ${test.titleSlug}`, () => {
            let response: AxiosResponse<any, any> | AxiosResponse<unknown, any>;
            
            before(async () => {
                const configuration = api.buildRequestConfiguration(Method.POST, endpoint, {payload: test.payload});
                response = await api.sendRequest(configuration);
            })
                
            it(`has ${test.expectedCode} response code`, () => {
                expect(response.status).to.equal(test.expectedCode);
            });
            
            if (test.expectedCode === HttpStatusCode.Ok) {
                it(`has response data with valid id`, () => {
                    expect(response.data.id).to.be.above(0);
                });
        
                it('has response data containing the payload', () => {
                    expect(response.data).to.contain(test.payload);
                });
        
                it('has updated the repository', async () => {
                    const configuration = api.buildRequestConfiguration(Method.GET, endpoint, { id: response.data.id });
                    response = await api.sendRequest(configuration);
                    expect(response.status).to.equal(HttpStatusCode.Ok);
                    expect(response.data).to.contain(test.payload);
                });
            }
        });
    });
});
