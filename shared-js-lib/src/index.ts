
import { Subject } from 'rxjs';

export class JediService {
  name = 'Luke Skywalker' + new Date().getTime();
  private static _instance: JediService;
  private subject$$: Subject<string>;

  constructor() {
    this.subject$$ = new Subject<string>();
  }

  public static get instance(): JediService {
    if (!this._instance) {
      this._instance = new JediService();
    }
    return this._instance;
  }

  public get jediName() {
    return this.name;
  }

  public publishValue(value: string) {
    this.subject$$.next(value);
  }

  public get subject() {
    return this.subject$$;
  }
}