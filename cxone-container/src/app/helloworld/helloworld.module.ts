import { NgModule } from '@angular/core';

import { HelloworldComponent } from './helloworld.component';
import { MessageComponent} from './message.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    SharedModule
  ],
  declarations: [
    HelloworldComponent,
    MessageComponent
  ],
  providers: []
})
export class HelloWorldModule {}