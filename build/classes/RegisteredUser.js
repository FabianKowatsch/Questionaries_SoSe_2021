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
        let title = await this.enterText("Enter the title of the survey: ");
        let start = await this.enterText("Enter the starting date of the survey ( format: dd.mm.yyyy): ");
        let end = await this.enterText("Enter the termination date of the survey ( format: dd.mm.yyyy): ");
        while (!this.validateDates(start, end)) {
            console.log("Make sure your dates follow the format dd.mm.yyyy and are in correct order");
            start = await this.enterText("Enter the starting date of the survey ( format: dd.mm.yyyy): ");
            end = await this.enterText("Enter the termination date of the survey ( format: dd.mm.yyyy): ");
        }
        let survey = new Survey_1.Survey(title, this.toDate(start), this.toDate(end), this.username);
        await survey.addQuestion();
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
    validateDates(dateString1, dateString2) {
        let regex = /^\s*(3[01]|[12][0-9]|0?[1-9])\.(1[012]|0?[1-9])\.((?:19|20)\d{2})\s*$/g;
        if (regex.test(dateString1) && regex.test(dateString2)) {
            console.log("wrong format");
            return false;
        }
        else {
            if (this.toDate(dateString1) < this.toDate(dateString2))
                return true;
            console.log("wrong order");
            return false;
        }
    }
    toDate(_string) {
        let array = _string.split(".");
        let date = new Date();
        date.setFullYear(parseInt(array[2]), parseInt(array[1]) - 1, parseInt(array[0]));
        return date;
    }
    async enterText(_message) {
        let username = await prompts_1.default({
            type: "text",
            name: "value",
            message: _message
        });
        return username.value;
    }
}
exports.RegisteredUser = RegisteredUser;
//# sourceMappingURL=RegisteredUser.js.map