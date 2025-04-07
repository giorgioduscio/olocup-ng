import { Routes } from '@angular/router';
import { UnitaOperativeComponent } from './pages/unita-operative/unita-operative.component';

export const routes: Routes = [
  { path:'unita_operative', component:UnitaOperativeComponent },

  { path:'', pathMatch:'full', redirectTo:'unita_operative'},
  { path:'**', pathMatch:'full', redirectTo:'unita_operative'},
];
