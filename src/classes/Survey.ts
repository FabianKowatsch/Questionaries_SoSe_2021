import { Question } from "./Question";
import { TimeSpan } from "../types/TimeSpan.type";
import { AbstractSurvey } from "./abstracts/AbstractSurvey";
import { SurveyDao } from "./SurveyDao";
import { StatisticDao } from "./StatisticDao";
import { v4 as uuidV4 } from "uuid";
import { Statistic } from "./Statistic";
import { PromptHandler } from "./PromptHandler";
export class Survey extends AbstractSurvey {
  private static _minQuestionAmount: number = 5;
  public title: string;
  public uuid: string;
  public timeSpan: TimeSpan;
  public questions: Question[];
  constructor(_title: string) {
    super();
    this.title = _title;
    this.questions = new Array<Question>();
    this.uuid = uuidV4();
  }
  public async addQuestion(): Promise<void> {
    let title: string = await PromptHandler.text("Enter a question you want to add: ");
    let question: Question = new Question(title);
    await question.addAnswer();
    this.questions.push(question);

    if (this.questions.length < Survey._minQuestionAmount) {
      await this.addQuestion();
      return;
    } else {
      let answer: boolean = await PromptHandler.toggle("Do you want to finish the Survey?", "yes", "no");
      if (answer) {
        await this.upload();
        return;
      } else {
        await this.addQuestion();
        return;
      }
    }
  }

  public async setTimeSpan(): Promise<void> {
    this.timeSpan = await PromptHandler.timeSpan();
  }

  public upload(): void {
    SurveyDao.getInstance().add(this);
    let answers: number[][] = new Array<number[]>();
    this.questions.forEach((question) => {
      let initial: number[] = new Array<number>(question.answers.length);
      for (let index: number = 0; index < initial.length; index++) {
        initial[index] = 0;
      }
      answers.push(initial);
    });
    StatisticDao.getInstance().add(new Statistic(this.uuid, answers));
  }
}
