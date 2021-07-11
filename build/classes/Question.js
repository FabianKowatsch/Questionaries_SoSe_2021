"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Question = void 0;
const PromptHandler_1 = require("./PromptHandler");
class Question {
    static _minAnswerAmount = 2;
    static _maxAnswerAmount = 10;
    title;
    answers;
    constructor(_title) {
        this.title = _title;
        this.answers = new Array();
    }
    async addAnswer() {
        let answer = await PromptHandler_1.PromptHandler.text("Enter an answer: ");
        this.answers.push(answer);
        if (this.answers.length < Question._minAnswerAmount) {
            await this.addAnswer();
        }
        else {
            if (this.answers.length < Question._maxAnswerAmount) {
                let confirm = await this.confirmNextAnswer();
                if (confirm) {
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
    async confirmNextAnswer() {
        let confirm = await PromptHandler_1.PromptHandler.toggle("Do you want to add another Answer?", "yes", "no", false);
        return confirm;
    }
}
exports.Question = Question;
//# sourceMappingURL=Question.js.map