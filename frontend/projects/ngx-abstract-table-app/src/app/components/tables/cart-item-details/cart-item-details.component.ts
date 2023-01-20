import {Component, Input, OnInit} from '@angular/core';
import {Detail} from "../../../models/detail.model";

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
