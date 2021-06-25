"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Survey = void 0;
const Question_1 = require("./Question");
const AbstractSurvey_1 = require("./abstracts/AbstractSurvey");
const prompts_1 = __importDefault(require("prompts"));
const FileHandler_1 = require("./FileHandler");
const App_1 = require("./App");
class Survey extends AbstractSurvey_1.AbstractSurvey {
    static minQuestionAmount = 5;
    title;
    timeSpan;
    questions;
    creator;
    constructor(_title, _startDate, _endDate, _creator) {
        super();
        this.title = _title;
        this.timeSpan = { start: _startDate, end: _endDate };
        this.questions = new Array();
        this.creator = _creator;
    }
    isNull() {
        return false;
    }
    async addQuestion() {
        let title = await prompts_1.default({
            type: "text",
            name: "value",
            message: "Enter the question you want to add: "
        });
        let question = new Question_1.Question(title.value);
        await question.addAnswer();
        this.questions.push(question);
        if (this.questions.length < Survey.minQuestionAmount) {
            await this.addQuestion();
            return;
        }
        else {
            let answer = await prompts_1.default({
                type: "confirm",
                name: "value",
                message: "Do you want to finish the Survey?",
                initial: false
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
    upload() {
        let surveyArray = FileHandler_1.FileHandler.getInstance().readArrayFile("../data/surveys.json");
        surveyArray.push(this);
        FileHandler_1.FileHandler.getInstance().writeFile("../data/surveys.json", surveyArray);
        App_1.App.getInstance().showMethods();
    }
}
exports.Survey = Survey;
//# sourceMappingURL=Survey.js.map