"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.App = void 0;
const User_1 = require("./User");
const RegisteredUser_1 = require("./RegisteredUser");
const ConsoleHandler_1 = require("./ConsoleHandler");
class App {
    static user;
    static _instance;
    constructor() {
        App.user = User_1.User.getInstance();
    }
    static getInstance() {
        return App._instance || (this._instance = new this());
    }
    async showMethods() {
        let answer;
        let choices;
        if (App.user instanceof User_1.User) {
            choices = [
                { title: "Show most popular Surveys", description: "This option has a description", value: "1" },
                { title: "Search for Survey", value: "2" },
                { title: "Watch personal Statistics", value: "3" },
                { title: "Login", value: "4" },
                { title: "Register", value: "5" }
            ];
            answer = await ConsoleHandler_1.ConsoleHandler.select("Which function do you want to use? ", choices);
            await this.handleUserAnswer(answer);
        }
        else if (App.user instanceof RegisteredUser_1.RegisteredUser) {
            choices = [
                { title: "Show most popular Surveys", description: "This option has a description", value: "1" },
                { title: "Search for Survey", value: "2" },
                { title: "Create a new Survey", value: "3" },
                { title: "Watch personal Statistics", value: "4" },
                { title: "Watch Statistic for created Surveys", value: "5" }
            ];
            answer = await ConsoleHandler_1.ConsoleHandler.select("Which function do you want to use? ", choices);
            await this.handleRegisteredUserAnswer(answer);
        }
    }
    async goNext() {
        let answer = await ConsoleHandler_1.ConsoleHandler.toggle("Back to overview? \x1b[31m(no will exit the program)\x1b[0m", "yes", "no");
        if (answer)
            await this.showMethods();
        else
            process.exit(22);
    }
    async handleUserAnswer(_answer) {
        switch (_answer) {
            case "1":
                await App.user.showPopularSurveys();
                break;
            case "2":
                await App.user.searchSurvey();
                break;
            case "3":
                App.user.watchGlobalStats();
                break;
            case "4":
                await App.user.login();
                break;
            case "5":
                await App.user.register();
                break;
            default:
                break;
        }
        await this.goNext();
    }
    async handleRegisteredUserAnswer(_answer) {
        switch (_answer) {
            case "1":
                await App.user.showPopularSurveys();
                break;
            case "2":
                await App.user.searchSurvey();
                break;
            case "3":
                await App.user.createSurvey();
                break;
            case "4":
                await App.user.watchGlobalStats();
                break;
            case "5":
                await App.user.watchCreatedSurveys();
                break;
            default:
                break;
        }
        await this.goNext();
    }
}
exports.App = App;
//# sourceMappingURL=App.js.map