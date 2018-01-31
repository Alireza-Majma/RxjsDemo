import { Observer } from "rxjs";

export class CustomObserver<T> implements Observer<T> {
  constructor(nextFunc: (value: T) => void = null) {
    if (nextFunc) {
      this.next = nextFunc;
    }
  }

  next(value: T) {
    console.log(value);
  }

  error(e: any) {
    console.log(e);
  }

  complete() {
    console.log("complete");
  }
}
