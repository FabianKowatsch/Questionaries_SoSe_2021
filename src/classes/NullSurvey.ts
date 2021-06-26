import { TimeSpan } from "../types/TimeSpan.type";
import { AbstractSurvey } from "./abstracts/AbstractSurvey";
import { Question } from "./Question";
export class NullSurvey extends AbstractSurvey {
  public title: string;
  public uuid: string;
  public timeSpan: TimeSpan;
  public questions: Question[];
  public creator: string;
  constructor() {
    super();
    this.title = "null";
    this.questions = new Array<Question>();
    this.creator = "null";
    this.uuid = "null";
    this.timeSpan = { start: new Date(), end: new Date() };
  }
}
