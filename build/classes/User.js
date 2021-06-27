"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const prompts_1 = __importDefault(require("prompts"));
const AbstractUser_1 = require("./abstracts/AbstractUser");
const App_1 = require("./App");
const Dao_1 = require("./Dao");
const FileHandler_1 = require("./FileHandler");
const RegisteredUser_1 = require("./RegisteredUser");
class User extends AbstractUser_1.AbstractUser {
    static _instance;
    constructor() {
        super();
    }
    static getInstance() {
        return User._instance || (this._instance = new this());
    }
    async showPopularSurveys() {
        let choices = this.createChoicesWithRestrictions(true);
        let answer = await prompts_1.default({
            type: "select",
            name: "value",
            message: "Select the survey you want to participate in: ",
            choices: choices,
            limit: 2
        });
        switch (answer.value) {
            case undefined:
                await App_1.App.getInstance().goNext();
                break;
            default:
                await this.startSurvey(answer.value);
                break;
        }
    }
    async searchSurvey() {
        let choices = this.createChoicesWithRestrictions(false);
        let answer = await prompts_1.default({
            type: "autocomplete",
            name: "value",
            message: "Type the name of the survey you want to participate in: ",
            choices: choices,
            suggest: (input, choices) => Promise.resolve(choices.filter((survey) => survey.title.slice(0, input.length) === input))
        });
        switch (answer.value) {
            case "disabled":
                await this.searchSurvey();
                break;
            case undefined:
                console.log("no matches, try again");
                await this.searchSurvey();
                break;
            default:
                await this.startSurvey(answer.value);
                break;
        }
    }
    watchGlobalStats() {
        return;
    }
    async login() {
        let userArray = FileHandler_1.FileHandler.getInstance().readArrayFile("../data/users.json");
        let username = await this.enterUsername();
        let password = await this.enterPassword();
        if (this.isMatchingUser(username, userArray, password)) {
            let registeredUser = new RegisteredUser_1.RegisteredUser(username, password);
            App_1.App.user = registeredUser;
            console.log("You successfully logged in! ", App_1.App.user);
        }
        else {
            console.log("Wrong username or password");
            await this.login();
        }
    }
    async register() {
        let userArray = FileHandler_1.FileHandler.getInstance().readArrayFile("../data/users.json");
        let username = await this.enterUsername();
        while (!this.isValidUsername(username) || this.isMatchingUser(username, userArray)) {
            if (!this.isValidUsername(username))
                console.log("Your username must be alphanumerical and contain between 4 and 15 characters");
            else
                console.log("Your username already exists");
            username = await this.enterUsername();
        }
        let password = await this.enterPassword();
        while (!this.isValidPassword(password)) {
            console.log("Your password must contain at least 4 characters");
            password = await this.enterPassword();
        }
        let registeredUser = new RegisteredUser_1.RegisteredUser(username, password);
        App_1.App.user = registeredUser;
        userArray.push(registeredUser);
        FileHandler_1.FileHandler.getInstance().writeFile("../data/users.json", userArray);
        console.log("You have successfully registered! ", App_1.App.user);
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
            let answer = await prompts_1.default({
                type: "select",
                name: "value",
                message: question.title,
                choices: choices
            });
            answersForStatistic.push(answer.value);
        }
        return answersForStatistic;
    }
    toPromptChoices(_question) {
        let choices = new Array();
        _question.answers.forEach((answer) => {
            choices.push({ title: answer.name });
        });
        return choices;
    }
    updateStatistics(_answers, _statistic) {
        for (let index = 0; index < _statistic.questions.length; index++) {
            let chosenAnswerIndex = parseInt(_answers[index]);
            let chosenAnswer = _statistic.questions[index].answers[chosenAnswerIndex];
            chosenAnswer.count++;
        }
        if (App_1.App.user instanceof RegisteredUser_1.RegisteredUser) {
            _statistic.users.push(App_1.App.user.username);
        }
        _statistic.completedCounter++;
        Dao_1.Dao.getInstance().updateStatistic(_statistic);
    }
    async enterUsername() {
        let username = await prompts_1.default({
            type: "text",
            name: "value",
            message: "Enter your username (alphanumerical, 4-15 characters): "
        });
        return username.value;
    }
    async enterPassword() {
        let password = await prompts_1.default({
            type: "password",
            name: "value",
            message: "Enter your password (minimum of 4 characters): "
        });
        return password.value;
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
                    title: flagRed + survey.title + (_popularOnly ? ` (locked, starting date: ${survey.timeSpan.start})` : ""),
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