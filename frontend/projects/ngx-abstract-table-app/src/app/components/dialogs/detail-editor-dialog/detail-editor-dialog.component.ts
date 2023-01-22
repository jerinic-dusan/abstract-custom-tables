import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {Detail} from "../../../models/detail.model";

/**
 * Detail editor dialog component for editing detail information for a new or existing detail
 */
@Component({
  selector: 'app-detail-editor-dialog',
  templateUrl: './detail-editor-dialog.component.html',
  styleUrls: ['./detail-editor-dialog.component.scss']
})
export class DetailEditorDialogComponent implements OnInit {

  public form: FormGroup;

  constructor(private formBuilder: FormBuilder,
              private dialogRef: MatDialogRef<DetailEditorDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public detail: Detail | undefined) {
    this.form = this.formBuilder.group({
      name: [detail ? detail.name : '', Validators.required],
      value: [detail ? detail.value : '', Validators.required],
    }); }

  ngOnInit(): void {
  }

  public submitForm(): void {
    if (this.form.invalid){
      return;
    }

    const name = this.form.get('name')?.value;
    const value = this.form.get('value')?.value;

    if (this.detail){
      this.detail.name = name;
      this.detail.value = value;
      this.dialogRef.close({data: this.detail})
    }else {
      const newDetail = new Detail('-1', name, value);
      this.dialogRef.close({data: newDetail});
    }
  }

  public onNoClick(): void {
    this.dialogRef.close();
  }

}
