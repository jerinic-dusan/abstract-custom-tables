import { Injectable } from '@angular/core';
import {ApiResponse} from "../models/responses/api-response.interface";
import {MatDialog} from "@angular/material/dialog";
import {CustomDialogComponent} from "../components/dialogs/custom-dialog/custom-dialog.component";
import {Observable, of} from "rxjs";
import {CustomDialogData} from "../models/custom-dialog-data.interface";
import {HttpErrorResponse} from "@angular/common/http";
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor(private dialog: MatDialog, private router: Router) { }

  public handleApiError(errorResponse: ApiResponse<any> | HttpErrorResponse, returnValue: any): Observable<any> {
    const dialogData: CustomDialogData = {
      title: errorResponse instanceof HttpErrorResponse ? this.setTitle(errorResponse.error.code) : this.setTitle(errorResponse.code),
      message: errorResponse instanceof HttpErrorResponse ? errorResponse.error.message : errorResponse.message,
      icon: 'error',
      action: 'Okay'
    }
    if ((errorResponse instanceof HttpErrorResponse && errorResponse.error.code === 401) ||
        (<ApiResponse<any>>errorResponse).code === 401){
        this.router.navigate(['']).then(() => {});
    }

    this.dialog.open(CustomDialogComponent, {
      data: dialogData,
      width: '400px'
    });
    return of(returnValue);
  }

  public handleClientError(title: string, message: string, action: string = 'Okay'): void {
    const dialogData: CustomDialogData = {
      title: title,
      message: message,
      icon: 'warning',
      action: action
    }
    this.dialog.open(CustomDialogComponent, {
      data: dialogData
    });
  }

  public initHeaders(): any {
    const token = localStorage.getItem('token');
    return {
      'Authorization': 'Bearer '.concat(token ? token : '')
    }
  }

  private setTitle(code: number): string {
    return `Oops, something went wrong. ${code}`;
  }
}
