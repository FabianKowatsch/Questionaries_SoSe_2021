import prompts, { Answers } from "prompts";
import { AbstractUser } from "./abstracts/AbstractUser";
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
    let title: Answers<string> = await prompts({
      type: "text",
      name: "value",
      message: "Enter the title of your survey: "
    });
    let survey: Survey = new Survey(title.value, this.username);
    await survey.addTimeSpan();
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
