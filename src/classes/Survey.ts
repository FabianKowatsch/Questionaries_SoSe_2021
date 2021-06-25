import { Question } from "./Question";
import { TimeSpan } from "../types/TimeSpan.type";
import { AbstractSurvey } from "./abstracts/AbstractSurvey";
export class Survey extends AbstractSurvey {
  public title: string;
  public timeSpan: TimeSpan;
  public questions: Question[];
  constructor(_title: string, _startDate: Date, _endDate: Date, _questions: Question[]) {
    super();
    this.title = _title;
    this.timeSpan = { start: _startDate, end: _endDate };
    this.questions = _questions;
  }
  public isNull(): boolean {
    return false;
  }
}
