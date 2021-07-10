import { Choice } from "prompts";
import { AbstractStatistic } from "./abstracts/AbstractStatistic";
import { AbstractSurvey } from "./abstracts/AbstractSurvey";
import { AbstractUser } from "./abstracts/AbstractUser";
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
    let survey: Survey = new Survey(title, this.username);
    await survey.setTimeSpan();
    await survey.addQuestion();
    this.createdSurveys.push(survey.uuid);
    Dao.getInstance().updateUser(this);
  }

  public showPopularSurveys(): void {
    return;
  }

  public searchSurvey(): void {
    return;
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
}
