"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisteredUser = void 0;
const AbstractUser_1 = require("./abstracts/AbstractUser");
const ConsoleHandler_1 = require("./ConsoleHandler");
const Survey_1 = require("./Survey");
class RegisteredUser extends AbstractUser_1.AbstractUser {
    username;
    password;
    constructor(_username, _password) {
        super();
        this.username = _username;
        this.password = _password;
    }
    async createSurvey() {
        let title = await ConsoleHandler_1.ConsoleHandler.text("Enter a question you want to add: ");
        let survey = new Survey_1.Survey(title, this.username);
        await survey.setTimeSpan();
        await survey.addQuestion();
    }
    showPopularSurveys() {
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