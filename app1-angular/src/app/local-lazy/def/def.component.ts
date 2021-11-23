import { Component, Input, OnChanges, OnInit } from '@angular/core';

@Component({
  selector: 'app-def',
  templateUrl: './def.component.html',
  styleUrls: ['./def.component.scss']
})
export class DefComponent implements OnInit, OnChanges {

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
