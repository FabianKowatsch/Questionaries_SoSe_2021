"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const AbstractUser_1 = require("./abstracts/AbstractUser");
const App_1 = require("./App");
const Dao_1 = require("./Dao");
const RegisteredUser_1 = require("./RegisteredUser");
const sha256_1 = __importDefault(require("crypto-js/sha256"));
const ConsoleHandler_1 = require("./ConsoleHandler");
class User extends AbstractUser_1.AbstractUser {
    static _instance;
    completedSurveys;
    constructor() {
        super();
        this.completedSurveys = new Array();
    }
    static getInstance() {
        return User._instance || (this._instance = new this());
    }
    async showPopularSurveys() {
        let choices = this.createChoicesWithRestrictions(true);
        let answer = await ConsoleHandler_1.ConsoleHandler.select("Select the survey you want to participate in: ", choices);
        switch (answer) {
            case undefined:
                await App_1.App.getInstance().goNext();
                break;
            default:
                await this.startSurvey(answer);
                break;
        }
    }
    async searchSurvey() {
        let choices = this.createChoicesWithRestrictions(false);
        let answer = await ConsoleHandler_1.ConsoleHandler.autocomplete("Type the name of the survey you want to participate in: ", choices);
        switch (answer) {
            case "disabled":
                await this.searchSurvey();
                break;
            case undefined:
                console.log("no matches, try again");
                await this.searchSurvey();
                break;
            default:
                await this.startSurvey(answer);
                break;
        }
    }
    async watchGlobalStats() {
        let completedSurveyCounter = this.completedSurveys.length;
        if (completedSurveyCounter === 0) {
            console.log("You didnt complete any surveys yet.");
        }
        else {
            console.log(`You completed ${completedSurveyCounter} surveys so far:`);
            this.completedSurveys.forEach((id) => {
                let name = Dao_1.Dao.getInstance().getSurvey(id).title;
                console.log(name);
            });
        }
    }
    async login() {
        let userArray = Dao_1.Dao.getInstance().getAllUsers();
        let username = await ConsoleHandler_1.ConsoleHandler.text("Enter your username (alphanumerical, 4-15 characters): ");
        let password = await ConsoleHandler_1.ConsoleHandler.password("Enter your password (minimum of 4 characters): ");
        let pwd = sha256_1.default(password);
        password = pwd.toString();
        if (this.isMatchingUser(username, userArray, password)) {
            let registeredUser = new RegisteredUser_1.RegisteredUser(username, password, false);
            App_1.App.user = registeredUser;
            console.log("You successfully logged in! ");
        }
        else {
            console.log("Wrong username or password");
            await this.login();
        }
    }
    async register() {
        let userArray = Dao_1.Dao.getInstance().getAllUsers();
        let username = await await ConsoleHandler_1.ConsoleHandler.text("Enter your username (alphanumerical, 4-15 characters): ");
        while (!this.isValidUsername(username) || this.isMatchingUser(username, userArray)) {
            if (!this.isValidUsername(username))
                console.log("Your username must be alphanumerical and contain between 4 and 15 characters");
            else
                console.log("Your username already exists");
            username = await await ConsoleHandler_1.ConsoleHandler.text("Enter your username (alphanumerical, 4-15 characters): ");
        }
        let password = await ConsoleHandler_1.ConsoleHandler.password("Enter your password (minimum of 4 characters): ");
        while (!this.isValidPassword(password)) {
            console.log("Your password must contain at least 4 characters");
            password = await ConsoleHandler_1.ConsoleHandler.password("Enter your password (minimum of 4 characters): ");
        }
        let pwd = sha256_1.default(password);
        password = pwd.toString();
        let registeredUser = new RegisteredUser_1.RegisteredUser(username, password, true);
        App_1.App.user = registeredUser;
        Dao_1.Dao.getInstance().addUser(registeredUser);
        console.log("You have successfully registered! ");
    }
    async startSurvey(_uuid) {
        let survey = Dao_1.Dao.getInstance().getSurvey(_uuid);
        let answers = await this.answerQuestions(survey);
        let statistic = Dao_1.Dao.getInstance().getStatistic(_uuid);
        this.updateStatistics(answers, statistic);
    }
    async answerQuestions(_survey) {
        console.log("You are now answering: " + _survey.title);
        let answersForStatistic = new Array();
        for (let question of _survey.questions) {
            let choices = this.toPromptChoices(question);
            let answer = await ConsoleHandler_1.ConsoleHandler.select(question.title, choices);
            answersForStatistic.push(answer);
        }
        return answersForStatistic;
    }
    toPromptChoices(_question) {
        let choices = new Array();
        _question.answers.forEach((answer) => {
            choices.push({ title: answer });
        });
        return choices;
    }
    updateStatistics(_answers, _statistic) {
        for (let index = 0; index < _statistic.answers.length; index++) {
            let chosenAnswerIndex = parseInt(_answers[index]);
            _statistic.answers[index][chosenAnswerIndex] = _statistic.answers[index][chosenAnswerIndex]++;
        }
        _statistic.completedCounter++;
        this.completedSurveys.push(_statistic.uuid);
        Dao_1.Dao.getInstance().updateStatistic(_statistic);
    }
    isValidUsername(_username) {
        let alphanumeric = /^[a-z0-9]{4,15}$/i;
        return alphanumeric.test(_username);
    }
    isValidPassword(_password) {
        let regex = /^.{4,}$/;
        return regex.test(_password);
    }
    isMatchingUser(_username, _userArray, password) {
        for (let user of _userArray) {
            if (password) {
                if (user.username == _username && user.password == password)
                    return true;
            }
            else {
                if (user.username == _username)
                    return true;
            }
        }
        return false;
    }
    createChoicesWithRestrictions(_popularOnly) {
        let flagRed = "\x1b[31m";
        let choices = new Array();
        let surveyArray;
        if (_popularOnly) {
            surveyArray = Dao_1.Dao.getInstance().getMostPopularSurveys();
        }
        else {
            surveyArray = Dao_1.Dao.getInstance().getAllSurveys();
        }
        surveyArray.forEach((survey) => {
            let dateStart = new Date(survey.timeSpan.start);
            let dateEnd = new Date(survey.timeSpan.end);
            if (dateStart.getTime() > Date.now()) {
                choices.push({
                    title: flagRed + survey.title + (_popularOnly ? ` (locked, starting date: ${survey.timeSpan.start})` : ""),
                    value: "disabled",
                    disabled: true,
                    description: `locked, starting date: ${survey.timeSpan.start}`
                });
            }
            else if (dateEnd.getTime() <= Date.now()) {
                choices.push({
                    title: flagRed + survey.title + (_popularOnly ? ` (locked, terminating date: ${survey.timeSpan.end})` : ""),
                    value: "disabled",
                    disabled: true,
                    description: `locked, terminating date: ${survey.timeSpan.end}`
                });
            }
            else {
                choices.push({ title: survey.title, value: survey.uuid });
            }
        });
        return choices;
    }
}
exports.User = User;
//# sourceMappingURL=User.js.map