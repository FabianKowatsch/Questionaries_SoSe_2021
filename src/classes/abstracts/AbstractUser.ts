import { AbstractStatistic } from "./AbstractStatistic";
import { AbstractSurvey } from "./AbstractSurvey";

export abstract class AbstractUser {
  abstract completedSurveys: string[];
  abstract showPopularSurveys(): void;

  abstract searchSurvey(): void;

  abstract watchGlobalStats(): void;

  watchCreatedSurveys(): void {
    return;
  }
  watchSurveyStats(_survey: AbstractSurvey, _statistic: AbstractStatistic): void {
    return;
  }
  createSurvey(): void {
    return;
  }

  login(): void {
    return;
  }

  register(): void {
    return;
  }
}
