"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PromptHandler = void 0;
const prompts_1 = __importDefault(require("prompts"));
const SurveyDao_1 = require("./SurveyDao");
class PromptHandler {
    static async select(_message, _choices, _initial = 1) {
        let answer = await prompts_1.default({
            type: "select",
            name: "value",
            message: _message,
            choices: _choices,
            initial: _initial
        });
        return answer.value;
    }
    static async autocomplete(_message, _choices) {
        let answer = await prompts_1.default({
            type: "autocomplete",
            name: "value",
            message: _message,
            choices: _choices,
            suggest: (input, choices) => Promise.resolve(choices.filter((survey) => survey.title.slice(0, input.length) === input))
        });
        return answer.value;
    }
    static async text(_message) {
        let answer = await prompts_1.default({
            type: "text",
            name: "value",
            message: _message
        });
        if (answer.value === null)
            return " ";
        return answer.value;
    }
    static async password(_message) {
        let password = await prompts_1.default({
            type: "password",
            name: "value",
            message: _message
        });
        if (password.value === null)
            return "";
        return password.value;
    }
    static async toggle(_message, _active, _inactive, _initial = true) {
        let answer = await prompts_1.default({
            type: "toggle",
            name: "value",
            message: _message,
            initial: _initial,
            active: _active,
            inactive: _inactive
        });
        return answer.value;
    }
    static async timeSpan() {
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
        return { start: timeStart.value, end: timeEnd.value };
    }
    static logAnswer(_index, _answer, _counter, _total) {
        let colorDefault = "\x1b[0m";
        let percentage = Math.round((_counter / _total) * 100);
        let barArray = new Array(10);
        for (let index = 0; index < barArray.length; index++) {
            if (index < Math.round(percentage / 10)) {
                barArray[index] = "\u25AE";
            }
            else
                barArray[index] = "\u25AF";
        }
        let bar = barArray.join("");
        console.log(`${colorDefault}${_index + 1}. ${_answer}\t${bar}  ${percentage}% | ${_counter}`);
    }
    static toPromptChoices(_question) {
        let choices = new Array();
        _question.answers.forEach((answer) => {
            choices.push({ title: answer });
        });
        return choices;
    }
    static createDisabledChoicesRegisteredUser(_popularOnly, _user) {
        let colorRed = "\x1b[31m";
        let choices = new Array();
        let surveyArray;
        if (_popularOnly) {
            surveyArray = SurveyDao_1.SurveyDao.getInstance().getMostPopularSurveys();
        }
        else {
            surveyArray = SurveyDao_1.SurveyDao.getInstance().getAll();
        }
        surveyArray.forEach((survey) => {
            if (PromptHandler.userCompletedOrCreatedSurvey(survey.uuid, _user.createdSurveys)) {
                choices.push({
                    title: colorRed + survey.title + (_popularOnly ? ` (locked, survey was created by you)` : ""),
                    value: "disabled",
                    disabled: true,
                    description: `locked, survey was created by you`
                });
            }
            else if (PromptHandler.userCompletedOrCreatedSurvey(survey.uuid, _user.completedSurveys)) {
                choices.push({
                    title: colorRed + survey.title + (_popularOnly ? ` (locked, you already completed this survey)` : ""),
                    value: "disabled",
                    disabled: true,
                    description: `locked, you already completed this survey`
                });
            }
            else {
                choices.push(PromptHandler.choiceRestrictedByDate(_popularOnly, survey));
            }
        });
        if (_popularOnly) {
            choices.push({ title: "\x1b[33mreturn to menu", value: "return" });
        }
        return choices;
    }
    static createDisabledChoicesUser(_popularOnly, _user) {
        let colorRed = "\x1b[31m";
        let choices = new Array();
        let surveyArray;
        if (_popularOnly) {
            surveyArray = SurveyDao_1.SurveyDao.getInstance().getMostPopularSurveys();
        }
        else {
            surveyArray = SurveyDao_1.SurveyDao.getInstance().getAll();
        }
        surveyArray.forEach((survey) => {
            if (PromptHandler.userCompletedOrCreatedSurvey(survey.uuid, _user.completedSurveys)) {
                choices.push({
                    title: colorRed + survey.title + (_popularOnly ? ` (locked, you already completed this survey)` : ""),
                    value: "disabled",
                    disabled: true,
                    description: `locked, you already completed this survey`
                });
            }
            else {
                choices.push(PromptHandler.choiceRestrictedByDate(_popularOnly, survey));
            }
        });
        if (_popularOnly) {
            choices.push({ title: "\x1b[33mreturn to menu", value: "return" });
        }
        return choices;
    }
    static choiceRestrictedByDate(_popularOnly, _survey) {
        let dateStart = new Date(_survey.timeSpan.start);
        let dateEnd = new Date(_survey.timeSpan.end);
        let colorRed = "\x1b[31m";
        let choice;
        if (dateStart.getTime() > Date.now()) {
            choice = {
                title: colorRed + _survey.title + (_popularOnly ? ` (locked, starting date: ${_survey.timeSpan.start})` : ""),
                value: "disabled",
                disabled: true,
                description: `locked, starting date: ${_survey.timeSpan.start}`
            };
        }
        else if (dateEnd.getTime() <= Date.now()) {
            choice = {
                title: colorRed + _survey.title + (_popularOnly ? ` (locked, terminating date: ${_survey.timeSpan.end})` : ""),
                value: "disabled",
                disabled: true,
                description: `locked, terminating date: ${_survey.timeSpan.end}`
            };
        }
        else {
            choice = { title: _survey.title, value: _survey.uuid };
        }
        return choice;
    }
    static userCompletedOrCreatedSurvey(_uuid, _surveys) {
        for (const id of _surveys) {
            if (id === _uuid)
                return true;
        }
        return false;
    }
}
exports.PromptHandler = PromptHandler;
//# sourceMappingURL=PromptHandler.js.map