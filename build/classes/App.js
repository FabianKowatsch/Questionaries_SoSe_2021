"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.App = void 0;
const User_1 = require("./User");
const RegisteredUser_1 = require("./RegisteredUser");
const prompts_1 = __importDefault(require("prompts"));
class App {
    static user;
    constructor() {
        App.user = User_1.User.getInstance();
    }
    async showMethods() {
        let answer;
        if (App.user instanceof User_1.User) {
            answer = await prompts_1.default({
                type: "select",
                name: "value",
                message: "Which function do you want to use?: ",
                choices: [
                    { title: "Show latest Surveys", description: "This option has a description", value: "1" },
                    { title: "Search for Survey", value: "2" },
                    { title: "Watch Statistics", value: "3" },
                    { title: "Login", value: "4" },
                    { title: "Register", value: "5" }
                ],
                initial: 1
            });
            this.handleUserAnswer(answer);
        }
        else if (App.user instanceof RegisteredUser_1.RegisteredUser) {
            answer = await prompts_1.default({
                type: "select",
                name: "value",
                message: "Which function do you want to use?: ",
                choices: [
                    { title: "Show latest Surveys", description: "This option has a description", value: "1" },
                    { title: "Search for Survey", value: "2" },
                    { title: "Watch Statistics", value: "3" },
                    { title: "Watch Statistic for Created Surveys", value: "4" }
                ],
                initial: 1
            });
            this.handleRegisteredUserAnswer(answer);
        }
    }
    async handleUserAnswer(_answer) {
        console.log(_answer.value);
        switch (_answer.value) {
            case "1":
                App.user.chooseSurvery();
                break;
            case "2":
                App.user.searchSurvey();
                break;
            case "3":
                App.user.watchGlobalStats();
                break;
            case "4":
                App.user.login();
                break;
            case "5":
                App.user.register();
                break;
            default:
                break;
        }
    }
    async handleRegisteredUserAnswer(_answer) {
        console.log(_answer.value);
        switch (_answer.value) {
            case "1":
                App.user.chooseSurvery();
                break;
            case "2":
                App.user.searchSurvey();
                break;
            case "3":
                App.user.watchGlobalStats();
                break;
            case "4":
                App.user.watchSpecificStats();
                break;
            default:
                break;
        }
    }
}
exports.App = App;
//# sourceMappingURL=App.js.map