import { Question } from "../Question";

export abstract class AbstractStatistic {
  abstract uuid: string;
  abstract questions: Question[];
  abstract users: string[];
  abstract completedCounter: number;
}
