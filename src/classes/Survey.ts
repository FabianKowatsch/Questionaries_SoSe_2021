import { Question } from "./Question";
import { TimeSpan } from "../types/TimeSpan.type";
import { AbstractSurvey } from "./abstracts/AbstractSurvey";
import prompts, { Answers } from "prompts";
import { Dao } from "./Dao";
import { v4 as uuidV4 } from "uuid";
import { Statistic } from "./Statistic";
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
    let title: Answers<string> = await prompts({
      type: "text",
      name: "value",
      message: "Enter a question you want to add: "
    });

    let question: Question = new Question(title.value);
    await question.addAnswer();
    this.questions.push(question);

    if (this.questions.length < Survey._minQuestionAmount) {
      await this.addQuestion();
      return;
    } else {
      let answer: Answers<string> = await prompts({
        type: "toggle",
        name: "value",
        message: "Do you want to finish the Survey?",
        initial: false,
        active: "yes",
        inactive: "no"
      });
      if (answer.value) {
        await this.upload();
        return;
      } else {
        await this.addQuestion();
        return;
      }
    }
  }

  public async addTimeSpan(): Promise<void> {
    let yesterday: Date = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    let timeStart: Answers<string> = await prompts({
      type: "date",
      name: "value",
      message: "Enter the starting date of the survey ( format: D.M.YYYY): ",
      mask: "D.M.YYYY",
      validate: (date) => (date < yesterday.getTime() ? "Dont select past dates" : true)
    });
    let timeEnd: Answers<string> = await prompts({
      type: "date",
      name: "value",
      message: "Enter the terminating date of the survey ( format: D.M.YYYY): ",
      mask: "D.M.YYYY",
      validate: (date) => (timeStart.value > date ? "Make sure your selected date is after your previous date" : true)
    });
    this.timeSpan = { start: timeStart.value, end: timeEnd.value };
  }

  public upload(): void {
    Dao.getInstance().addSurvey(this);
    Dao.getInstance().addStatistic(new Statistic(this.uuid, this.questions));
  }
}
