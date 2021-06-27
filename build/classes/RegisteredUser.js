"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisteredUser = void 0;
const prompts_1 = __importDefault(require("prompts"));
const AbstractUser_1 = require("./abstracts/AbstractUser");
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
        let title = await prompts_1.default({
            type: "text",
            name: "value",
            message: "Enter the title of your survey: "
        });
        let survey = new Survey_1.Survey(title.value, this.username);
        await survey.addTimeSpan();
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