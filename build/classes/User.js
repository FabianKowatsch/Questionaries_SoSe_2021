"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const prompts_1 = __importDefault(require("prompts"));
const AbstractUser_1 = require("./abstracts/AbstractUser");
const App_1 = require("./App");
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
    showLatestSurveys() {
        return;
    }
    searchSurvey() {
        return;
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
}
exports.User = User;
//# sourceMappingURL=User.js.map