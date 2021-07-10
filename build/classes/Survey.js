"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Survey = void 0;
const Question_1 = require("./Question");
const AbstractSurvey_1 = require("./abstracts/AbstractSurvey");
const Dao_1 = require("./Dao");
const uuid_1 = require("uuid");
const Statistic_1 = require("./Statistic");
const ConsoleHandler_1 = require("./ConsoleHandler");
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
        let title = await ConsoleHandler_1.ConsoleHandler.text("Enter a question you want to add: ");
        let question = new Question_1.Question(title);
        await question.addAnswer();
        this.questions.push(question);
        if (this.questions.length < Survey._minQuestionAmount) {
            await this.addQuestion();
            return;
        }
        else {
            let answer = await ConsoleHandler_1.ConsoleHandler.toggle("Do you want to finish the Survey?", "yes", "no");
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
        this.timeSpan = await ConsoleHandler_1.ConsoleHandler.timeSpan();
    }
    upload() {
        Dao_1.Dao.getInstance().addSurvey(this);
        let answers = new Array();
        this.questions.forEach((question) => {
            let initial = new Array(question.answers.length);
            for (let index = 0; index < initial.length; index++) {
                initial[index] = 0;
            }
            answers.push(initial);
        });
        Dao_1.Dao.getInstance().addStatistic(new Statistic_1.Statistic(this.uuid, answers));
    }
}
exports.Survey = Survey;
//# sourceMappingURL=Survey.js.map