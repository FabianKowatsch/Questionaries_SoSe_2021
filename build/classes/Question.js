"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Question = void 0;
const prompts_1 = __importDefault(require("prompts"));
class Question {
    static minAnswerAmount = 2;
    static maxAnswerAmount = 10;
    title;
    answers;
    constructor(_title) {
        this.title = _title;
        this.answers = new Array();
    }
    async addAnswer() {
        console.log(this.answers.length);
        let name = await prompts_1.default({
            type: "text",
            name: "value",
            message: "Enter an answer: "
        });
        let answer = { name: name.value, count: 0 };
        this.answers.push(answer);
        if (this.answers.length < Question.minAnswerAmount) {
            await this.addAnswer();
        }
        else {
            if (this.answers.length < Question.maxAnswerAmount) {
                let confirm = await prompts_1.default({
                    type: "confirm",
                    name: "value",
                    message: "Do you want to add another Answer?",
                    initial: true
                });
                if (confirm.value) {
                    await this.addAnswer();
                }
                else {
                    return;
                }
            }
            else {
                return;
            }
        }
    }
}
exports.Question = Question;
//# sourceMappingURL=Question.js.map