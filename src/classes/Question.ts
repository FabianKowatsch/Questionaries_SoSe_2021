import prompts, { Answers } from "prompts";
import { Answer } from "../types/Answer.type";
export class Question {
  private static _minAnswerAmount: number = 2;
  private static _maxAnswerAmount: number = 10;
  public title: string;
  public answers: Answer[];
  constructor(_title: string) {
    this.title = _title;
    this.answers = new Array<Answer>();
  }

  public async addAnswer(): Promise<void> {
    let name: Answers<string> = await prompts({
      type: "text",
      name: "value",
      message: "Enter an answer: "
    });

    let answer: Answer = { name: name.value, count: 0 };
    this.answers.push(answer);
    if (this.answers.length < Question._minAnswerAmount) {
      await this.addAnswer();
    } else {
      if (this.answers.length < Question._maxAnswerAmount) {
        let confirm: boolean = await this.confirmNextAnswer();
        if (confirm) {
          await this.addAnswer();
        } else {
          return;
        }
      } else {
        return;
      }
    }
  }

  private async confirmNextAnswer(): Promise<boolean> {
    let confirm: Answers<string> = await prompts({
      type: "toggle",
      name: "value",
      message: "Do you want to add another Answer?",
      initial: true,
      active: "yes",
      inactive: "no"
    });
    return confirm.value;
  }
}
