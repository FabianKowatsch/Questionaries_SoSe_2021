"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const AbstractUser_1 = require("./abstracts/AbstractUser");
const App_1 = require("./App");
const UserDao_1 = require("./UserDao");
const SurveyDao_1 = require("./SurveyDao");
const StatisticDao_1 = require("./StatisticDao");
const RegisteredUser_1 = require("./RegisteredUser");
const sha256_1 = __importDefault(require("crypto-js/sha256"));
const PromptHandler_1 = require("./PromptHandler");
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
        let choices = PromptHandler_1.PromptHandler.createDisabledChoicesUser(true, this);
        let answer = await PromptHandler_1.PromptHandler.select("Select the survey you want to participate in: ", choices);
        switch (answer) {
            case "return":
            case undefined:
            case "null":
                return;
                break;
            default:
                await this.startSurvey(answer);
                break;
        }
    }
    async searchSurvey() {
        let choices = PromptHandler_1.PromptHandler.createDisabledChoicesUser(false, this);
        let answer = await PromptHandler_1.PromptHandler.autocomplete("Type the name of the survey you want to participate in: ", choices);
        switch (answer) {
            case "disabled":
            case "null":
                console.log("the answer you chose is not available.");
                await this.continueSearching();
                break;
            case undefined:
                console.log("no matches, try again.");
                await this.continueSearching();
                break;
            default:
                await this.startSurvey(answer);
                break;
        }
    }
    async watchPersonalStats() {
        let completedSurveyCounter = this.completedSurveys.length;
        if (completedSurveyCounter === 0) {
            let colorYellow = "\x1b[33m";
            console.log(colorYellow + "You didnt complete any surveys yet.");
        }
        else {
            console.log(`You completed ${completedSurveyCounter} surveys in this session:`);
            this.completedSurveys.forEach((id) => {
                let name = SurveyDao_1.SurveyDao.getInstance().get(id).title;
                console.log(name);
            });
        }
    }
    async login() {
        let userArray = UserDao_1.UserDao.getInstance().getAll();
        let username = await PromptHandler_1.PromptHandler.text("Enter your username (alphanumerical, 4-15 characters): ");
        let password = await PromptHandler_1.PromptHandler.password("Enter your password (minimum of 4 characters): ");
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
        let userArray = UserDao_1.UserDao.getInstance().getAll();
        let username = await await PromptHandler_1.PromptHandler.text("Enter your username (alphanumerical, 4-15 characters): ");
        while (!this.isValidUsername(username) || this.isMatchingUser(username, userArray)) {
            if (!this.isValidUsername(username))
                console.log("Your username must be alphanumerical and contain between 4 and 15 characters");
            else
                console.log("Your username already exists");
            username = await await PromptHandler_1.PromptHandler.text("Enter your username (alphanumerical, 4-15 characters): ");
        }
        let password = await PromptHandler_1.PromptHandler.password("Enter your password (minimum of 4 characters): ");
        while (!this.isValidPassword(password)) {
            console.log("Your password must contain at least 4 characters");
            password = await PromptHandler_1.PromptHandler.password("Enter your password (minimum of 4 characters): ");
        }
        let pwd = sha256_1.default(password);
        password = pwd.toString();
        let registeredUser = new RegisteredUser_1.RegisteredUser(username, password, true);
        App_1.App.user = registeredUser;
        UserDao_1.UserDao.getInstance().add(registeredUser);
        console.log("You have successfully registered! ");
    }
    isValidUsername(_username) {
        let alphanumeric = /^[a-z0-9]{4,15}$/i;
        return alphanumeric.test(_username);
    }
    isValidPassword(_password) {
        let regex = /^.{4,}$/;
        return regex.test(_password);
    }
    async startSurvey(_uuid) {
        let survey = SurveyDao_1.SurveyDao.getInstance().get(_uuid);
        let answers = await this.answerQuestions(survey);
        let statistic = StatisticDao_1.StatisticDao.getInstance().get(_uuid);
        let colorCyan = "\x1b[96m";
        console.log(`Thank you for participating in the survey: ${colorCyan + survey.title}`);
        this.updateStatistics(answers, statistic);
    }
    async answerQuestions(_survey) {
        console.log("You are now answering: " + _survey.title);
        let answersForStatistic = new Array();
        for (let question of _survey.questions) {
            let choices = PromptHandler_1.PromptHandler.toPromptChoices(question);
            let answer = await PromptHandler_1.PromptHandler.select(question.title, choices);
            answersForStatistic.push(answer);
        }
        return answersForStatistic;
    }
    updateStatistics(_answers, _statistic) {
        for (let index = 0; index < _statistic.answers.length; index++) {
            let chosenAnswerIndex = parseInt(_answers[index]);
            _statistic.answers[index][chosenAnswerIndex]++;
        }
        _statistic.completedCounter++;
        this.completedSurveys.push(_statistic.uuid);
        StatisticDao_1.StatisticDao.getInstance().update(_statistic);
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
    async continueSearching() {
        let answer = await PromptHandler_1.PromptHandler.toggle("do you want to continue searching?", "yes", "no", true);
        if (answer) {
            await this.searchSurvey();
        }
        else {
            await App_1.App.getInstance().goNext();
        }
    }
}
exports.User = User;
//# sourceMappingURL=User.js.map