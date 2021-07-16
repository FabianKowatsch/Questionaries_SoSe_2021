import { User } from "./User";
import { RegisteredUser } from "./RegisteredUser";
import { Choice } from "prompts";
import { AbstractUser } from "./abstracts/AbstractUser";
import { PromptHandler } from "./PromptHandler";

export class App {
  public static user: AbstractUser;
  private static _instance: App;
  private constructor() {
    App.user = User.getInstance();
  }
  public static getInstance(): App {
    return App._instance || (this._instance = new this());
  }

  public async showMethods(): Promise<void> {
    let answer: string;
    let choices: Choice[];
    if (App.user instanceof User) {
      choices = [
        { title: "Show most popular Surveys", description: "This option has a description", value: "1" },
        { title: "Search Survey by title", value: "2" },
        { title: "Watch personal Statistics", value: "3" },
        { title: "Login", value: "4" },
        { title: "Register", value: "5" }
      ];
      answer = await PromptHandler.select("Welcome to Questionaries, which function do you want to use? ", choices);
      await this.handleUserAnswer(answer);
    } else if (App.user instanceof RegisteredUser) {
      choices = [
        { title: "Show most popular Surveys", description: "This option has a description", value: "1" },
        { title: "Search Survey by title", value: "2" },
        { title: "Create a new Survey", value: "3" },
        { title: "Watch personal Statistics", value: "4" },
        { title: "Watch Statistic for created Surveys", value: "5" }
      ];
      answer = await PromptHandler.select("Welcome to Questionaries, which function do you want to use? ", choices);
      await this.handleRegisteredUserAnswer(answer);
    }
  }
  public async goNext(): Promise<void> {
    let answer: boolean = await PromptHandler.toggle("Back to overview? \x1b[31m(no will exit the program)\x1b[0m", "yes", "no");
    if (answer) await this.showMethods();
    else process.exit();
  }
  private async handleUserAnswer(_answer: string): Promise<void> {
    switch (_answer) {
      case "1":
        await App.user.showPopularSurveys();
        break;
      case "2":
        await App.user.searchSurvey();
        break;
      case "3":
        App.user.watchPersonalStats();
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
  private async handleRegisteredUserAnswer(_answer: string): Promise<void> {
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
        await App.user.watchPersonalStats();
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
