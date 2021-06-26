"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NullStatistic = void 0;
const AbstractStatistic_1 = require("./abstracts/AbstractStatistic");
class NullStatistic extends AbstractStatistic_1.AbstractStatistic {
    uuid;
    questions;
    users;
    completedCounter;
    constructor() {
        super();
        this.uuid = "0";
        this.questions = new Array();
        this.users = new Array();
        this.completedCounter = 0;
    }
}
exports.NullStatistic = NullStatistic;
//# sourceMappingURL=NullStatistic.js.map