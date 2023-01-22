import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {Item} from "../../../models/item.model";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

/**
 * Item editor dialog component for editing item information for a new or existing item
 */
@Component({
  selector: 'app-item-editor-dialog',
  templateUrl: './item-editor-dialog.component.html',
  styleUrls: ['./item-editor-dialog.component.scss']
})
export class ItemEditorDialogComponent implements OnInit {

  public form: FormGroup;

  constructor(private formBuilder: FormBuilder,
              private dialogRef: MatDialogRef<ItemEditorDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public item: Item | undefined) {
    this.form = this.formBuilder.group({
      name: [item ? item.name : '', Validators.required],
      type: [item ? item.type : ''],
      price: [item ? item.price : '', Validators.required],
    });
  }

  ngOnInit(): void {
  }

  public submitForm(): void {
    if (this.form.invalid){
      return;
    }

    const name = this.form.get('name')?.value;
    const type = this.form.get('type')?.value;
    const price = this.form.get('price')?.value;

    if (this.item){
      this.item.name = name;
      this.item.type = type;
      this.item.price = price;
      this.dialogRef.close({data: this.item})
    }else {
      const newItem = new Item('-1', name, type, price, new Date());
      this.dialogRef.close({data: newItem});
    }
  }

  public onNoClick(): void {
    this.dialogRef.close();
  }

}
