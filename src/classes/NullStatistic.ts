import { AbstractStatistic } from "./abstracts/AbstractStatistic";
import { Question } from "./Question";
export class NullStatistic extends AbstractStatistic {
  public uuid: string;
  public questions: Question[];
  public users: string[];
  public completedCounter: number;
  constructor() {
    super();
    this.uuid = "0";
    this.questions = new Array<Question>();
    this.users = new Array<string>();
    this.completedCounter = 0;
  }
}
