import { Component, OnInit, VERSION } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  ngVersion: string = '';

  constructor(private router: Router,) {
  }

  NavToGoodbye() {
    this.router.navigateByUrl('/angular1/goodbye');
  }

  ngOnInit(): void {
    this.ngVersion = VERSION.full;
  }
}
