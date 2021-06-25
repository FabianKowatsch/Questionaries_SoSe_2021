import { readFileSync } from "fs";
import { writeFileSync } from "fs";
import { resolve } from "path";

export class FileHandler {
  private static _instance: FileHandler = new FileHandler();

  private constructor() {}
  public static getInstance(): FileHandler {
    return FileHandler._instance || (this._instance = new this());
  }
  public readArrayFile(pathToFile: string): Array<any> {
    return this.readFile(pathToFile);
  }

  public readObjectFile(pathToFile: string): any {
    return this.readFile(pathToFile);
  }

  public writeFile(pathToFile: string, dataToWrite: any): void {
    writeFileSync(resolve(__dirname, "../" + pathToFile), JSON.stringify(dataToWrite));
  }

  private readFile(pathToFile: string): any {
    let jsonRaw: Buffer = readFileSync(resolve(__dirname, "../" + pathToFile));
    let json: any = JSON.parse(jsonRaw.toString());
    return json;
  }
}
