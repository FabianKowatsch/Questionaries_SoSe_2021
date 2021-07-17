export interface Dao<Type> {
  getAll(): Array<Type>;
  get(_identifier: string): Type;
  update(_arg: Type): void;
  add(_arg: Type): void;
}
