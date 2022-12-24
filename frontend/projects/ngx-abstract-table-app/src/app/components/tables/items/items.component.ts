import { Component, OnInit } from '@angular/core';
import {Item} from "../../../models/item.model";
import {Detail} from "../../../models/detail.model";
import {ShoppingService} from "../../../services/shopping.service";
import {Observable, of} from "rxjs";
import {UtilsService} from "../../../services/utils.service";
import {MatDialog} from "@angular/material/dialog";

@Component({
  selector: 'app-items',
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.scss']
})
export class ItemsComponent implements OnInit {

  public items$: Observable<Item[]> = of([]);
  public details$: Observable<Detail[]> = of([]);
  public selectedItem: Item | null = null;
  public selectedItemDetail: Detail | null = null;

  constructor(private shoppingService: ShoppingService,
              private utilsService: UtilsService,
              private dialog: MatDialog) { }

  ngOnInit(): void {
  }

  public fetchAllItems(): void {
    this.items$ = this.shoppingService.fetchAllItems();
  }

  public addItem(): void {
    // open dialog, after close:
    // this.shoppingService.addItem(result.name, result.type, result.price).subscribe((item: Item | null) => {});
  }

  public editItem(): void {
    if (this.selectedItem){

    }else{
      this.utilsService.handleClientError('No item selected', 'Please select an item');
    }
  }

  public deleteItem(): void {
    if (this.selectedItem){

    }else{
      this.utilsService.handleClientError('No item selected', 'Please select an item');
    }
  }

  public fetchItemDetails(): void {
    if (this.selectedItem){
      this.details$ = this.shoppingService.fetchItemDetails(this.selectedItem.id);
    }else{
      this.utilsService.handleClientError('No item selected', 'Please select an item');
    }
  }

  public addItemDetail(): void {
    if (this.selectedItem){

    }else{
      this.utilsService.handleClientError('No item selected', 'Please select an item');
    }
  }

  public editItemDetail(): void {
    if (this.selectedItemDetail){

    }else{
      this.utilsService.handleClientError('No detail selected', 'Please select a detail');
    }
  }

  public deleteItemDetail(): void {
    if (this.selectedItemDetail){

    }else{
      this.utilsService.handleClientError('No detail selected', 'Please select a detail');
    }
  }

}
