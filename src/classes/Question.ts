import prompts, { Answers } from "prompts";
import { Answer } from "../types/Answer.type";
export class Question {
  private static minAnswerAmount: number = 2;
  private static maxAnswerAmount: number = 10;
  public title: string;
  public answers: Answer[];
  constructor(_title: string) {
    this.title = _title;
    this.answers = new Array<Answer>();
  }

  public async addAnswer(): Promise<void> {
    console.log(this.answers.length);
    let name: Answers<string> = await prompts({
      type: "text",
      name: "value",
      message: "Enter an answer: "
    });

    let answer: Answer = { name: name.value, count: 0 };
    this.answers.push(answer);
    if (this.answers.length < Question.minAnswerAmount) {
      await this.addAnswer();
    } else {
      if (this.answers.length < Question.maxAnswerAmount) {
        let confirm: Answers<string> = await prompts({
          type: "confirm",
          name: "value",
          message: "Do you want to add another Answer?",
          initial: true
        });
        if (confirm.value) {
          await this.addAnswer();
        } else {
          return;
        }
      } else {
        return;
      }
    }
  }
}
