import { AbstractUser } from "./abstracts/AbstractUser";

export class RegisteredUser extends AbstractUser {
  public username: string;
  public password: string;
  constructor(_username: string, _password: string) {
    super();
    this.username = _username;
    this.password = _password;
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
}
