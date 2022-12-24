import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LoginComponent} from "./components/pages/login/login.component";
import {RegisterComponent} from "./components/pages/register/register.component";
import {HomeComponent} from "./components/pages/home/home.component";
import {AuthGuardService} from "./services/auth-guard.service";

const routes: Routes = [
  // http://localhost:4200/login
  {path: 'login', component: LoginComponent},
  // http://localhost:4200/register
  {path: 'register', component: RegisterComponent},
  // http://localhost:4200/home
  {path: 'home', component: HomeComponent, canActivate: [AuthGuardService]},
  // http://localhost:4200/
  { path: '', redirectTo: '/login', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
