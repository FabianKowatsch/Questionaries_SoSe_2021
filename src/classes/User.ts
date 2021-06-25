import prompts, { Answers } from "prompts";
import { AbstractUser } from "./abstracts/AbstractUser";
import { App } from "./App";
import { FileHandler } from "./FileHandler";
import { RegisteredUser } from "./RegisteredUser";

export class User extends AbstractUser {
  private static _instance: User;
  private constructor() {
    super();
  }
  public static getInstance(): User {
    return User._instance || (this._instance = new this());
  }

  public showLatestSurveys(): void {
    return;
  }

  public searchSurvey(): void {
    return;
  }

  public watchGlobalStats(): void {
    return;
  }
  public async login(): Promise<void> {
    let userArray: RegisteredUser[] = FileHandler.getInstance().readArrayFile("../data/users.json");
    let username: string = await this.enterUsername();
    let password: string = await this.enterPassword();

    if (this.isMatchingUser(username, userArray, password)) {
      let registeredUser: RegisteredUser = new RegisteredUser(username, password);
      App.user = registeredUser;
      console.log("You successfully logged in! ", App.user);
    } else {
      console.log("Wrong username or password");
      await this.login();
    }
  }
  public async register(): Promise<void> {
    let userArray: RegisteredUser[] = FileHandler.getInstance().readArrayFile("../data/users.json");
    let username: string = await this.enterUsername();

    while (!this.isValidUsername(username) || this.isMatchingUser(username, userArray)) {
      if (!this.isValidUsername(username)) console.log("Your username must be alphanumerical and contain between 4 and 15 characters");
      else console.log("Your username already exists");
      username = await this.enterUsername();
    }

    let password: string = await this.enterPassword();
    while (!this.isValidPassword(password)) {
      console.log("Your password must contain at least 4 characters");
      password = await this.enterPassword();
    }

    let registeredUser: RegisteredUser = new RegisteredUser(username, password);
    App.user = registeredUser;
    userArray.push(registeredUser);
    FileHandler.getInstance().writeFile("../data/users.json", userArray);
    console.log("You have successfully registered! ", App.user);
  }

  private async enterUsername(): Promise<string> {
    let username: Answers<string> = await prompts({
      type: "text",
      name: "value",
      message: "Enter your username (alphanumerical, 4-15 characters): "
    });
    return username.value;
  }
  private async enterPassword(): Promise<string> {
    let password: Answers<string> = await prompts({
      type: "password",
      name: "value",
      message: "Enter your password (minimum of 4 characters): "
    });
    return password.value;
  }

  private isValidUsername(_username: string): boolean {
    let alphanumeric: RegExp = /^[a-z0-9]{4,15}$/i;
    return alphanumeric.test(_username);
  }

  private isValidPassword(_password: string): boolean {
    let regex: RegExp = /^.{4,}$/;
    return regex.test(_password);
  }

  private isMatchingUser(_username: string, _userArray: RegisteredUser[], password?: string): boolean {
    for (let user of _userArray) {
      if (password) {
        if (user.username == _username && user.password == password) return true;
      } else {
        if (user.username == _username) return true;
      }
    }
    return false;
  }
}
