import * as fs from 'fs';
import path from 'path';

const encoding: BufferEncoding = 'utf-8'
export class JsonFileReader {

    /**
     * This function is reading all .json files in the provided directory.
     * @param directory - The directory path.
     * @returns List of objects with the desired type.
     */
    public readFilesFromDirectory<T>(directory: string): T[] {
        const files = fs.readdirSync(directory);
        let consumedData: any[] = [];
        files.forEach((file) => {
            consumedData = [...consumedData, ...this.readFile(path.join(directory, file))];
        })
        return consumedData as T[];
    }

    /**
     * This function reads a JSON file and parses it to an object
     * @param filePath - Path to the desired .json file. 
     * @returns An object
     */
    public readFile(filePath: string): any {
        return JSON.parse(fs.readFileSync(filePath, encoding));
    }
}