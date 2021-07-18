import { Choice } from "prompts";
import { AbstractStatistic } from "./abstracts/AbstractStatistic";
import { AbstractSurvey } from "./abstracts/AbstractSurvey";
import { AbstractUser } from "./abstracts/AbstractUser";
import { App } from "./App";
import { PromptHandler } from "./PromptHandler";
import { UserDao } from "./UserDao";
import { StatisticDao } from "./StatisticDao";
import { SurveyDao } from "./SurveyDao";
import { Question } from "./Question";
import { Survey } from "./Survey";
import { User } from "./User";

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
      let existingUser: RegisteredUser = UserDao.getInstance().get(this.username);
      this.completedSurveys = existingUser.completedSurveys;
      this.createdSurveys = existingUser.createdSurveys;
    }
  }

  public async createSurvey(): Promise<void> {
    let title: string = await PromptHandler.text("Enter the title of your survey: ");
    let survey: Survey = new Survey(title);
    await survey.setTimeSpan();
    await survey.addQuestion();
    this.createdSurveys.push(survey.uuid);
    UserDao.getInstance().update(this);
  }

  public async showPopularSurveys(): Promise<void> {
    let choices: Choice[] = PromptHandler.createDisabledChoicesRegisteredUser(true, this);
    let answer: string = await PromptHandler.select("Select the survey you want to participate in: ", choices);
    switch (answer) {
      case "return":
      case undefined:
      case "null":
        return;
        break;
      default:
        await this.startSurvey(answer);
        break;
    }
  }

  public async searchSurvey(): Promise<void> {
    let choices: Choice[] = PromptHandler.createDisabledChoicesRegisteredUser(false, this);

    let answer: string = await PromptHandler.autocomplete("Type the name of the survey you want to participate in: ", choices);
    switch (answer) {
      case "disabled":
      case "null":
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

  public async watchPersonalStats(): Promise<void> {
    let completedSurveyCounter: number = this.completedSurveys.length;
    if (completedSurveyCounter === 0) {
      let colorYellow: string = "\x1b[33m";
      console.log(colorYellow + "You didnt complete any surveys yet.");
    } else {
      console.log(`You completed ${completedSurveyCounter} surveys so far:`);
      this.completedSurveys.forEach((id) => {
        let name: string = SurveyDao.getInstance().get(id).title;
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
      surveyArray.push(SurveyDao.getInstance().get(uuid));
      statisticArray.push(StatisticDao.getInstance().get(uuid));
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
    let selectedSurveyIndex: number = parseInt(await PromptHandler.select("choose one of your surveys: ", choices));
    console.log(selectedSurveyIndex);
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
        PromptHandler.logAnswer(answerIndex, question.answers[answerIndex], _statistic.answers[questionIndex][answerIndex], _statistic.completedCounter);
      }
    }
    return;
  }

  public async signOut(): Promise<void> {
    let answer: boolean = await PromptHandler.toggle("Do you really want to sign out?", "yes", "no");
    if (answer) {
      App.user = User.getInstance();
      App.user.completedSurveys = [];
    } else {
      return;
    }
  }

  private async startSurvey(_uuid: string): Promise<void> {
    let survey: AbstractSurvey = SurveyDao.getInstance().get(_uuid);
    let answers: string[] = await this.answerQuestions(survey);
    let statistic: AbstractStatistic = StatisticDao.getInstance().get(_uuid);
    let colorCyan: string = "\x1b[96m";
    console.log(`Thank you for participating in the survey: ${colorCyan + survey.title}`);
    this.updateStatistics(answers, statistic);
  }
  private async answerQuestions(_survey: AbstractSurvey): Promise<string[]> {
    console.log("You are now answering: " + _survey.title);
    let answersForStatistic: string[] = new Array<string>();
    for (let question of _survey.questions) {
      let choices: Choice[] = PromptHandler.toPromptChoices(question);
      let answer: string = await PromptHandler.select(question.title, choices);
      answersForStatistic.push(answer);
    }
    return answersForStatistic;
  }
  private updateStatistics(_answers: string[], _statistic: AbstractStatistic): void {
    for (let index: number = 0; index < _statistic.answers.length; index++) {
      let chosenAnswerIndex: number = parseInt(_answers[index]);
      _statistic.answers[index][chosenAnswerIndex]++;
    }
    _statistic.completedCounter++;
    this.completedSurveys.push(_statistic.uuid);
    StatisticDao.getInstance().update(_statistic);
    UserDao.getInstance().update(this);
  }

  private async continueSearching(): Promise<void> {
    let answer: boolean = await PromptHandler.toggle("do you want to continue searching?", "yes", "no", true);
    if (answer) {
      await this.searchSurvey();
    } else {
      await App.getInstance().goNext();
    }
  }
}
