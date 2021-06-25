"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisteredUser = void 0;
const AbstractUser_1 = require("./abstracts/AbstractUser");
class RegisteredUser extends AbstractUser_1.AbstractUser {
    username;
    password;
    constructor(_username, _password) {
        super();
        this.username = _username;
        this.password = _password;
    }
    showLatestSurveys() {
        return;
    }
    searchSurvey() {
        return;
    }
    watchGlobalStats() {
        return;
    }
    watchSpecificStats() {
        return;
    }
}
exports.RegisteredUser = RegisteredUser;
//# sourceMappingURL=RegisteredUser.js.map