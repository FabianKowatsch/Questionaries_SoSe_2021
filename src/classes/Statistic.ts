import { AbstractStatistic } from "./abstracts/AbstractStatistic";

//import { v4 as uuidV4 } from "uuid";
export class Statistic extends AbstractStatistic {
  public uuid: string;
  public answers: number[][];
  public completedCounter: number;

  constructor(_uuid: string, _answers: number[][]) {
    super();
    this.uuid = _uuid;
    this.completedCounter = 0;
    this.answers = _answers;
  }
}
