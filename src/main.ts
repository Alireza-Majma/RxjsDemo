import { Observable } from "rxjs";
import * as fromSubjects from "./subjects";
import { Movie } from "./subjects";

let output = document.getElementById("output");
let button = document.getElementById("button");
let btnLogin = <HTMLButtonElement>document.getElementById("btnlogin");
let spanLogin = <HTMLSpanElement>document.getElementById("spanlogin");

Observable.combineLatest(
  fromSubjects.loadwithDelay(31),
  fromSubjects.loadwithDelay(41)
).subscribe(
  (x: any[]) => {
    console.log(x[0]+x[1]);
  },
  (e: any) => console.log(`error: ${e}`),
  () => console.log("complete")
);

fromSubjects.loadwithDelay(11).subscribe(
  (x: any) => {
    console.log(x);
  },
  (e: any) => console.log(`error: ${e}`),
  () => console.log("complete")
);

updateLogin();

let btnLogin$ = Observable.fromEvent(btnLogin, "click");
let click$ = Observable.fromEvent(button, "click")
  .withLatestFrom(fromSubjects.userInfo$, (e, u: fromSubjects.UserInfo) => {
    console.log(u);
    return { e, u };
  })
  .filter(({ u }) => u.isAuthenticated === true);

const clickMovies$ = click$.switchMap(() => fromSubjects.loadFromArray$());
const clickMoviesInterval$ = clickMovies$.concatMap(x =>
  Observable.of(x).delay(400)
);

btnLogin$.subscribe(
  () => {
    fromSubjects.updasteisAuthenticated();
    updateLogin();
  },
  (e: any) => console.log(`error: ${e}`),
  () => console.log("complete")
);

function renderMovie(movie: Movie) {
  let div = document.createElement("div");
  div.innerText = movie.title;
  output.appendChild(div);
}

clickMoviesInterval$
  .do(m => console.log(m))
  .subscribe(
    (m: Movie) => renderMovie(m),
    (e: any) => console.log(`error: ${e}`),
    () => console.log("complete")
  );

function updateLogin() {
  btnLogin.innerText = fromSubjects.userInfo.isAuthenticated
    ? "Logout"
    : "Login";
  spanLogin.innerText =
    (fromSubjects.userInfo.isAuthenticated ? "Hello " : "By ") +
    fromSubjects.userInfo.name;
}
