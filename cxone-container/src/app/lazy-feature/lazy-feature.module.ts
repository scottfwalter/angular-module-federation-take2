import { CommonModule } from '@angular/common';
import { NgModule, ComponentFactoryResolver, ComponentFactory } from '@angular/core';

import { LazyFeatureRoutingModule } from './lazy-feature-routing.module';
import { LazyComponent } from './lazy/lazy.component';


@NgModule({
  declarations: [

    LazyComponent
  ],
  imports: [
    CommonModule,
    LazyFeatureRoutingModule
  ]
})
export class LazyFeatureModule {
  constructor(private componentFactoryResolver: ComponentFactoryResolver) { }

  public resolveComponent(): ComponentFactory<LazyComponent> {
    return this.componentFactoryResolver.resolveComponentFactory(LazyComponent);
  }
}
