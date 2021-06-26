"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Statistic = void 0;
const AbstractStatistic_1 = require("./abstracts/AbstractStatistic");
//import { v4 as uuidV4 } from "uuid";
class Statistic extends AbstractStatistic_1.AbstractStatistic {
    uuid;
    questions;
    users;
    completedCounter;
    constructor(_uuid, _questions) {
        super();
        this.uuid = _uuid;
        this.questions = _questions;
        this.users = new Array();
        this.completedCounter = 0;
    }
}
exports.Statistic = Statistic;
//# sourceMappingURL=Statistic.js.map