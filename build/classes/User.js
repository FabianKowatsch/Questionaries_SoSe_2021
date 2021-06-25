"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const prompts_1 = __importDefault(require("prompts"));
const App_1 = require("./App");
const RegisteredUser_1 = require("./RegisteredUser");
class User {
    static _instance;
    constructor() { }
    static getInstance() {
        return User._instance || (this._instance = new this());
    }
    chooseSurvery() {
        return;
    }
    searchSurvey() {
        return;
    }
    watchGlobalStats() {
        return;
    }
    login() {
        return;
    }
    async register() {
        let username = await this.enterUsername();
        while (!this.isValidUsername(username) || this.isExistingUsername(username)) {
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
        App_1.App.user = new RegisteredUser_1.RegisteredUser(username, password);
        console.log(App_1.App.user);
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
    isExistingUsername(_username) {
        return false;
    }
}
exports.User = User;
//# sourceMappingURL=User.js.map