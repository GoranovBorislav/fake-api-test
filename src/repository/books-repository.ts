import { faker } from '@faker-js/faker';
import { Book } from '../api/models/data-response-model';
import { JsonFileReader } from '../utils/json-file-reader';

export class BooksRepository {

    private static readonly BOOKS_PATH: string = 'resources/books/';
    private readonly fileReader = new JsonFileReader();

    public loadBooks(): Book[] {
        return this.fileReader.readFilesFromDirectory<Book[]>(BooksRepository.BOOKS_PATH);
    }

    public generateBookPayload(customFields: Object = {}) {
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