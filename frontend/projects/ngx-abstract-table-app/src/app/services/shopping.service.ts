import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {Item, ItemMapper} from "../models/item.model";
import {ApiResponse} from "../models/responses/api-response.interface";
import {catchError, map} from "rxjs/operators";
import {HttpClient} from "@angular/common/http";
import {UtilsService} from "./utils.service";
import {ItemResponse} from "../models/responses/item-response.interface";
import {Detail, DetailMapper} from "../models/detail.model";
import {DetailResponse} from "../models/responses/detail-response.interface";

@Injectable({
  providedIn: 'root'
})
export class ShoppingService {

  private url: string = 'http://localhost:8080/home/';

  constructor(private http: HttpClient,
              private utilsService: UtilsService,
              private itemMapper: ItemMapper,
              private detailMapper: DetailMapper) {}

  public fetchAllItems(): Observable<Item[]> {
    return this.http.get<ApiResponse<ItemResponse[]>>(this.url.concat('items'), {
      headers: this.utilsService.initHeaders()
    }).pipe(
      map((response: ApiResponse<ItemResponse[]>) => response.data.map(item => this.itemMapper.map(item))),
      catchError((errResponse: ApiResponse<any>) => this.utilsService.handleApiError(errResponse, []))
    );
  }

  public addItem(name: string, type: string, price: string): Observable<Item | null> {
    return this.http.post<ApiResponse<ItemResponse>>(this.url.concat('add-item'), {
      name: name,
      type: type,
      price: price
    }, {
      headers: this.utilsService.initHeaders()
    }).pipe(
      map((response: ApiResponse<ItemResponse>) => this.itemMapper.map(response.data)),
      catchError((errResponse: ApiResponse<any>) => this.utilsService.handleApiError(errResponse, null))
    );
  }

  public editItem(item: Item): Observable<Item | null> {
    return this.http.put<ApiResponse<ItemResponse>>(this.url.concat('edit-item'), {
      id: item.id,
      name: item.name,
      type: item.type,
      price: item.price
    }, {
      headers: this.utilsService.initHeaders()
    }).pipe(
      map((response: ApiResponse<ItemResponse>) => this.itemMapper.map(response.data)),
      catchError((errResponse: ApiResponse<any>) => this.utilsService.handleApiError(errResponse, null))
    );
  }

  public deleteItem(id: string): Observable<boolean> {
    return this.http.delete<ApiResponse<any>>(this.url.concat('delete-item'), {
      params: {
        id: id
      },
      headers: this.utilsService.initHeaders()
    }).pipe(
      map(() => true),
      catchError((errResponse: ApiResponse<any>) => this.utilsService.handleApiError(errResponse, false))
    );
  }

  public fetchItemDetails(id: string): Observable<Detail[]> {
    return this.http.get<ApiResponse<DetailResponse[]>>(this.url.concat('item-details'), {
      params: {
        id: id
      },
      headers: this.utilsService.initHeaders()
    }).pipe(
      map((response: ApiResponse<DetailResponse[]>) => response.data.map(item => this.detailMapper.map(item))),
      catchError((errResponse: ApiResponse<any>) => this.utilsService.handleApiError(errResponse, []))
    );
  }

  public addItemDetail(id: string, name: string, value: string): Observable<Detail[]> {
    return this.http.post<ApiResponse<DetailResponse[]>>(this.url.concat('add-item-detail'), {
      id: id,
      name: name,
      value: value
    }, {
      headers: this.utilsService.initHeaders()
    }).pipe(
      map((response: ApiResponse<DetailResponse[]>) => response.data.map(item => this.detailMapper.map(item))),
      catchError((errResponse: ApiResponse<any>) => this.utilsService.handleApiError(errResponse, []))
    );
  }

  public editItemDetail(itemId: string, detailId: string, name: string, value: string): Observable<Detail[]> {
    return this.http.put<ApiResponse<DetailResponse[]>>(this.url.concat('edit-item-detail'), {
      itemId: itemId,
      detailId: detailId,
      name: name,
      value: value
    }, {
      headers: this.utilsService.initHeaders()
    }).pipe(
      map((response: ApiResponse<DetailResponse[]>) => response.data.map(item => this.detailMapper.map(item))),
      catchError((errResponse: ApiResponse<any>) => this.utilsService.handleApiError(errResponse, []))
    );
  }

  public deleteItemDetail(itemId: string, detailId: string): Observable<boolean> {
    return this.http.delete<ApiResponse<any>>(this.url.concat('delete-item-detail'), {
      params: {
        itemId: itemId,
        detailId: detailId
      },
      headers: this.utilsService.initHeaders()
    }).pipe(
      map(() => true),
      catchError((errResponse: ApiResponse<any>) => this.utilsService.handleApiError(errResponse, false))
    );
  }

  public fetchCartItems(): Observable<Item[]> {
    return this.http.get<ApiResponse<ItemResponse[]>>(this.url.concat('cart-items'), {
      headers: this.utilsService.initHeaders()
    }).pipe(
      map((response: ApiResponse<ItemResponse[]>) => response.data.map(item => this.itemMapper.map(item))),
      catchError((errResponse: ApiResponse<any>) => this.utilsService.handleApiError(errResponse, []))
    );
  }

  public addItemToCart(itemId: string): Observable<Item[]> {
    return this.http.post<ApiResponse<ItemResponse[]>>(this.url.concat('add-to-cart'), {
      itemId: itemId
    }, {
      headers: this.utilsService.initHeaders()
    }).pipe(
      map((response: ApiResponse<ItemResponse[]>) => response.data.map(item => this.itemMapper.map(item))),
      catchError((errResponse: ApiResponse<any>) => this.utilsService.handleApiError(errResponse, []))
    );
  }

  public deleteItemFromCart(itemId: string): Observable<Item[]> {
    return this.http.delete<ApiResponse<ItemResponse[]>>(this.url.concat('remove-from-cart'), {
      params: {
        itemId: itemId
      },
      headers: this.utilsService.initHeaders()
    }).pipe(
      map((response: ApiResponse<ItemResponse[]>) => response.data.map(item => this.itemMapper.map(item))),
      catchError((errResponse: ApiResponse<any>) => this.utilsService.handleApiError(errResponse, []))
    );
  }

  public fetchCartItemDetails(itemId: string): Observable<Detail[]> {
    return this.http.get<ApiResponse<DetailResponse[]>>(this.url.concat('cart-item-details'), {
      params: {
        itemId: itemId
      },
      headers: this.utilsService.initHeaders()
    }).pipe(
      map((response: ApiResponse<DetailResponse[]>) => response.data.map(item => this.detailMapper.map(item))),
      catchError((errResponse: ApiResponse<any>) => this.utilsService.handleApiError(errResponse, []))
    );
  }
}
