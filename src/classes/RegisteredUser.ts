import { Choice } from "prompts";
import { AbstractStatistic } from "./abstracts/AbstractStatistic";
import { AbstractSurvey } from "./abstracts/AbstractSurvey";
import { AbstractUser } from "./abstracts/AbstractUser";
import { App } from "./App";
import { ConsoleHandler } from "./ConsoleHandler";
import { Dao } from "./Dao";
import { Question } from "./Question";
import { Survey } from "./Survey";

export class RegisteredUser extends AbstractUser {
  public username: string;
  public password: string;
  public createdSurveys: string[];
  public completedSurveys: string[];
  constructor(_username: string, _password: string, _new: boolean) {
    super();
    this.username = _username;
    this.password = _password;
    if (_new) {
      this.completedSurveys = new Array<string>();
      this.createdSurveys = new Array<string>();
    } else {
      let existingUser: RegisteredUser = Dao.getInstance().getUser(this.username);
      this.completedSurveys = existingUser.completedSurveys;
      this.createdSurveys = existingUser.createdSurveys;
    }
  }

  public async createSurvey(): Promise<void> {
    let title: string = await ConsoleHandler.text("Enter the title of your survey: ");
    let survey: Survey = new Survey(title);
    await survey.setTimeSpan();
    await survey.addQuestion();
    this.createdSurveys.push(survey.uuid);
    Dao.getInstance().updateUser(this);
  }

  public async showPopularSurveys(): Promise<void> {
    let choices: Choice[] = this.createChoicesWithRestrictions(true);
    let answer: string = await ConsoleHandler.select("Select the survey you want to participate in: ", choices);
    switch (answer) {
      case undefined || "return":
        return;
        break;
      default:
        await this.startSurvey(answer);
        break;
    }
  }

  public async searchSurvey(): Promise<void> {
    let choices: Choice[] = this.createChoicesWithRestrictions(false);

    let answer: string = await ConsoleHandler.autocomplete("Type the name of the survey you want to participate in: ", choices);
    switch (answer) {
      case "disabled":
        console.log("the answer you chose is not available.");
        await this.continueSearching();
        break;
      case undefined:
        console.log("no matches, try again.");
        await this.continueSearching();
        break;
      default:
        await this.startSurvey(answer);
        break;
    }
  }

  public async watchGlobalStats(): Promise<void> {
    let completedSurveyCounter: number = this.completedSurveys.length;
    if (completedSurveyCounter === 0) {
      let colorYellow: string = "\x1b[33m";
      console.log(colorYellow + "You didnt complete any surveys yet.");
    } else {
      console.log(`You completed ${completedSurveyCounter} surveys in this session:`);
      this.completedSurveys.forEach((id) => {
        let name: string = Dao.getInstance().getSurvey(id).title;
        console.log(name);
      });
    }
  }
  public async watchCreatedSurveys(): Promise<void> {
    let choices: Choice[] = new Array<Choice>();
    let surveyArray: AbstractSurvey[] = new Array<AbstractSurvey>();
    let statisticArray: AbstractStatistic[] = new Array<AbstractStatistic>();
    let colorYellow: string = "\x1b[33m";
    if (this.createdSurveys.length === 0) {
      console.log(colorYellow + "you havent created any surveys yet");
      return;
    }
    this.createdSurveys.forEach((uuid) => {
      surveyArray.push(Dao.getInstance().getSurvey(uuid));
      statisticArray.push(Dao.getInstance().getStatistic(uuid));
    });
    for (let index: number = 0; index < surveyArray.length; index++) {
      let completedCounter: number = statisticArray[index].completedCounter;
      if (completedCounter > 0) {
        choices.push({
          title: surveyArray[index].title + colorYellow + `, completed ${completedCounter} times`,
          value: index
        });
      }
    }
    if (choices.length === 0) {
      console.log(colorYellow + "your surveys havent been completed yet");
      return;
    }
    let selectedSurveyIndex: number = parseInt(await ConsoleHandler.select("choose one of your surveys: ", choices));
    await this.watchSurveyStats(surveyArray[selectedSurveyIndex], statisticArray[selectedSurveyIndex]);
  }

  public async watchSurveyStats(_survey: AbstractSurvey, _statistic: AbstractStatistic): Promise<void> {
    let colorYellow: string = "\x1b[33m";
    let colorCyan: string = "\x1b[96m";
    console.log(`${colorCyan}title: ${_survey.title}`);
    for (let questionIndex: number = 0; questionIndex < _survey.questions.length; questionIndex++) {
      let question: Question = _survey.questions[questionIndex];
      console.log(`${colorYellow}${questionIndex + 1}. ${question.title}`);
      for (let answerIndex: number = 0; answerIndex < question.answers.length; answerIndex++) {
        ConsoleHandler.logAnswer(answerIndex, question.answers[answerIndex], _statistic.answers[questionIndex][answerIndex], _statistic.completedCounter);
      }
    }
    return;
  }

  private async startSurvey(_uuid: string): Promise<void> {
    let survey: AbstractSurvey = Dao.getInstance().getSurvey(_uuid);
    let answers: string[] = await this.answerQuestions(survey);
    let statistic: AbstractStatistic = Dao.getInstance().getStatistic(_uuid);
    this.updateStatistics(answers, statistic);
  }
  private async answerQuestions(_survey: AbstractSurvey): Promise<string[]> {
    console.log("You are now answering: " + _survey.title);
    let answersForStatistic: string[] = new Array<string>();
    for (let question of _survey.questions) {
      let choices: Choice[] = this.toPromptChoices(question);
      let answer: string = await ConsoleHandler.select(question.title, choices);
      answersForStatistic.push(answer);
    }
    return answersForStatistic;
  }
  private toPromptChoices(_question: Question): Choice[] {
    let choices: Choice[] = new Array<Choice>();
    _question.answers.forEach((answer) => {
      choices.push({ title: answer });
    });
    return choices;
  }
  private updateStatistics(_answers: string[], _statistic: AbstractStatistic): void {
    for (let index: number = 0; index < _statistic.answers.length; index++) {
      let chosenAnswerIndex: number = parseInt(_answers[index]);
      _statistic.answers[index][chosenAnswerIndex]++;
    }
    _statistic.completedCounter++;
    this.completedSurveys.push(_statistic.uuid);
    Dao.getInstance().updateStatistic(_statistic);
  }

  private createChoicesWithRestrictions(_popularOnly: boolean): Choice[] {
    let flagRed: string = "\x1b[31m";
    let choices: Choice[] = new Array<Choice>();
    let surveyArray: AbstractSurvey[];
    if (_popularOnly) {
      surveyArray = Dao.getInstance().getMostPopularSurveys();
    } else {
      surveyArray = Dao.getInstance().getAllSurveys();
    }
    surveyArray.forEach((survey) => {
      let dateStart: Date = new Date(survey.timeSpan.start);
      let dateEnd: Date = new Date(survey.timeSpan.end);
      if (this.surveyIsByUser(survey.uuid)) {
        choices.push({
          title: flagRed + survey.title + (_popularOnly ? ` (locked, survey was created by you)` : ""),
          value: "disabled",
          disabled: true,
          description: `locked, survey was created by you`
        });
      } else if (dateStart.getTime() > Date.now()) {
        choices.push({
          title: flagRed + survey.title + (_popularOnly ? ` (locked, starting date: ${survey.timeSpan.start})` : ""),
          value: "disabled",
          disabled: true,
          description: `locked, starting date: ${survey.timeSpan.start}`
        });
      } else if (dateEnd.getTime() <= Date.now()) {
        choices.push({
          title: flagRed + survey.title + (_popularOnly ? ` (locked, terminating date: ${survey.timeSpan.end})` : ""),
          value: "disabled",
          disabled: true,
          description: `locked, terminating date: ${survey.timeSpan.end}`
        });
      } else {
        choices.push({ title: survey.title, value: survey.uuid });
      }
    });
    if (_popularOnly) {
      choices.push({ title: "\x1b[33mreturn to menu", value: "return" });
    }
    return choices;
  }

  private surveyIsByUser(_uuid: string): boolean {
    for (const id of this.createdSurveys) {
      if (id === _uuid) return true;
    }
    return false;
  }

  private async continueSearching(): Promise<void> {
    let answer: boolean = await ConsoleHandler.toggle("do you want to continue searching?", "yes", "no", true);
    if (answer) {
      await this.searchSurvey();
    } else {
      await App.getInstance().goNext();
    }
  }
}
