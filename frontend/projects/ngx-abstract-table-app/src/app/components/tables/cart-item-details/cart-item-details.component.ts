import {Component, Input, OnInit} from '@angular/core';
import {Detail} from "../../../models/detail.model";

/**
 * Cart item detail component made for displaying item details and that a custom component can also be passed as child element to each row
 */
@Component({
  selector: 'app-cart-item-details',
  templateUrl: './cart-item-details.component.html',
  styleUrls: ['./cart-item-details.component.scss']
})
export class CartItemDetailsComponent implements OnInit {

  @Input('details') details: Detail[] | null = [];

  constructor() { }

  ngOnInit(): void {
  }

}
