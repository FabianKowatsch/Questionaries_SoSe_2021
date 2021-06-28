import { Choice } from "prompts";
import { Answer } from "../types/Answer.type";
import { AbstractStatistic } from "./abstracts/AbstractStatistic";
import { AbstractSurvey } from "./abstracts/AbstractSurvey";
import { AbstractUser } from "./abstracts/AbstractUser";
import { App } from "./App";
import { Dao } from "./Dao";
import { Question } from "./Question";
import { RegisteredUser } from "./RegisteredUser";
import sha256 from "crypto-js/sha256";
import { ConsoleHandler } from "./ConsoleHandler";

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
    let choices: Choice[] = this.createChoicesWithRestrictions(true);
    let answer: string = await ConsoleHandler.select("Select the survey you want to participate in: ", choices);
    switch (answer) {
      case undefined:
        await App.getInstance().goNext();
        break;
      default:
        await this.startSurvey(answer);
        break;
    }
  }

  public async searchSurvey(): Promise<void> {
    let choices: Choice[] = this.createChoicesWithRestrictions(false);

    let answer: string = await ConsoleHandler.autocomplete("Type the name of the survey you want to participate in: ", choices);
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

  public async watchGlobalStats(): Promise<void> {
    let completedSurveyCounter: number = this.completedSurveys.length;
    if (completedSurveyCounter === 0) {
      console.log("You didnt complete any surveys yet.");
    } else {
      console.log(`You completed ${completedSurveyCounter} surveys so far:`);
      this.completedSurveys.forEach((id) => {
        let name: string = Dao.getInstance().getSurvey(id).title;
        console.log(name);
      });
    }
  }
  public async login(): Promise<void> {
    let userArray: RegisteredUser[] = Dao.getInstance().getAllUsers();
    let username: string = await ConsoleHandler.text("Enter your username (alphanumerical, 4-15 characters): ");
    let password: string = await ConsoleHandler.password("Enter your password (minimum of 4 characters): ");
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
    let userArray: RegisteredUser[] = Dao.getInstance().getAllUsers();

    let username: string = await await ConsoleHandler.text("Enter your username (alphanumerical, 4-15 characters): ");

    while (!this.isValidUsername(username) || this.isMatchingUser(username, userArray)) {
      if (!this.isValidUsername(username)) console.log("Your username must be alphanumerical and contain between 4 and 15 characters");
      else console.log("Your username already exists");
      username = await await ConsoleHandler.text("Enter your username (alphanumerical, 4-15 characters): ");
    }

    let password: string = await ConsoleHandler.password("Enter your password (minimum of 4 characters): ");

    while (!this.isValidPassword(password)) {
      console.log("Your password must contain at least 4 characters");
      password = await ConsoleHandler.password("Enter your password (minimum of 4 characters): ");
    }
    let pwd: CryptoJS.lib.WordArray = sha256(password);
    password = pwd.toString();
    let registeredUser: RegisteredUser = new RegisteredUser(username, password, true);
    App.user = registeredUser;
    Dao.getInstance().addUser(registeredUser);
    console.log("You have successfully registered! ");
  }
  private async startSurvey(_uuid: string): Promise<void> {
    let survey: AbstractSurvey = Dao.getInstance().getSurvey(_uuid);
    let answers: string[] = await this.answerQuestions(survey);
    let statistic: AbstractStatistic = Dao.getInstance().getStatistic(_uuid);
    this.updateStatistics(answers, statistic);
  }
  private async answerQuestions(_survey: AbstractSurvey): Promise<string[]> {
    console.log("You are now answering: " + _survey.title);
    let answersForStatistic: string[] = new Array<string>();
    for (let question of _survey.questions) {
      let choices: Choice[] = this.toPromptChoices(question);
      let answer: string = await ConsoleHandler.select(question.title, choices);
      answersForStatistic.push(answer);
    }
    return answersForStatistic;
  }
  private toPromptChoices(_question: Question): Choice[] {
    let choices: Choice[] = new Array<Choice>();
    _question.answers.forEach((answer) => {
      choices.push({ title: answer.name });
    });
    return choices;
  }
  private updateStatistics(_answers: string[], _statistic: AbstractStatistic): void {
    for (let index: number = 0; index < _statistic.questions.length; index++) {
      let chosenAnswerIndex: number = parseInt(_answers[index]);
      let chosenAnswer: Answer = _statistic.questions[index].answers[chosenAnswerIndex];
      chosenAnswer.count++;
    }
    _statistic.completedCounter++;
    this.completedSurveys.push(_statistic.uuid);
    Dao.getInstance().updateStatistic(_statistic);
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

  private createChoicesWithRestrictions(_popularOnly: boolean): Choice[] {
    let flagRed: string = "\x1b[31m";
    let choices: Choice[] = new Array<Choice>();
    let surveyArray: AbstractSurvey[];
    if (_popularOnly) {
      surveyArray = Dao.getInstance().getMostPopularSurveys();
    } else {
      surveyArray = Dao.getInstance().getAllSurveys();
    }
    surveyArray.forEach((survey) => {
      let dateStart: Date = new Date(survey.timeSpan.start);
      let dateEnd: Date = new Date(survey.timeSpan.end);
      if (dateStart.getTime() > Date.now()) {
        choices.push({
          title: flagRed + survey.title + (_popularOnly ? ` (locked, starting date: ${survey.timeSpan.start})` : ""),
          value: "disabled",
          disabled: true,
          description: `locked, starting date: ${survey.timeSpan.start}`
        });
      } else if (dateEnd.getTime() <= Date.now()) {
        choices.push({
          title: flagRed + survey.title + (_popularOnly ? ` (locked, starting date: ${survey.timeSpan.start})` : ""),
          value: "disabled",
          disabled: true,
          description: `locked, terminating date: ${survey.timeSpan.end}`
        });
      } else {
        choices.push({ title: survey.title, value: survey.uuid });
      }
    });

    return choices;
  }
}
