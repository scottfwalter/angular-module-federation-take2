import { ChangeDetectorRef, Component, VERSION } from '@angular/core';
import { EventBusService } from 'components-lib';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'app2-angular';
  ngVersion = VERSION.full;
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
