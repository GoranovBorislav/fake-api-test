import { faker } from '@faker-js/faker';
import { Author } from '../api/models/data-response-model';
import { JsonFileReader } from '../utils/json-file-reader';

export class AuthorsRepository {

    private static readonly AUTHORS_PATH: string = 'resources/authors/';
    private readonly fileReader = new JsonFileReader();

    public loadAuthors(): Author[] {
        return this.fileReader.readFilesFromDirectory<Author[]>(AuthorsRepository.AUTHORS_PATH);
    }

    public generateAuthorPayload(customFields: Object = {}): Object {
        const payload = {
            idBook: faker.number.int({min: 1, max: 1000}),
            firstName: faker.person.firstName(),
            lastName: faker.person.lastName()
        };
        return Object.assign({}, customFields, {...payload, ...customFields});
    }
}