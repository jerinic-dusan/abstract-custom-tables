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
import {HttpClientModule} from "@angular/common/http";
import {MaterialModule} from "./material/material.module";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {OverlayModule} from "@angular/cdk/overlay";
import {JWT_OPTIONS, JwtHelperService} from "@auth0/angular-jwt";
import { ItemEditorDialogComponent } from './components/dialogs/item-editor-dialog/item-editor-dialog.component';
import { DetailEditorDialogComponent } from './components/dialogs/detail-editor-dialog/detail-editor-dialog.component';
import { CartItemDetailsComponent } from './components/tables/cart-item-details/cart-item-details.component';

@NgModule({
  declarations: [
    AppComponent,
    CustomDialogComponent,
    HomeComponent,
    LoginComponent,
    RegisterComponent,
    ItemsComponent,
    CartComponent,
    ItemEditorDialogComponent,
    DetailEditorDialogComponent,
    CartItemDetailsComponent
  ],
    imports: [
        BrowserModule,
        HttpClientModule,
        AppRoutingModule,
        CustomTableModule,
        MaterialModule,
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        MaterialModule,
        ReactiveFormsModule,
        FormsModule,
        HttpClientModule,
        OverlayModule,
    ],
  providers: [
    { provide: JWT_OPTIONS, useValue: JWT_OPTIONS },
    JwtHelperService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
