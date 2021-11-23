import {
    AngularZoneUtils, ConfigurationDetails, FeatureToggleService, IconSvgService, LicenseService, NotificationService,
    PermissionService, User
} from 'cxone-client-services-platform';
import { ConfigurationService } from 'cxone-core-services';

import { HttpClient } from '@angular/common/http';
import {
    ChangeDetectorRef, Compiler, Component, Injector, OnChanges, OnInit, SimpleChanges, ViewChild, ViewContainerRef, ViewEncapsulation
} from '@angular/core';

import { EventBusService } from 'components-lib';

@Component({
  selector: 'app-helloworld',
  templateUrl: './helloworld.component.html',
  styleUrls: ['./helloworld.component.less'],
  encapsulation: ViewEncapsulation.None
})
export class HelloworldComponent implements OnInit, OnChanges {
  configurationData: ConfigurationDetails;
  configurationKeys: string[];
  spritePath;
  deleteSkillPermission: boolean;
  notifications = [];
  licenses;
  userInfo;
  featureToggles;
  permissions;
  messageText;

  @ViewChild('container', { read: ViewContainerRef }) container: ViewContainerRef;

  constructor(
    private config: ConfigurationService,
    private cdRef: ChangeDetectorRef,
    private http: HttpClient,
    private compiler: Compiler,
    private injector: Injector) {
      this.configurationData = this.config.all();
      this.configurationKeys = Object.keys(this.configurationData);



      NotificationService.instance.subscribeToSubject('IN_APP').subscribe(
        result => {
          const parsedMessage = JSON.parse(result);
          console.log('NOTIFICATION RECEIVED', parsedMessage);
          this.notifications.push(`${parsedMessage.displayData.title} - ${parsedMessage.displayData.content}`);
        }
      );
  }

   async ngOnInit() {
    this.spritePath = IconSvgService.instance.getIconsSpriteDataUrl('application');
    this.userInfo = User.instance.user;
    console.log(this.userInfo);
    this.licenses = await LicenseService.instance.getLicensesForTenant();
    this.featureToggles = await FeatureToggleService.instance.loadFeatures();
    this.permissions = await PermissionService.instance.getUserPermissionList();
  }

  requestData() {
    console.log('loading');
    this.http.get('assets/data/test.json').subscribe((_data) => {
    });
  }

  async fetchData() {
    await fetch('assets/data/test.json');
  }

  convertData() {
    this.http.get('assets/data/test.json').subscribe((results) => {
      console.log(results);
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log('WE HAVE CHANGES', changes);
  }

  updateMessageInZone() {
    setTimeout(() => {
      this.messageText = 'Luke Skywalker';
    }, 2000);
  }

  updateMessageOutsideZone() {
    AngularZoneUtils.runOutsideAngularZone(() => {
      setTimeout(() => {
        this.messageText = 'Darth Vader';
      }, 2000);
    });
  }

  detectChanges() {
    this.cdRef.detectChanges();
  }

  loadFeature() {
    import('../lazy-feature/lazy-feature.module').then(({ LazyFeatureModule }) => {
      // Compile the module
      this.compiler.compileModuleAsync(LazyFeatureModule).then(moduleFactory => {
        // Create a moduleRef, resolve an entry component, create the component
        const moduleRef = moduleFactory.create(this.injector);
        const componentFactory = moduleRef.instance.resolveComponent();
        const { instance } = this.container.createComponent(componentFactory);

        // set component Input() property
        instance.title = 'foo';

        // you have to manually call ngOnChanges for dynamically created components
        instance.ngOnChanges();
      });
    });
  }


}
