import { faker } from '@faker-js/faker';
import { Author } from '../api/models/data-response-model';
import { JsonFileReader } from '../utils/json-file-reader';

export class AuthorsRepository {

    private static readonly AUTHORS_PATH: string = 'resources/authors/';
    private readonly fileReader = new JsonFileReader();

    /**
     * This function loads all books provided in directory resources/books/
     * @returns List of {@link Author}.
     */
    public loadAuthors(): Author[] {
        return this.fileReader.readFilesFromDirectory<Author>(AuthorsRepository.AUTHORS_PATH);
    }

    /**
     * Generates Author payload object.
     * @example
     * When used without customFields, Faker will generate the payload:
     * ```ts
     * generateAuthorPayload();
     * ```
     * @example 
     * When provided with customFields, Faker will generate the payload and the custom fields will
     * overwrite the ones that are dublicated or add the ones that are missing:
     * ```ts
     * generateAuthorPayload({ id: 12 });
     * ```
     * @param customFields - Custom Fields used for overwriting the generation. Defaults to an empty object.
     * @returns Payload Object
     */
    public generateAuthorPayload(customFields: Object = {}): Object {
        const payload = {
            idBook: faker.number.int({min: 1, max: 1000}),
            firstName: faker.person.firstName(),
            lastName: faker.person.lastName()
        };
        return Object.assign({}, customFields, {...payload, ...customFields});
    }
}