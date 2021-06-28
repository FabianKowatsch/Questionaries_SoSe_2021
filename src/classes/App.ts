import { User } from "./User";
import { RegisteredUser } from "./RegisteredUser";
import { Choice } from "prompts";
import { AbstractUser } from "./abstracts/AbstractUser";
import { ConsoleHandler } from "./ConsoleHandler";

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
        { title: "Search for Survey", value: "2" },
        { title: "Watch personal Statistics", value: "3" },
        { title: "Login", value: "4" },
        { title: "Register", value: "5" }
      ];
      answer = await ConsoleHandler.select("Which function do you want to use? ", choices);
      await this.handleUserAnswer(answer);
    } else if (App.user instanceof RegisteredUser) {
      choices = [
        { title: "Show most popular Surveys", description: "This option has a description", value: "1" },
        { title: "Search for Survey", value: "2" },
        { title: "Create a new Survey", value: "3" },
        { title: "Watch personal Statistics", value: "4" },
        { title: "Watch Statistic for Created Surveys", value: "5" }
      ];
      answer = await ConsoleHandler.select("Which function do you want to use? ", choices);
      await this.handleRegisteredUserAnswer(answer);
    }
  }
  public async goNext(): Promise<void> {
    let answer: boolean = await ConsoleHandler.toggle("Back to overview?", "yes", "no");
    if (answer) await this.showMethods();
    else process.exit(22);
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
        await App.user.watchGlobalStats();
        break;
      case "5":
        await App.user.watchSpecificStats();
        break;
      default:
        break;
    }
    await this.goNext();
  }
}
