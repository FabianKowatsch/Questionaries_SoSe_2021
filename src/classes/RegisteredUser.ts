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
    let title: string = await this.enterText("Enter the title of the survey: ");
    let start: string = await this.enterText("Enter the starting date of the survey ( format: dd.mm.yyyy): ");
    let end: string = await this.enterText("Enter the termination date of the survey ( format: dd.mm.yyyy): ");
    while (!this.validateDates(start, end)) {
      console.log("Make sure your dates follow the format dd.mm.yyyy and are in correct order");
      start = await this.enterText("Enter the starting date of the survey ( format: dd.mm.yyyy): ");
      end = await this.enterText("Enter the termination date of the survey ( format: dd.mm.yyyy): ");
    }

    let survey: Survey = new Survey(title, this.toDate(start), this.toDate(end), this.username);
    await survey.addQuestion();
  }

  public showLatestSurveys(): void {
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
  private validateDates(dateString1: string, dateString2: string): boolean {
    let regex: RegExp = /^\s*(3[01]|[12][0-9]|0?[1-9])\.(1[012]|0?[1-9])\.((?:19|20)\d{2})\s*$/g;
    if (regex.test(dateString1) && regex.test(dateString2)) {
      console.log("wrong format");
      return false;
    } else {
      if (this.toDate(dateString1) < this.toDate(dateString2)) return true;
      console.log("wrong order");
      return false;
    }
  }

  private toDate(_string: string): Date {
    let array: string[] = _string.split(".");
    let date: Date = new Date();
    date.setFullYear(parseInt(array[2]), parseInt(array[1]) - 1, parseInt(array[0]));
    return date;
  }
  private async enterText(_message: string): Promise<string> {
    let username: Answers<string> = await prompts({
      type: "text",
      name: "value",
      message: _message
    });
    return username.value;
  }
}
