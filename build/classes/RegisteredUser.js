"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisteredUser = void 0;
const AbstractUser_1 = require("./abstracts/AbstractUser");
const ConsoleHandler_1 = require("./ConsoleHandler");
const Dao_1 = require("./Dao");
const Survey_1 = require("./Survey");
class RegisteredUser extends AbstractUser_1.AbstractUser {
    username;
    password;
    createdSurveys;
    completedSurveys;
    constructor(_username, _password, _new) {
        super();
        this.username = _username;
        this.password = _password;
        if (_new) {
            this.completedSurveys = new Array();
            this.createdSurveys = new Array();
        }
        else {
            let existingUser = Dao_1.Dao.getInstance().getUser(this.username);
            this.completedSurveys = existingUser.completedSurveys;
            this.createdSurveys = existingUser.createdSurveys;
        }
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