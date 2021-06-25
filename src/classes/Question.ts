import { Answer } from "../types/Answer.type";
export class Question {
  public title: string;
  public answers: string[];
  constructor(_title: string, _answers: string[]) {
    this.title = _title;
    this.answers = _answers;
  }
}
