import {NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';

import { ActionBarModule } from 'cxone-domain-components/action-bar';
import { TabsModule } from 'cxone-components/tabs';
import { I18NextModule } from 'angular-i18next';
import { SpinnerModule } from 'cxone-components/spinner';
import { TranslationModule } from 'cxone-components/translation';
import { SvgSpriteIconModule } from 'cxone-components/svg-sprite-icon';
import { CoreServicesModule } from 'cxone-core-services';

import { NavigationModule } from 'cxone-domain-components/navigation';
import { ToastrModule } from 'ngx-toastr';
import { ToastrManagerModule } from 'cxone-components/toastr';
import { PopoverModule } from 'ngx-bootstrap/popover';

@NgModule({
    declarations: [
    ],
    imports: [
      I18NextModule.forRoot(),
      ToastrModule.forRoot(),
      PopoverModule.forRoot()
    ],
    providers: [
    ],
    exports: [
      ActionBarModule,
      CommonModule,
      CoreServicesModule,
      NavigationModule,
      SpinnerModule,
      SvgSpriteIconModule,
      TabsModule,
      ToastrManagerModule,
      TranslationModule
    ]
})
export class SharedModule { }