import { Question } from "./Question";
import { TimeSpan } from "../types/TimeSpan.type";
import { AbstractSurvey } from "./abstracts/AbstractSurvey";
import { Dao } from "./Dao";
import { v4 as uuidV4 } from "uuid";
import { Statistic } from "./Statistic";
import { ConsoleHandler } from "./ConsoleHandler";
export class Survey extends AbstractSurvey {
  private static _minQuestionAmount: number = 5;
  public title: string;
  public uuid: string;
  public timeSpan: TimeSpan;
  public questions: Question[];
  public creator: string;
  constructor(_title: string, _creator: string) {
    super();
    this.title = _title;
    this.questions = new Array<Question>();
    this.creator = _creator;
    this.uuid = uuidV4();
  }
  public async addQuestion(): Promise<void> {
    let title: string = await ConsoleHandler.text("Enter a question you want to add: ");
    let question: Question = new Question(title);
    await question.addAnswer();
    this.questions.push(question);

    if (this.questions.length < Survey._minQuestionAmount) {
      await this.addQuestion();
      return;
    } else {
      let answer: boolean = await ConsoleHandler.toggle("Do you want to finish the Survey?", "yes", "no");
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
    this.timeSpan = await ConsoleHandler.timeSpan();
  }

  public upload(): void {
    Dao.getInstance().addSurvey(this);
    let answers: number[][];
    this.questions.forEach((question) => {
      let initial: number[] = new Array<number>(question.answers.length);
      answers.push(initial);
    });
    Dao.getInstance().addStatistic(new Statistic(this.uuid, answers));
  }
}
