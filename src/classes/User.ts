import { Choice } from "prompts";
import { AbstractStatistic } from "./abstracts/AbstractStatistic";
import { AbstractSurvey } from "./abstracts/AbstractSurvey";
import { AbstractUser } from "./abstracts/AbstractUser";
import { App } from "./App";
import { UserDao } from "./UserDao";
import { SurveyDao } from "./SurveyDao";
import { StatisticDao } from "./StatisticDao";
import { RegisteredUser } from "./RegisteredUser";
import sha256 from "crypto-js/sha256";
import { PromptHandler } from "./PromptHandler";

export class User extends AbstractUser {
  private static _instance: User;
  public completedSurveys: string[];
  private constructor() {
    super();
    this.completedSurveys = new Array<string>();
  }
  public static getInstance(): User {
    return User._instance || (this._instance = new this());
  }

  public async showPopularSurveys(): Promise<void> {
    let choices: Choice[] = PromptHandler.createDisabledChoicesUser(true, this);
    let answer: string = await PromptHandler.select("Select the survey you want to participate in: ", choices);
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

  public async searchSurvey(): Promise<void> {
    let choices: Choice[] = PromptHandler.createDisabledChoicesUser(false, this);

    let answer: string = await PromptHandler.autocomplete("Type the name of the survey you want to participate in: ", choices);
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

  public async watchPersonalStats(): Promise<void> {
    let completedSurveyCounter: number = this.completedSurveys.length;
    if (completedSurveyCounter === 0) {
      let colorYellow: string = "\x1b[33m";
      console.log(colorYellow + "You didnt complete any surveys yet.");
    } else {
      console.log(`You completed ${completedSurveyCounter} surveys in this session:`);
      this.completedSurveys.forEach((id) => {
        let name: string = SurveyDao.getInstance().get(id).title;
        console.log(name);
      });
    }
  }
  public async login(): Promise<void> {
    let userArray: RegisteredUser[] = UserDao.getInstance().getAll();
    let username: string = await PromptHandler.text("Enter your username (alphanumerical, 4-15 characters): ");
    let password: string = await PromptHandler.password("Enter your password (minimum of 4 characters): ");
    let pwd: CryptoJS.lib.WordArray = sha256(password);
    password = pwd.toString();
    if (this.isMatchingUser(username, userArray, password)) {
      let registeredUser: RegisteredUser = new RegisteredUser(username, password, false);
      App.user = registeredUser;
      console.log("You successfully logged in! ");
    } else {
      console.log("Wrong username or password");
      await this.login();
    }
  }
  public async register(): Promise<void> {
    let userArray: RegisteredUser[] = UserDao.getInstance().getAll();

    let username: string = await await PromptHandler.text("Enter your username (alphanumerical, 4-15 characters): ");

    while (!this.isValidUsername(username) || this.isMatchingUser(username, userArray)) {
      if (!this.isValidUsername(username)) console.log("Your username must be alphanumerical and contain between 4 and 15 characters");
      else console.log("Your username already exists");
      username = await await PromptHandler.text("Enter your username (alphanumerical, 4-15 characters): ");
    }

    let password: string = await PromptHandler.password("Enter your password (minimum of 4 characters): ");

    while (!this.isValidPassword(password)) {
      console.log("Your password must contain at least 4 characters");
      password = await PromptHandler.password("Enter your password (minimum of 4 characters): ");
    }
    let pwd: CryptoJS.lib.WordArray = sha256(password);
    password = pwd.toString();
    let registeredUser: RegisteredUser = new RegisteredUser(username, password, true);
    App.user = registeredUser;
    UserDao.getInstance().add(registeredUser);
    console.log("You have successfully registered! ");
  }

  public isValidUsername(_username: string): boolean {
    let alphanumeric: RegExp = /^[a-z0-9]{4,15}$/i;
    return alphanumeric.test(_username);
  }

  private isValidPassword(_password: string): boolean {
    let regex: RegExp = /^.{4,}$/;
    return regex.test(_password);
  }
  private async startSurvey(_uuid: string): Promise<void> {
    let survey: AbstractSurvey = SurveyDao.getInstance().get(_uuid);
    let answers: string[] = await this.answerQuestions(survey);
    let statistic: AbstractStatistic = StatisticDao.getInstance().get(_uuid);
    let colorCyan: string = "\x1b[96m";
    console.log(`Thank you for participating in the survey: ${colorCyan + survey.title}`);
    this.updateStatistics(answers, statistic);
  }
  private async answerQuestions(_survey: AbstractSurvey): Promise<string[]> {
    console.log("You are now answering: " + _survey.title);
    let answersForStatistic: string[] = new Array<string>();
    for (let question of _survey.questions) {
      let choices: Choice[] = PromptHandler.toPromptChoices(question);
      let answer: string = await PromptHandler.select(question.title, choices);
      answersForStatistic.push(answer);
    }
    return answersForStatistic;
  }

  private updateStatistics(_answers: string[], _statistic: AbstractStatistic): void {
    for (let index: number = 0; index < _statistic.answers.length; index++) {
      let chosenAnswerIndex: number = parseInt(_answers[index]);
      _statistic.answers[index][chosenAnswerIndex]++;
    }
    _statistic.completedCounter++;
    this.completedSurveys.push(_statistic.uuid);
    StatisticDao.getInstance().update(_statistic);
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

  private async continueSearching(): Promise<void> {
    let answer: boolean = await PromptHandler.toggle("do you want to continue searching?", "yes", "no", true);
    if (answer) {
      await this.searchSurvey();
    } else {
      await App.getInstance().goNext();
    }
  }
}
