"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileHandler = void 0;
const fs_1 = require("fs");
const fs_2 = require("fs");
const path_1 = require("path");
class FileHandler {
    static _instance = new FileHandler();
    constructor() { }
    static getInstance() {
        return FileHandler._instance || (this._instance = new this());
    }
    readArrayFile(pathToFile) {
        return this.readFile(pathToFile);
    }
    readObjectFile(pathToFile) {
        return this.readFile(pathToFile);
    }
    writeFile(pathToFile, dataToWrite) {
        fs_2.writeFileSync(path_1.resolve(__dirname, "../" + pathToFile), JSON.stringify(dataToWrite));
    }
    readFile(pathToFile) {
        let jsonRaw = fs_1.readFileSync(path_1.resolve(__dirname, "../" + pathToFile));
        let json = JSON.parse(jsonRaw.toString());
        return json;
    }
}
exports.FileHandler = FileHandler;
//# sourceMappingURL=FileHandler.js.map