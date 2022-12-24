import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CustomDialogComponent } from './components/dialogs/custom-dialog/custom-dialog.component';
import { HomeComponent } from './components/pages/home/home.component';
import { LoginComponent } from './components/pages/login/login.component';
import { RegisterComponent } from './components/pages/register/register.component';
import { ItemsComponent } from './components/tables/items/items.component';
import { CartComponent } from './components/tables/cart/cart.component';
import {CustomTableModule} from "ngx-abstract-table";

@NgModule({
  declarations: [
    AppComponent,
    CustomDialogComponent,
    HomeComponent,
    LoginComponent,
    RegisterComponent,
    ItemsComponent,
    CartComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CustomTableModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
