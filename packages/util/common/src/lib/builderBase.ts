export abstract class BuilderBase {
  private _constructor = Object.getPrototypeOf(this).constructor;

  protected change(fn: (builder: this) => void): this {
    const clone = new this._constructor();

    Object.assign(clone, this);

    fn(clone);

    return clone;
  }
}
