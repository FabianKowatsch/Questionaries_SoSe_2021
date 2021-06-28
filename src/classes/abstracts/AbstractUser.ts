export abstract class AbstractUser {
  abstract completedSurveys: string[];
  abstract showPopularSurveys(): void;

  abstract searchSurvey(): void;

  abstract watchGlobalStats(): void;

  watchSpecificStats(): void {
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
