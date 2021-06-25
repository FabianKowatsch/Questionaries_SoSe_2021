export abstract class AbstractUser {
  abstract showLatestSurveys(): void;

  abstract searchSurvey(): void;

  abstract watchGlobalStats(): void;

  watchSpecificStats(): void {
    return;
  }

  login(): void {
    return;
  }

  register(): void {
    return;
  }
}
