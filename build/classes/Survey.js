"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Survey = void 0;
const AbstractSurvey_1 = require("./abstracts/AbstractSurvey");
class Survey extends AbstractSurvey_1.AbstractSurvey {
    title;
    timeSpan;
    questions;
    constructor(_title, _startDate, _endDate, _questions) {
        super();
        this.title = _title;
        this.timeSpan = { start: _startDate, end: _endDate };
        this.questions = _questions;
    }
    isNull() {
        return false;
    }
}
exports.Survey = Survey;
//# sourceMappingURL=Survey.js.map