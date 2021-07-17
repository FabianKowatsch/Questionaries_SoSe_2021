"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Survey = void 0;
const Question_1 = require("./Question");
const AbstractSurvey_1 = require("./abstracts/AbstractSurvey");
const SurveyDao_1 = require("./SurveyDao");
const StatisticDao_1 = require("./StatisticDao");
const uuid_1 = require("uuid");
const Statistic_1 = require("./Statistic");
const PromptHandler_1 = require("./PromptHandler");
class Survey extends AbstractSurvey_1.AbstractSurvey {
    static _minQuestionAmount = 5;
    title;
    uuid;
    timeSpan;
    questions;
    constructor(_title) {
        super();
        this.title = _title;
        this.questions = new Array();
        this.uuid = uuid_1.v4();
    }
    async addQuestion() {
        let title = await PromptHandler_1.PromptHandler.text("Enter a question you want to add: ");
        let question = new Question_1.Question(title);
        await question.addAnswer();
        this.questions.push(question);
        if (this.questions.length < Survey._minQuestionAmount) {
            await this.addQuestion();
            return;
        }
        else {
            let answer = await PromptHandler_1.PromptHandler.toggle("Do you want to finish the Survey?", "yes", "no");
            if (answer) {
                await this.upload();
                return;
            }
            else {
                await this.addQuestion();
                return;
            }
        }
    }
    async setTimeSpan() {
        this.timeSpan = await PromptHandler_1.PromptHandler.timeSpan();
    }
    upload() {
        SurveyDao_1.SurveyDao.getInstance().add(this);
        let answers = new Array();
        this.questions.forEach((question) => {
            let initial = new Array(question.answers.length);
            for (let index = 0; index < initial.length; index++) {
                initial[index] = 0;
            }
            answers.push(initial);
        });
        StatisticDao_1.StatisticDao.getInstance().add(new Statistic_1.Statistic(this.uuid, answers));
    }
}
exports.Survey = Survey;
//# sourceMappingURL=Survey.js.map