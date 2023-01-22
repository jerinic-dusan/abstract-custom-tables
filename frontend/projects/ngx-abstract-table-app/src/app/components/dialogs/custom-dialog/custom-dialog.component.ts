import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {CustomDialogData} from "../../../models/custom-dialog-data.interface";

/**
 * Custom dialog component for displaying custom messages such as backend errors or success messages
 */
@Component({
  selector: 'app-custom-dialog',
  templateUrl: './custom-dialog.component.html',
  styleUrls: ['./custom-dialog.component.scss']
})
export class CustomDialogComponent implements OnInit {

  constructor(private dialogRef: MatDialogRef<CustomDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: CustomDialogData) { }

  ngOnInit(): void {
  }

  public onOkayClick(): void {
    this.dialogRef.close();
  }

}
