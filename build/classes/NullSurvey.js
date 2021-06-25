"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NullSurvey = void 0;
const AbstractSurvey_1 = require("./abstracts/AbstractSurvey");
class NullSurvey extends AbstractSurvey_1.AbstractSurvey {
    constructor() {
        super();
    }
    isNull() {
        return true;
    }
}
exports.NullSurvey = NullSurvey;
//# sourceMappingURL=NullSurvey.js.map