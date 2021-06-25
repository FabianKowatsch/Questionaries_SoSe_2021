import { AbstractSurvey } from "./abstracts/AbstractSurvey";
export class NullSurvey extends AbstractSurvey {
  constructor() {
    super();
  }
  public isNull(): boolean {
    return true;
  }
}
