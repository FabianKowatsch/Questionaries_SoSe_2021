import { AbstractUser } from "../interfaces/AbstractUser";

export class RegisteredUser implements AbstractUser {
  public username: string;
  private _password: string;
  constructor(_username: string, _password: string) {
    this.username = _username;
    this._password = _password;
  }

  public chooseSurvery(): void {
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
