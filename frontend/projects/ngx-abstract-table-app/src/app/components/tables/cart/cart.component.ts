import { Component, OnInit } from '@angular/core';
import {Item} from "../../../models/item.model";
import {ShoppingService} from "../../../services/shopping.service";
import {Observable, of} from "rxjs";
import {Detail} from "../../../models/detail.model";
import {Configuration, FilterConfiguration, FilterAppearance, SortConfiguration, SortArrowPosition, StyleConfiguration, TableData} from "ngx-abstract-table";
import {UtilsService} from "../../../services/utils.service";
import {map} from "rxjs/operators";

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {

  public configuration = Configuration.CLIENT_SIDE;
  public items$: Observable<Item[]> = of([]);
  public details$: Observable<Detail[]> = of([]);
  public selectedCartItem: Item | null = null;
  public selectedShopItem: Item | null = null;

  public filterConfiguration: FilterConfiguration = {filterLabel: 'Search', filterPlaceholder: '', filterAppearance: FilterAppearance.STANDARD};
  public sortingConfiguration: SortConfiguration = {arrowPosition: SortArrowPosition.AFTER};
  public styleConfiguration: StyleConfiguration = {alternatingRowColors: true, selectedRowColor: '#ff4081'};

  constructor(private shoppingService: ShoppingService,
              private utilsService: UtilsService) {
    this.fetchCartItems()
    this.shoppingService.reloadCart$.subscribe(reload => this.reloadCart(reload));
    this.shoppingService.selectedItem$.subscribe(item => this.selectedShopItem = item);
  }

  ngOnInit(): void {
  }

  public fetchCartItems(): void {
    this.items$ = this.shoppingService.fetchCartItems();
  }

  public addToCart(): void {
    if (this.selectedShopItem){
      this.shoppingService.addItemToCart(this.selectedShopItem.id).subscribe(items => {
        this.items$ = this.items$.pipe(map(() => items));
      });
    }else{
      this.utilsService.handleClientError('No item selected', 'Please select an item');
    }
  }

  public removeFromCart(): void {
    if (this.selectedCartItem){
      this.shoppingService.deleteItemFromCart(this.selectedCartItem.id).subscribe(items => {
        this.items$ = this.items$.pipe(map(() => items));
      });
    }else{
      this.utilsService.handleClientError('No item selected', 'Please select an item');
    }
  }

  public fetchCartItemDetails(): void {
    if (this.selectedCartItem){
      this.details$ = this.shoppingService.fetchCartItemDetails(this.selectedCartItem.id);
    }else{
      this.utilsService.handleClientError('No item selected', 'Please select an item');
    }
  }

  public itemClicked(item: TableData | null): void {
    this.selectedCartItem = <Item>item;
    if (this.selectedCartItem){
      this.fetchCartItemDetails();
    }
  }

  private reloadCart(reload: boolean): void {
    if (reload){
      this.fetchCartItems();
      this.shoppingService.setReloadCart(false);
    }
  }

}
