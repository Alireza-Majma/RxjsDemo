import { Movie } from "./subjects";
import { Observable, BehaviorSubject } from "rxjs";

export interface Movie {
  title: string;
}

export interface UserInfo {
  name: string;
  isAuthenticated: Boolean;
}

const movies: Array<Movie> = [
  {
    title: "Star Wars"
  },
  {
    title: "Star Trek"
  },
  {
    title: "Starship Troopers"
  }
];

export let userInfo: UserInfo = {
  name: "Alireza",
  isAuthenticated: false
};

export function loadFromArray$() {
  return Observable.from(movies);
}

export function loadMoviesWithDelay$() {
  let delay = 0;
  return Observable.create((o: any) =>
    movies.forEach(m =>
      setTimeout(() => {
        o.next(m);
      }, (delay = delay + 500))
    )
  );
}

const userSubject = new BehaviorSubject<UserInfo>(userInfo);

export const userInfo$ = userSubject.asObservable();

export function updasteisAuthenticated() {
  const u: UserInfo = {
    name: "Alireza",
    isAuthenticated: !userInfo.isAuthenticated
  };
  userInfo = u;
  userSubject.next(u);
}

export function loadwithDelay(val: any) {
  let oo: any;
  let delay = Math.floor(Math.random() / 4 * 100 + 1) * 100;
  // console.log(delay);
  setTimeout(() => {
    oo.next(val);
    oo.complete();
  }, delay);
  return Observable.create((o: any) => (oo = o));
}
