import { Dao } from "../interfaces/Dao";
import { FileHandler } from "./FileHandler";
import { RegisteredUser } from "./RegisteredUser";

export class UserDao implements Dao<RegisteredUser> {
  private static _instance: UserDao;
  private constructor() {}
  public static getInstance(): UserDao {
    return UserDao._instance || (this._instance = new this());
  }
  public getAll(): RegisteredUser[] {
    return FileHandler.getInstance().readArrayFile("../data/users.json");
  }

  public add(_user: RegisteredUser): void {
    let userArray: RegisteredUser[] = this.getAll();
    userArray.push(_user);
    FileHandler.getInstance().writeFile("../data/users.json", userArray);
  }

  public get(_username: string): RegisteredUser {
    let userArray: RegisteredUser[] = this.getAll();
    for (let user of userArray) {
      if (user.username == _username) return user;
    }
    return userArray[0];
  }

  public update(_user: RegisteredUser): void {
    let userArray: RegisteredUser[] = this.getAll();
    userArray.forEach((user) => {
      if (user.username === _user.username) {
        user.completedSurveys = _user.completedSurveys;
        user.createdSurveys = _user.createdSurveys;
      }
    });
    FileHandler.getInstance().writeFile("../data/users.json", userArray);
  }
}
