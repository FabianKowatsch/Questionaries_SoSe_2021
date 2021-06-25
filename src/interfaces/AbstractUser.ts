export interface AbstractUser {
  chooseSurvery(): void;

  searchSurvey(): void;

  watchGlobalStats(): void;

  watchSpecificStats?(): void;

  login?(): void;

  register?(): void;
}
