import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HelloComponent } from './hello/hello.component';
import { GoodbyeComponent } from './goodbye/goodbye.component';
import { endsWith } from '@angular-architects/module-federation-tools';

const routes: Routes = [
  { matcher: endsWith('hello'), component: HelloComponent },
  { matcher: endsWith('goodbye'), component: GoodbyeComponent },
  {
    matcher: endsWith('items'),
    loadChildren: () => import('./lazy/lazy.module').then(m => m.LazyModule)
  },
  { matcher: endsWith('abc'), loadChildren: () => import('./modulea/modulea.module').then(m => m.ModuleaModule) }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
