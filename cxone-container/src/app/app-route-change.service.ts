import { Injectable } from '@angular/core';
import { Router, RoutesRecognized } from '@angular/router';
import { filter } from "rxjs/internal/operators";

@Injectable({
 providedIn: 'root'
})
export class AppRouteChangeService {

 constructor(private router: Router) {
   router.events
   .pipe(filter(event => event instanceof RoutesRecognized))
   .subscribe((event) => {
     console.log(event);
   });
 }
}