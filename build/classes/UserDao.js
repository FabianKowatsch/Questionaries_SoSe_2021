"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserDao = void 0;
const FileHandler_1 = require("./FileHandler");
class UserDao {
    static _instance;
    constructor() { }
    static getInstance() {
        return UserDao._instance || (this._instance = new this());
    }
    getAll() {
        return FileHandler_1.FileHandler.getInstance().readArrayFile("../data/users.json");
    }
    add(_user) {
        let userArray = this.getAll();
        userArray.push(_user);
        FileHandler_1.FileHandler.getInstance().writeFile("../data/users.json", userArray);
    }
    get(_username) {
        let userArray = this.getAll();
        for (let user of userArray) {
            if (user.username == _username)
                return user;
        }
        return userArray[0];
    }
    update(_user) {
        let userArray = this.getAll();
        userArray.forEach((user) => {
            if (user.username === _user.username) {
                user.completedSurveys = _user.completedSurveys;
                user.createdSurveys = _user.createdSurveys;
            }
        });
        FileHandler_1.FileHandler.getInstance().writeFile("../data/users.json", userArray);
    }
}
exports.UserDao = UserDao;
//# sourceMappingURL=UserDao.js.map