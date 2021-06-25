import { User } from "./User";
import { RegisteredUser } from "./RegisteredUser";
import prompts, { Answers } from "prompts";
import { AbstractUser } from "../interfaces/AbstractUser";

export class App {
  public static user: AbstractUser;
  constructor() {
    App.user = User.getInstance();
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
          { title: "Watch Statistics", value: "3" },
          { title: "Watch Statistic for Created Surveys", value: "4" }
        ],
        initial: 1
      });
      this.handleRegisteredUserAnswer(answer);
    }
  }

  private async handleUserAnswer(_answer: Answers<string>): Promise<void> {
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
  private async handleRegisteredUserAnswer(_answer: Answers<string>): Promise<void> {
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
