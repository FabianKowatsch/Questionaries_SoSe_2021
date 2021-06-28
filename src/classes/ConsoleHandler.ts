import prompts, { Answers, Choice } from "prompts";
import { TimeSpan } from "../types/TimeSpan.type";
export class ConsoleHandler {
  public static async select(_message: string, _choices: Choice[], _initial: number = 1): Promise<string> {
    let answer: Answers<string> = await prompts({
      type: "select",
      name: "value",
      message: _message,
      choices: _choices,
      initial: _initial
    });

    return answer.value;
  }

  public static async autocomplete(_message: string, _choices: Choice[]): Promise<string> {
    let answer: Answers<string> = await prompts({
      type: "autocomplete",
      name: "value",
      message: _message,
      choices: _choices,
      suggest: (input: string, choices: Choice[]) => Promise.resolve(choices.filter((survey) => survey.title.slice(0, input.length) === input))
    });
    return answer.value;
  }
  public static async text(_message: string): Promise<string> {
    let answer: Answers<string> = await prompts({
      type: "text",
      name: "value",
      message: _message
    });
    return answer.value;
  }

  public static async password(_message: string): Promise<string> {
    let password: Answers<string> = await prompts({
      type: "password",
      name: "value",
      message: _message
    });
    return password.value;
  }

  public static async toggle(_message: string, _active: string, _inactive: string, _initial: boolean = true): Promise<boolean> {
    let answer: Answers<string> = await prompts({
      type: "toggle",
      name: "value",
      message: _message,
      initial: _initial,
      active: _active,
      inactive: _inactive
    });

    return answer.value;
  }

  public static async timeSpan(): Promise<TimeSpan> {
    let yesterday: Date = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    let timeStart: Answers<string> = await prompts({
      type: "date",
      name: "value",
      message: "Enter the starting date of the survey ( format: D.M.YYYY): ",
      mask: "D.M.YYYY",
      validate: (date) => (date < yesterday.getTime() ? "Dont select past dates" : true)
    });
    let timeEnd: Answers<string> = await prompts({
      type: "date",
      name: "value",
      message: "Enter the terminating date of the survey ( format: D.M.YYYY): ",
      mask: "D.M.YYYY",
      validate: (date) => (timeStart.value > date ? "Make sure your selected date is after your previous date" : true)
    });
    return { start: timeStart.value, end: timeEnd.value };
  }
}
