import { AbstractStatistic } from "./abstracts/AbstractStatistic";
import { Question } from "./Question";

//import { v4 as uuidV4 } from "uuid";
export class Statistic extends AbstractStatistic {
  public uuid: string;
  public questions: Question[];
  public completedCounter: number;

  constructor(_uuid: string, _questions: Question[]) {
    super();
    this.uuid = _uuid;
    this.completedCounter = 0;
  }
}
