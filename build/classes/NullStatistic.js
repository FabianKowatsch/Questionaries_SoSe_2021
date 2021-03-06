"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NullStatistic = void 0;
const AbstractStatistic_1 = require("./abstracts/AbstractStatistic");
class NullStatistic extends AbstractStatistic_1.AbstractStatistic {
    uuid;
    answers;
    completedCounter;
    constructor() {
        super();
        this.uuid = "null";
        this.answers = new Array();
        this.completedCounter = 0;
    }
}
exports.NullStatistic = NullStatistic;
//# sourceMappingURL=NullStatistic.js.map