"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NullSurvey = void 0;
const AbstractSurvey_1 = require("./abstracts/AbstractSurvey");
class NullSurvey extends AbstractSurvey_1.AbstractSurvey {
    title;
    uuid;
    timeSpan;
    questions;
    constructor() {
        super();
        this.title = "no Survey was found";
        this.questions = new Array();
        this.uuid = "null";
        this.timeSpan = { start: new Date(), end: new Date() };
    }
}
exports.NullSurvey = NullSurvey;
//# sourceMappingURL=NullSurvey.js.map