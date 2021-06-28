import { AbstractUser } from "./abstracts/AbstractUser";
import { ConsoleHandler } from "./ConsoleHandler";
import { Dao } from "./Dao";
import { Survey } from "./Survey";

export class RegisteredUser extends AbstractUser {
  public username: string;
  public password: string;
  public createdSurveys: string[];
  public completedSurveys: string[];
  constructor(_username: string, _password: string, _new: boolean) {
    super();
    this.username = _username;
    this.password = _password;
    if (_new) {
      this.completedSurveys = new Array<string>();
      this.createdSurveys = new Array<string>();
    } else {
      let existingUser: RegisteredUser = Dao.getInstance().getUser(this.username);
      this.completedSurveys = existingUser.completedSurveys;
      this.createdSurveys = existingUser.createdSurveys;
    }
  }

  public async createSurvey(): Promise<void> {
    let title: string = await ConsoleHandler.text("Enter a question you want to add: ");
    let survey: Survey = new Survey(title, this.username);
    await survey.setTimeSpan();
    await survey.addQuestion();
  }

  public showPopularSurveys(): void {
    return;
  }

  public searchSurvey(): void {
    return;
  }

  public watchGlobalStats(): void {
    return;
  }
  public watchSpecificStats(): void {
    return;
  }
}
