import { Injectable } from '@angular/core';
import {ApiResponse} from "../models/responses/api-response.interface";
import {MatDialog} from "@angular/material/dialog";
import {CustomDialogComponent} from "../components/dialogs/custom-dialog/custom-dialog.component";
import {Observable, of} from "rxjs";
import {CustomDialogData} from "../models/custom-dialog-data.interface";

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor(private dialog: MatDialog) { }

  public handleApiError(errorResponse: ApiResponse<any>, returnValue: any): Observable<any> {
    const dialogData: CustomDialogData = {
      title: errorResponse.code.toString(),
      message: errorResponse.message,
      icon: 'error',
      action: 'Okay'
    }
    this.dialog.open(CustomDialogComponent, {
      data: dialogData
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
}
