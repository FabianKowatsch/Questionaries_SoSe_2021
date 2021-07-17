import { Dao } from "../interfaces/Dao";
import { AbstractStatistic } from "./abstracts/AbstractStatistic";
import { FileHandler } from "./FileHandler";
import { NullStatistic } from "./NullStatistic";
import { Statistic } from "./Statistic";

export class StatisticDao implements Dao<AbstractStatistic> {
  private static _instance: StatisticDao;
  private constructor() {}
  public static getInstance(): StatisticDao {
    return StatisticDao._instance || (this._instance = new this());
  }
  public get(_id: string): AbstractStatistic {
    let statisticArray: AbstractStatistic[] = this.getAll();
    let statistic: AbstractStatistic = statisticArray.filter((statistic) => statistic.uuid === _id)[0];
    statistic = statistic !== undefined ? statistic : new NullStatistic();
    return statistic;
  }

  public getAll(): AbstractStatistic[] {
    let statisticArray: AbstractStatistic[] = FileHandler.getInstance().readArrayFile("../data/statistics.json");
    if (statisticArray.length === 0) return [new NullStatistic()];
    return statisticArray;
  }

  public update(_statistic: AbstractStatistic): void {
    let statisticArray: AbstractStatistic[] = this.getAll();
    statisticArray.forEach((statistic) => {
      if (statistic.uuid === _statistic.uuid) {
        statistic.answers = _statistic.answers;
        statistic.completedCounter = _statistic.completedCounter;
      }
    });
    FileHandler.getInstance().writeFile("../data/statistics.json", statisticArray);
  }

  public add(_statistic: Statistic): void {
    let statisticArray: Statistic[] = this.getAll();
    statisticArray.push(_statistic);
    FileHandler.getInstance().writeFile("../data/statistics.json", statisticArray);
  }
}
