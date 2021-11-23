import { Component, OnInit, ViewEncapsulation, ChangeDetectorRef, OnChanges, SimpleChanges, Input } from '@angular/core';

@Component({
  selector: 'app-message',
  template: '<p>Hello {{messageText}}!</p>',
  encapsulation: ViewEncapsulation.None
})
export class MessageComponent implements OnInit, OnChanges {

  @Input()
  messageText;

  constructor(private cdRef: ChangeDetectorRef) {
  }
  ngOnChanges(changes: SimpleChanges): void {
    console.log('MessageComponent CHANGES', changes);
  }

  ngOnInit() {
      console.log('MessageComponent on init');
  }
}

