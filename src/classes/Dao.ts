import { FileHandler } from "./FileHandler";
import { Statistic } from "./Statistic";
import { NullStatistic } from "./NullStatistic";
import { Survey } from "./Survey";
import { AbstractStatistic } from "./abstracts/AbstractStatistic";
export class Dao {
  private static _instance: Dao;
  private constructor() {}
  public static getInstance(): Dao {
    return Dao._instance || (this._instance = new this());
  }

  public getAllStatistics(): AbstractStatistic[] {
    let statisticArray: AbstractStatistic[] = FileHandler.getInstance().readArrayFile("../data/statistics.json");
    return statisticArray;
  }
  public getStatistic(_id: string): AbstractStatistic {
    let statisticArray: AbstractStatistic[] = this.getAllStatistics();
    let statistic: AbstractStatistic = statisticArray.filter((statistic) => statistic.uuid === _id)[0];
    statistic = statistic !== undefined ? statistic : new NullStatistic();
    return statistic;
  }
  public updateStatistic(_statistic: AbstractStatistic): void {
    let statisticArray: AbstractStatistic[] = this.getAllStatistics();
    statisticArray.forEach((statistic) => {
      if (statistic.uuid === _statistic.uuid) {
        statistic.users = _statistic.users;
        statistic.questions = _statistic.questions;
        statistic.completedCounter = _statistic.completedCounter;
      }
    });
    FileHandler.getInstance().writeFile("../data/statistics.json", statisticArray);
  }

  public addStatistic(_statistic: Statistic): void {
    let statisticArray: Statistic[] = this.getAllStatistics();
    statisticArray.push(_statistic);
    FileHandler.getInstance().writeFile("../data/statistics.json", statisticArray);
  }

  public getSurvey(_id: string): Survey {
    let surveyArray: Survey[] = this.getAllSurveys();
    let survey: Survey = surveyArray.filter((survey) => survey.uuid == _id)[0];
    return survey;
  }

  public getAllSurveys(): Survey[] {
    let surveyArray: Survey[] = FileHandler.getInstance().readArrayFile("../data/surveys.json");
    return surveyArray;
  }

  public addSurvey(_survey: Survey): void {
    let surveyArray: Survey[] = this.getAllSurveys();
    surveyArray.push(_survey);
    FileHandler.getInstance().writeFile("../data/surveys.json", surveyArray);
  }
}
