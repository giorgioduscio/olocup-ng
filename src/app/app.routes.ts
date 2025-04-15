import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { UnitaOperativeComponent } from './pages/unita-operative/unita-operative.component';

export const routes: Routes = [
  { path:'login', component:LoginComponent },
  { path:'unita_operative', component:UnitaOperativeComponent },

  { path:'', pathMatch:'full', redirectTo:'unita_operative'},
  { path:'**', pathMatch:'full', redirectTo:'unita_operative'},
];
