import { User } from "./User";
import { RegisteredUser } from "./RegisteredUser";
import prompts, { Answers } from "prompts";
import { AbstractUser } from "./abstracts/AbstractUser";

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
    let answer: Answers<string>;
    if (App.user instanceof User) {
      answer = await prompts({
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
    } else if (App.user instanceof RegisteredUser) {
      answer = await prompts({
        type: "select",
        name: "value",
        message: "Which function do you want to use?: ",
        choices: [
          { title: "Show latest Surveys", description: "This option has a description", value: "1" },
          { title: "Search for Survey", value: "2" },
          { title: "Create a new Survey", value: "3" },
          { title: "Watch Statistics", value: "4" },
          { title: "Watch Statistic for Created Surveys", value: "5" }
        ],
        initial: 1
      });
      this.handleRegisteredUserAnswer(answer);
    }
  }
  public async goNext(): Promise<void> {
    let answer: Answers<string> = await prompts({
      type: "confirm",
      name: "value",
      message: "Back to overview?",
      initial: true
    });
    if (answer.value) await this.showMethods();
    else process.exit(22);
  }
  private async handleUserAnswer(_answer: Answers<string>): Promise<void> {
    switch (_answer.value) {
      case "1":
        App.user.showLatestSurveys();
        break;
      case "2":
        App.user.searchSurvey();
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
    await this.showMethods();
  }
  private async handleRegisteredUserAnswer(_answer: Answers<string>): Promise<void> {
    switch (_answer.value) {
      case "1":
        App.user.showLatestSurveys();
        break;
      case "2":
        App.user.searchSurvey();
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
    await this.showMethods();
  }
}
