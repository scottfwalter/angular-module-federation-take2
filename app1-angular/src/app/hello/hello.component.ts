import { Compiler, Component, DoCheck, Injector, OnChanges, OnInit, SimpleChanges, ViewChild, ViewContainerRef } from '@angular/core';
import { LicenseService, NotificationService } from 'cxone-client-services-platform';
import { CounterService } from 'components-lib';
@Component({
  selector: 'app-hello',
  templateUrl: './hello.component.html',
  styleUrls: ['./hello.component.scss']
})
export class HelloComponent implements OnInit   {
  licenses: any;
  notifications: any[] = [];

  @ViewChild('container', { read: ViewContainerRef }) container: ViewContainerRef;


  constructor(private compiler: Compiler,
    private injector: Injector, public counterService: CounterService) {
    }

  async ngOnInit() {
    this.licenses = await LicenseService.instance.getLicensesForTenant();

    NotificationService.instance.subscribeToSubject('IN_APP').subscribe(
      (result: any) => {
        const parsedMessage = JSON.parse(result);
        console.log('NOTIFICATION RECEIVED', parsedMessage);
        this.notifications.push(`${parsedMessage.displayData.title} - ${parsedMessage.displayData.content}`);
      }
    );
  }

  clickit() {
    alert('Hello Click');
  }

  loadFeature() {
    import('../local-lazy/local-lazy.module').then(({ LocalLazyModule }) => {
      // Compile the module
      this.compiler.compileModuleAsync(LocalLazyModule).then(moduleFactory => {
        // Create a moduleRef, resolve an entry component, create the component
        const moduleRef = moduleFactory.create(this.injector);
        const componentFactory = moduleRef.instance.resolveComponent();
        const { instance } = this.container.createComponent(componentFactory);

        // set component Input() property
        instance.title = 'bar';

        // you have to manually call ngOnChanges for dynamically created components
        instance.ngOnChanges();
      });
    });
  }

  incrementCounter() {
    this.counterService.incremet(100);
  }
}
