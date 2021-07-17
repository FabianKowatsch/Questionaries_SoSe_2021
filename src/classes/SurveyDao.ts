import { Dao } from "../interfaces/Dao";
import { AbstractStatistic } from "./abstracts/AbstractStatistic";
import { AbstractSurvey } from "./abstracts/AbstractSurvey";
import { FileHandler } from "./FileHandler";
import { NullSurvey } from "./NullSurvey";
import { StatisticDao } from "./StatisticDao";

export class SurveyDao implements Dao<AbstractSurvey> {
  private static _instance: SurveyDao;
  private constructor() {}
  public static getInstance(): SurveyDao {
    return SurveyDao._instance || (this._instance = new this());
  }
  public get(_id: string): AbstractSurvey {
    let surveyArray: AbstractSurvey[] = this.getAll();
    let survey: AbstractSurvey = surveyArray.filter((survey) => survey.uuid == _id)[0];
    survey = survey !== undefined ? survey : new NullSurvey();
    return survey;
  }

  public getAll(): AbstractSurvey[] {
    let surveyArray: AbstractSurvey[] = FileHandler.getInstance().readArrayFile("../data/surveys.json");
    if (surveyArray.length === 0) return [new NullSurvey()];
    return surveyArray;
  }

  public getMostPopularSurveys(): AbstractSurvey[] {
    let surveyArray: AbstractSurvey[] = new Array<AbstractSurvey>();
    let statisticArray: AbstractStatistic[] = StatisticDao.getInstance().getAll();
    statisticArray.sort((a, b) => (a.completedCounter < b.completedCounter ? 1 : b.completedCounter < a.completedCounter ? -1 : 0));
    let maxSurveys: number = 10;
    if (statisticArray.length < 10) maxSurveys = statisticArray.length;
    for (let index: number = 0; index < maxSurveys; index++) {
      surveyArray.push(this.get(statisticArray[index].uuid));
    }
    return surveyArray;
  }

  public update(_survey: AbstractSurvey): void {
    let surveyArray: AbstractSurvey[] = this.getAll();
    surveyArray.forEach((survey) => {
      if (survey.uuid === _survey.uuid) {
        survey.timeSpan = _survey.timeSpan;
        survey.questions = _survey.questions;
      }
    });
    FileHandler.getInstance().writeFile("../data/surveys.json", surveyArray);
  }

  public add(_survey: AbstractSurvey): void {
    let surveyArray: AbstractSurvey[] = this.getAll();
    surveyArray.push(_survey);
    FileHandler.getInstance().writeFile("../data/surveys.json", surveyArray);
  }
}
