import { AbstractStatistic } from "./abstracts/AbstractStatistic";
export class NullStatistic extends AbstractStatistic {
  public uuid: string;
  public answers: number[][];
  public completedCounter: number;
  constructor() {
    super();
    this.uuid = "null";
    this.answers = new Array<number[]>();
    this.completedCounter = 0;
  }
}
