import { Component, Input, OnChanges, OnInit } from '@angular/core';

@Component({
  selector: 'app-lazy',
  templateUrl: './lazy.component.html',
  styleUrls: ['./lazy.component.less']
})
export class LazyComponent implements OnInit, OnChanges {

  @Input()
  title = 'Default Title';

  constructor() { }

  ngOnInit(): void {
  }

  ngOnChanges() {
    console.log('ngOnChanges');
  }

  changeTitle() {
    this.title = 'New Title';
  }
}
