"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatisticDao = void 0;
const FileHandler_1 = require("./FileHandler");
const NullStatistic_1 = require("./NullStatistic");
class StatisticDao {
    static _instance;
    constructor() { }
    static getInstance() {
        return StatisticDao._instance || (this._instance = new this());
    }
    get(_id) {
        let statisticArray = this.getAll();
        let statistic = statisticArray.filter((statistic) => statistic.uuid === _id)[0];
        statistic = statistic !== undefined ? statistic : new NullStatistic_1.NullStatistic();
        return statistic;
    }
    getAll() {
        let statisticArray = FileHandler_1.FileHandler.getInstance().readArrayFile("../data/statistics.json");
        if (statisticArray.length === 0)
            return [new NullStatistic_1.NullStatistic()];
        return statisticArray;
    }
    update(_statistic) {
        let statisticArray = this.getAll();
        statisticArray.forEach((statistic) => {
            if (statistic.uuid === _statistic.uuid) {
                statistic.answers = _statistic.answers;
                statistic.completedCounter = _statistic.completedCounter;
            }
        });
        FileHandler_1.FileHandler.getInstance().writeFile("../data/statistics.json", statisticArray);
    }
    add(_statistic) {
        let statisticArray = this.getAll();
        statisticArray.push(_statistic);
        FileHandler_1.FileHandler.getInstance().writeFile("../data/statistics.json", statisticArray);
    }
}
exports.StatisticDao = StatisticDao;
//# sourceMappingURL=StatisticDao.js.map