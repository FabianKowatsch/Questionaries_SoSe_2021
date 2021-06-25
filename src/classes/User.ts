import prompts, { Answers } from "prompts";
import { AbstractUser } from "../interfaces/AbstractUser";
import { App } from "./App";
import { RegisteredUser } from "./RegisteredUser";

export class User implements AbstractUser {
  private static _instance: User;
  private constructor() {}
  public static getInstance(): User {
    return User._instance || (this._instance = new this());
  }

  public chooseSurvery(): void {
    return;
  }

  public searchSurvey(): void {
    return;
  }

  public watchGlobalStats(): void {
    return;
  }
  public login(): void {
    return;
  }
  public async register(): Promise<void> {
    let username: string = await this.enterUsername();
    while (!this.isValidUsername(username) || this.isExistingUsername(username)) {
      if (!this.isValidUsername(username)) console.log("Your username must be alphanumerical and contain between 4 and 15 characters");
      else console.log("Your username already exists");
      username = await this.enterUsername();
    }
    let password: string = await this.enterPassword();
    while (!this.isValidPassword(password)) {
      console.log("Your password must contain at least 4 characters");
      password = await this.enterPassword();
    }

    App.user = new RegisteredUser(username, password);
    console.log(App.user);
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

  private isExistingUsername(_username: string): boolean {
    return false;
  }
}
