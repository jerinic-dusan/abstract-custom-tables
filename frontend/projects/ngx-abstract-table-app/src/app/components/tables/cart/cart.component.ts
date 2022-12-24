import { Component, OnInit } from '@angular/core';
import {Item} from "../../../models/item.model";
import {ShoppingService} from "../../../services/shopping.service";

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {

  public selectedCartItem: Item | null = null;

  constructor(private shoppingService: ShoppingService) { }

  ngOnInit(): void {
  }

  public addToCart(): void {

  }

  public removeFromCart(): void {

  }

  public fetchCartItemDetails(): void {

  }

}
