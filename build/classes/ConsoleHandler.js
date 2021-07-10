"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConsoleHandler = void 0;
const prompts_1 = __importDefault(require("prompts"));
class ConsoleHandler {
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
}
exports.ConsoleHandler = ConsoleHandler;
//# sourceMappingURL=ConsoleHandler.js.map