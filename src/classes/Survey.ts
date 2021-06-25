import { Question } from "./Question";
import { TimeSpan } from "../types/TimeSpan.type";
import { AbstractSurvey } from "./abstracts/AbstractSurvey";
import prompts, { Answers } from "prompts";
import { FileHandler } from "./FileHandler";
import { App } from "./App";
export class Survey extends AbstractSurvey {
  private static minQuestionAmount: number = 5;
  public title: string;
  public timeSpan: TimeSpan;
  public questions: Question[];
  public creator: string;
  constructor(_title: string, _startDate: Date, _endDate: Date, _creator: string) {
    super();
    this.title = _title;
    this.timeSpan = { start: _startDate, end: _endDate };
    this.questions = new Array<Question>();
    this.creator = _creator;
  }
  public isNull(): boolean {
    return false;
  }
  public async addQuestion(): Promise<void> {
    let title: Answers<string> = await prompts({
      type: "text",
      name: "value",
      message: "Enter the question you want to add: "
    });

    let question: Question = new Question(title.value);
    await question.addAnswer();
    this.questions.push(question);
    if (this.questions.length < Survey.minQuestionAmount) {
      await this.addQuestion();
      return;
    } else {
      let answer: Answers<string> = await prompts({
        type: "confirm",
        name: "value",
        message: "Do you want to finish the Survey?",
        initial: false
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

  public upload(): void {
    let surveyArray: Survey[] = FileHandler.getInstance().readArrayFile("../data/surveys.json");
    surveyArray.push(this);
    FileHandler.getInstance().writeFile("../data/surveys.json", surveyArray);
    App.getInstance().showMethods();
  }
}
