import { TimeSpan } from "../types/TimeSpan.type";
import { AbstractSurvey } from "./abstracts/AbstractSurvey";
import { Question } from "./Question";
export class NullSurvey extends AbstractSurvey {
  public title: string;
  public uuid: string;
  public timeSpan: TimeSpan;
  public questions: Question[];
  constructor() {
    super();
    this.title = "no Survey was found";
    this.questions = new Array<Question>();
    this.uuid = "null";
    this.timeSpan = { start: new Date(), end: new Date() };
  }
}
