import { AbstractUser } from "./abstracts/AbstractUser";
import { ConsoleHandler } from "./ConsoleHandler";
import { Survey } from "./Survey";

export class RegisteredUser extends AbstractUser {
  public username: string;
  public password: string;
  constructor(_username: string, _password: string) {
    super();
    this.username = _username;
    this.password = _password;
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
