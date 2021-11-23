import { ThisReceiver } from '@angular/compiler';
import {ChangeDetectorRef, Component, OnDestroy, VERSION} from '@angular/core';
import { EventBusService } from 'components-lib';

@Component({
  selector: 'app-hello1',
  templateUrl: './hello1.component.html',
  styleUrls: ['./hello1.component.scss']
})
export class Hello1Component implements OnDestroy {

  angularVersion = VERSION.full;
  eventDetails: any;

  constructor(private eventBusService: EventBusService, private ref: ChangeDetectorRef) {
    (window as any).eventBus.on('helloEvent', this.eventHandler.bind(this));
  }

  eventHandler(data: any) {
    this.eventDetails = data;
    this.ref.detectChanges();
  }

  ngOnDestroy(): void {
    (window as any).eventBus.off('helloEvent',this.eventHandler);
  }
}
