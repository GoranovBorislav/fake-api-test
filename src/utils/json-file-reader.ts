import * as fs from 'fs';
import path from 'path';

const encoding: BufferEncoding = 'utf-8'
export class JsonFileReader {

    public readFilesFromDirectory<T>(directory: string): T {
        const files = fs.readdirSync(directory);
        let consumedData: any[] = [];
        files.forEach((file) => {
            consumedData = [...consumedData, ...this.readFile(path.join(directory, file))];
        })
        return consumedData as T;
    }

    public readFile(filePath: string): any {
        return JSON.parse(fs.readFileSync(filePath, encoding));
    }
}