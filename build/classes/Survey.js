"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Survey = void 0;
const Question_1 = require("./Question");
const AbstractSurvey_1 = require("./abstracts/AbstractSurvey");
const prompts_1 = __importDefault(require("prompts"));
const Dao_1 = require("./Dao");
const uuid_1 = require("uuid");
const Statistic_1 = require("./Statistic");
class Survey extends AbstractSurvey_1.AbstractSurvey {
    static _minQuestionAmount = 5;
    title;
    uuid;
    timeSpan;
    questions;
    creator;
    constructor(_title, _creator) {
        super();
        this.title = _title;
        this.questions = new Array();
        this.creator = _creator;
        this.uuid = uuid_1.v4();
    }
    isNull() {
        return false;
    }
    async addQuestion() {
        let title = await prompts_1.default({
            type: "text",
            name: "value",
            message: "Enter a question you want to add: "
        });
        let question = new Question_1.Question(title.value);
        await question.addAnswer();
        this.questions.push(question);
        if (this.questions.length < Survey._minQuestionAmount) {
            await this.addQuestion();
            return;
        }
        else {
            let answer = await prompts_1.default({
                type: "toggle",
                name: "value",
                message: "Do you want to finish the Survey?",
                initial: false,
                active: "yes",
                inactive: "no"
            });
            if (answer.value) {
                await this.upload();
                return;
            }
            else {
                await this.addQuestion();
                return;
            }
        }
    }
    async addTimeSpan() {
        let yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        let timeStart = await prompts_1.default({
            type: "date",
            name: "value",
            message: "Enter the starting date of the survey ( format: D.M.YYYY): ",
            mask: "D.M.YYYY",
            validate: (date) => (date < yesterday.getTime() ? "Dont select past dates" : true)
        });
        let timeEnd = await prompts_1.default({
            type: "date",
            name: "value",
            message: "Enter the terminating date of the survey ( format: D.M.YYYY): ",
            mask: "D.M.YYYY",
            validate: (date) => (timeStart.value > date ? "Make sure your selected date is after your previous date" : true)
        });
        this.timeSpan = { start: timeStart.value, end: timeEnd.value };
    }
    upload() {
        Dao_1.Dao.getInstance().addSurvey(this);
        Dao_1.Dao.getInstance().addStatistic(new Statistic_1.Statistic(this.uuid, this.questions));
    }
}
exports.Survey = Survey;
//# sourceMappingURL=Survey.js.map