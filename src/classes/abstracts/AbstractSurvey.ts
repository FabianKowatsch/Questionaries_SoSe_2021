import { TimeSpan } from "../../types/TimeSpan.type";
import { Question } from "../Question";

export abstract class AbstractSurvey {
  abstract title: string;
  abstract uuid: string;
  abstract timeSpan: TimeSpan;
  abstract questions: Question[];
  abstract creator: string;
}
