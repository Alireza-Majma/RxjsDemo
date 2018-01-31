import { Observable } from "rxjs";
import * as fromSubjects from "./subjects";
import { Movie } from "./subjects";
import * as fromObservers from "./observers";

let output = document.getElementById("output");
let btnGetMoviews = document.getElementById("btn-get-movies");
let btnLogin = <HTMLButtonElement>document.getElementById("btnlogin");
let spanLogin = <HTMLSpanElement>document.getElementById("spanlogin");

// Observable.combineLatest(
//   fromSubjects.loadwithDelay(31),
//   fromSubjects.loadwithDelay(41)
// ).subscribe(
//   (x: any[]) => {
//     console.log(x.reduce((sum, val) => sum + val));
//   },
//   (e: any) => console.log(`error: ${e}`),
//   () => console.log("get total is completed")
// );

let btnLogin$ = Observable.fromEvent(btnLogin, "click");
btnLogin$.subscribe(
  () => fromSubjects.updasteisAuthenticated(),
  (e: any) => console.log(`error: ${e}`),
  () => console.log("complete")
);

fromSubjects.userInfo$.subscribe(
  new fromObservers.CustomObserver(updateUI)
  // (u: fromSubjects.UserInfo) => updateUI(u),
  // (e: any) => console.log(`error: ${e}`),
  // () => console.log("complete")
);

let clickGetMovies$ = Observable.fromEvent(btnGetMoviews, "click")
  .withLatestFrom(fromSubjects.userInfo$, (_, u: fromSubjects.UserInfo) => u)
  .filter(u => u.isAuthenticated === true);

const movies$ = clickGetMovies$.switchMap(() =>
  fromSubjects.loadMoviesWithDelay$()
);

movies$
  //.do(m => console.log(m))
  //.concatMap(x => Observable.of(x).delay(4400))
  //.flatMap(x =>  Observable.of(x).delay(4400) )
  .subscribe(
    (m: Movie) => renderMovie(m),
    (e: any) => console.log(`error: ${e}`),
    () => console.log("complete")
  );

function renderMovie(movie: Movie) {
  let div = document.createElement("div");
  div.innerText = movie.title;
  output.appendChild(div);
}

function updateUI(u: fromSubjects.UserInfo) {
  btnLogin.innerText = u.isAuthenticated ? "Logout" : "Login";
  spanLogin.innerText = fromSubjects.userInfo.isAuthenticated
    ? "Hello " + fromSubjects.userInfo.name
    : "Please login ";
}
