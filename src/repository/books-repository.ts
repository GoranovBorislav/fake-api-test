import { faker } from '@faker-js/faker';
import { Book } from '../api/models/data-response-model';
import { JsonFileReader } from '../utils/json-file-reader';

export class BooksRepository {

    private static readonly BOOKS_PATH: string = 'resources/books/';
    private readonly fileReader = new JsonFileReader();

    /**
     * This function loads all books provided in directory resources/books/
     * @returns List of {@link Book}.
     */
    public loadBooks(): Book[] {
        return this.fileReader.readFilesFromDirectory<Book>(BooksRepository.BOOKS_PATH);
    }

    /**
     * Generates Book payload object.
     * @example
     * When used without customFields, Faker will generate the payload:
     * ```ts
     * generateBookPayload();
     * ```
     * @example 
     * When provided with customFields, Faker will generate the payload and the custom fields will
     * overwrite the ones that are dublicated or add the ones that are missing:
     * ```ts
     * generateBookPayload({ id: 22 });
     * ```
     * @param customFields - Custom Fields used for overwriting the generation. Defaults to an empty object.
     * @returns Payload Object
     */
    public generateBookPayload(customFields: Object = {}): Object {
        const payload = {
            title: faker.book.title(),
            description: faker.string.alpha(50),
            pageCount: faker.number.int({min: 1, max: 1000}),
            excerpt: faker.string.alpha(100),
            publishDate: faker.date.past({years: 2}).toISOString()
        };
        return Object.assign({}, customFields, {...payload, ...customFields});
    }
}