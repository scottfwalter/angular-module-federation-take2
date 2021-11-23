import { ComponentFactory, ComponentFactoryResolver, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DefComponent } from './def/def.component';

@NgModule({
  declarations: [
    DefComponent
  ],
  imports: [
    CommonModule
  ]
})
export class LocalLazyModule {
  constructor(private componentFactoryResolver: ComponentFactoryResolver) { }

  public resolveComponent(): ComponentFactory<DefComponent> {
    return this.componentFactoryResolver.resolveComponentFactory(DefComponent);
  }
}
