import { ConsoleHandler } from "./ConsoleHandler";
export class Question {
  private static _minAnswerAmount: number = 2;
  private static _maxAnswerAmount: number = 10;
  public title: string;
  public answers: string[];
  constructor(_title: string) {
    this.title = _title;
    this.answers = new Array<string>();
  }

  public async addAnswer(): Promise<void> {
    let answer: string = await ConsoleHandler.text("Enter an answer: ");
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
    let confirm: boolean = await ConsoleHandler.toggle("Do you want to add another Answer?", "yes", "no", false);
    return confirm;
  }
}
