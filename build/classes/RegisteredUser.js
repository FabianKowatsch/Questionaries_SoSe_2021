"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisteredUser = void 0;
const AbstractUser_1 = require("./abstracts/AbstractUser");
const App_1 = require("./App");
const PromptHandler_1 = require("./PromptHandler");
const Dao_1 = require("./Dao");
const Survey_1 = require("./Survey");
class RegisteredUser extends AbstractUser_1.AbstractUser {
    username;
    password;
    createdSurveys;
    completedSurveys;
    constructor(_username, _password, _new) {
        super();
        this.username = _username;
        this.password = _password;
        if (_new) {
            this.completedSurveys = new Array();
            this.createdSurveys = new Array();
        }
        else {
            let existingUser = Dao_1.Dao.getInstance().getUser(this.username);
            this.completedSurveys = existingUser.completedSurveys;
            this.createdSurveys = existingUser.createdSurveys;
        }
    }
    async createSurvey() {
        let title = await PromptHandler_1.PromptHandler.text("Enter the title of your survey: ");
        let survey = new Survey_1.Survey(title);
        await survey.setTimeSpan();
        await survey.addQuestion();
        this.createdSurveys.push(survey.uuid);
        Dao_1.Dao.getInstance().updateUser(this);
    }
    async showPopularSurveys() {
        let choices = PromptHandler_1.PromptHandler.createDisabledChoicesRegisteredUser(true, this);
        let answer = await PromptHandler_1.PromptHandler.select("Select the survey you want to participate in: ", choices);
        switch (answer) {
            case undefined || "return":
                return;
                break;
            default:
                await this.startSurvey(answer);
                break;
        }
    }
    async searchSurvey() {
        let choices = PromptHandler_1.PromptHandler.createDisabledChoicesRegisteredUser(false, this);
        let answer = await PromptHandler_1.PromptHandler.autocomplete("Type the name of the survey you want to participate in: ", choices);
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
    async watchGlobalStats() {
        let completedSurveyCounter = this.completedSurveys.length;
        if (completedSurveyCounter === 0) {
            let colorYellow = "\x1b[33m";
            console.log(colorYellow + "You didnt complete any surveys yet.");
        }
        else {
            console.log(`You completed ${completedSurveyCounter} surveys in this session:`);
            this.completedSurveys.forEach((id) => {
                let name = Dao_1.Dao.getInstance().getSurvey(id).title;
                console.log(name);
            });
        }
    }
    async watchCreatedSurveys() {
        let choices = new Array();
        let surveyArray = new Array();
        let statisticArray = new Array();
        let colorYellow = "\x1b[33m";
        if (this.createdSurveys.length === 0) {
            console.log(colorYellow + "you havent created any surveys yet");
            return;
        }
        this.createdSurveys.forEach((uuid) => {
            surveyArray.push(Dao_1.Dao.getInstance().getSurvey(uuid));
            statisticArray.push(Dao_1.Dao.getInstance().getStatistic(uuid));
        });
        for (let index = 0; index < surveyArray.length; index++) {
            let completedCounter = statisticArray[index].completedCounter;
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
        let selectedSurveyIndex = parseInt(await PromptHandler_1.PromptHandler.select("choose one of your surveys: ", choices));
        await this.watchSurveyStats(surveyArray[selectedSurveyIndex], statisticArray[selectedSurveyIndex]);
    }
    async watchSurveyStats(_survey, _statistic) {
        let colorYellow = "\x1b[33m";
        let colorCyan = "\x1b[96m";
        console.log(`${colorCyan}title: ${_survey.title}`);
        for (let questionIndex = 0; questionIndex < _survey.questions.length; questionIndex++) {
            let question = _survey.questions[questionIndex];
            console.log(`${colorYellow}${questionIndex + 1}. ${question.title}`);
            for (let answerIndex = 0; answerIndex < question.answers.length; answerIndex++) {
                PromptHandler_1.PromptHandler.logAnswer(answerIndex, question.answers[answerIndex], _statistic.answers[questionIndex][answerIndex], _statistic.completedCounter);
            }
        }
        return;
    }
    async startSurvey(_uuid) {
        let survey = Dao_1.Dao.getInstance().getSurvey(_uuid);
        let answers = await this.answerQuestions(survey);
        let statistic = Dao_1.Dao.getInstance().getStatistic(_uuid);
        this.updateStatistics(answers, statistic);
    }
    async answerQuestions(_survey) {
        console.log("You are now answering: " + _survey.title);
        let answersForStatistic = new Array();
        for (let question of _survey.questions) {
            let choices = PromptHandler_1.PromptHandler.toPromptChoices(question);
            let answer = await PromptHandler_1.PromptHandler.select(question.title, choices);
            answersForStatistic.push(answer);
        }
        return answersForStatistic;
    }
    updateStatistics(_answers, _statistic) {
        for (let index = 0; index < _statistic.answers.length; index++) {
            let chosenAnswerIndex = parseInt(_answers[index]);
            _statistic.answers[index][chosenAnswerIndex]++;
        }
        _statistic.completedCounter++;
        this.completedSurveys.push(_statistic.uuid);
        Dao_1.Dao.getInstance().updateStatistic(_statistic);
        Dao_1.Dao.getInstance().updateUser(this);
    }
    async continueSearching() {
        let answer = await PromptHandler_1.PromptHandler.toggle("do you want to continue searching?", "yes", "no", true);
        if (answer) {
            await this.searchSurvey();
        }
        else {
            await App_1.App.getInstance().goNext();
        }
    }
}
exports.RegisteredUser = RegisteredUser;
//# sourceMappingURL=RegisteredUser.js.map