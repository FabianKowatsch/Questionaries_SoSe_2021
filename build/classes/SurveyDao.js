"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SurveyDao = void 0;
const FileHandler_1 = require("./FileHandler");
const NullSurvey_1 = require("./NullSurvey");
const StatisticDao_1 = require("./StatisticDao");
class SurveyDao {
    static _instance;
    constructor() { }
    static getInstance() {
        return SurveyDao._instance || (this._instance = new this());
    }
    get(_id) {
        let surveyArray = this.getAll();
        let survey = surveyArray.filter((survey) => survey.uuid == _id)[0];
        survey = survey !== undefined ? survey : new NullSurvey_1.NullSurvey();
        return survey;
    }
    getAll() {
        let surveyArray = FileHandler_1.FileHandler.getInstance().readArrayFile("../data/surveys.json");
        if (surveyArray.length === 0)
            return [new NullSurvey_1.NullSurvey()];
        return surveyArray;
    }
    getMostPopularSurveys() {
        let surveyArray = new Array();
        let statisticArray = StatisticDao_1.StatisticDao.getInstance().getAll();
        statisticArray.sort((a, b) => (a.completedCounter < b.completedCounter ? 1 : b.completedCounter < a.completedCounter ? -1 : 0));
        let maxSurveys = 10;
        if (statisticArray.length < 10)
            maxSurveys = statisticArray.length;
        for (let index = 0; index < maxSurveys; index++) {
            surveyArray.push(this.get(statisticArray[index].uuid));
        }
        return surveyArray;
    }
    update(_survey) {
        let surveyArray = this.getAll();
        surveyArray.forEach((survey) => {
            if (survey.uuid === _survey.uuid) {
                survey.timeSpan = _survey.timeSpan;
                survey.questions = _survey.questions;
            }
        });
        FileHandler_1.FileHandler.getInstance().writeFile("../data/surveys.json", surveyArray);
    }
    add(_survey) {
        let surveyArray = this.getAll();
        surveyArray.push(_survey);
        FileHandler_1.FileHandler.getInstance().writeFile("../data/surveys.json", surveyArray);
    }
}
exports.SurveyDao = SurveyDao;
//# sourceMappingURL=SurveyDao.js.map