"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Dao = void 0;
const FileHandler_1 = require("./FileHandler");
const NullStatistic_1 = require("./NullStatistic");
class Dao {
    static _instance;
    constructor() { }
    static getInstance() {
        return Dao._instance || (this._instance = new this());
    }
    getAllStatistics() {
        let statisticArray = FileHandler_1.FileHandler.getInstance().readArrayFile("../data/statistics.json");
        return statisticArray;
    }
    getStatistic(_id) {
        let statisticArray = this.getAllStatistics();
        let statistic = statisticArray.filter((statistic) => statistic.uuid === _id)[0];
        statistic = statistic !== undefined ? statistic : new NullStatistic_1.NullStatistic();
        return statistic;
    }
    updateStatistic(_statistic) {
        let statisticArray = this.getAllStatistics();
        statisticArray.forEach((statistic) => {
            if (statistic.uuid === _statistic.uuid) {
                statistic.users = _statistic.users;
                statistic.questions = _statistic.questions;
                statistic.completedCounter = _statistic.completedCounter;
            }
        });
        FileHandler_1.FileHandler.getInstance().writeFile("../data/statistics.json", statisticArray);
    }
    addStatistic(_statistic) {
        let statisticArray = this.getAllStatistics();
        statisticArray.push(_statistic);
        FileHandler_1.FileHandler.getInstance().writeFile("../data/statistics.json", statisticArray);
    }
    getSurvey(_id) {
        let surveyArray = this.getAllSurveys();
        let survey = surveyArray.filter((survey) => survey.uuid == _id)[0];
        return survey;
    }
    getAllSurveys() {
        let surveyArray = FileHandler_1.FileHandler.getInstance().readArrayFile("../data/surveys.json");
        return surveyArray;
    }
    addSurvey(_survey) {
        let surveyArray = this.getAllSurveys();
        surveyArray.push(_survey);
        FileHandler_1.FileHandler.getInstance().writeFile("../data/surveys.json", surveyArray);
    }
}
exports.Dao = Dao;
//# sourceMappingURL=Dao.js.map