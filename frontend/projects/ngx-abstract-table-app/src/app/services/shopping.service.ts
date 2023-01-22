import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";
import {Item, ItemMapper} from "../models/item.model";
import {ApiResponse} from "../models/responses/api-response.interface";
import {catchError, map, shareReplay} from "rxjs/operators";
import {HttpClient} from "@angular/common/http";
import {UtilsService} from "./utils.service";
import {ItemResponse} from "../models/responses/item-response.interface";
import {Detail, DetailMapper} from "../models/detail.model";
import {DetailResponse} from "../models/responses/detail-response.interface";
import {PagedItemsResponse} from "../models/responses/paged-items-response.interface";
import {PagedItems, PagedItemsMapper} from "../models/paged-items.model";

/**
 * Shopping service encapsulates all item and detail related http requests to the back-end.
 * It also holds the information for current selected items and whether the cart should be reloaded
 */
@Injectable({
  providedIn: 'root'
})
export class ShoppingService {

  private url: string = 'http://localhost:8080/home/';
  private reloadCart = new BehaviorSubject<boolean>(false);
  public reloadCart$ = this.reloadCart.asObservable();

  private selectedItem = new BehaviorSubject<Item | null>(null);
  public selectedItem$ = this.selectedItem.asObservable();

  constructor(private http: HttpClient,
              private utilsService: UtilsService,
              private itemMapper: ItemMapper,
              private pagedItemsMapper: PagedItemsMapper,
              private detailMapper: DetailMapper) {}

  public setReloadCart(bool: boolean): void {
    this.reloadCart.next(bool);
  }

  public setSelectedItem(item: Item | null): void {
    this.selectedItem.next(item);
  }

  /**
   * Method creates a http get request for all items and returns a mapped observable array.
   * If error is omitted, it's handled and an empty array is returned in an observable.
   */
  public fetchAllItems(): Observable<Item[]> {
    return this.http.get<ApiResponse<ItemResponse[]>>(this.url.concat('items'), {
      headers: this.utilsService.initHeaders()
    }).pipe(
      map((response: ApiResponse<ItemResponse[]>) => response.data.map(item => this.itemMapper.map(item))),
      catchError((errResponse: ApiResponse<any>) => this.utilsService.handleApiError(errResponse, [])),
      shareReplay()
    );
  }

  /**
   * Method creates a http get request for all paged items and returns a mapped observable array.
   * If error is omitted, it's handled and an empty array and 0 count is returned in an observable.
   * @param filter - Specifies filter value
   * @param sortColumn - Specifies column for sorting
   * @param sortDirection - Specifies sort direction
   * @param pageIndex - Specifies next or previous page index
   * @param pageSize - Specifies page size
   */
  public fetchAllItemsPaged(filter? : string,
                            sortColumn?: string,
                            sortDirection?: number,
                            pageIndex?: number,
                            pageSize?: number): Observable<PagedItems> {
    return this.http.get<ApiResponse<PagedItemsResponse>>(this.url.concat('items-paged'), {
      params: {
        page: pageIndex ? pageIndex : 1,
        size: pageSize ? pageSize : 5,
        sortColumn: sortColumn ? sortColumn : 'name',
        sortDirection: sortDirection ? sortDirection : 1,
        filter: filter ? filter : ''
      },
      headers: this.utilsService.initHeaders()
    }).pipe(
      map((response: ApiResponse<PagedItemsResponse>) => this.pagedItemsMapper.map(response.data)),
      catchError((errResponse: ApiResponse<any>) => this.utilsService.handleApiError(errResponse, new PagedItems([], 0))),
      shareReplay()
    );
  }

  /**
   * Method creates a http post request to add a new item and returns a mapped observable item.
   * If error is omitted, it's handled and a null value is returned in an observable.
   */
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

  /**
   * Method creates a http put request to edit an existing item and returns a mapped observable item.
   * If error is omitted, it's handled and a null value is returned in an observable.
   */
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

  /**
   * Method creates a http delete request to delete an existing item and returns an observable boolean value if deletion was successful.
   * If error is omitted, it's handled and a false boolean value is returned in an observable.
   */
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

  /**
   * Method creates a http get request to fetch all item details and returns a mapped observable array.
   * If error is omitted, it's handled and an empty array is returned in an observable.
   */
  public fetchItemDetails(id: string): Observable<Detail[]> {
    return this.http.get<ApiResponse<DetailResponse[]>>(this.url.concat('item-details'), {
      params: {
        id: id
      },
      headers: this.utilsService.initHeaders()
    }).pipe(
      map((response: ApiResponse<DetailResponse[]>) => response.data.map(item => this.detailMapper.map(item))),
      catchError((errResponse: ApiResponse<any>) => this.utilsService.handleApiError(errResponse, [])),
      shareReplay()
    );
  }

  /**
   * Method creates a http post request to add a new item detail and returns a mapped observable detail array.
   * If error is omitted, it's handled and an empty array is returned in an observable.
   */
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

  /**
   * Method creates a http put request to edit an existing item detail and returns a mapped observable detail array.
   * If error is omitted, it's handled and an empty array is returned in an observable.
   */
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

  /**
   * Method creates a http delete request to delete an existing item detail and returns a boolean observable.
   * If error is omitted, it's handled and a false boolean value is returned in an observable.
   */
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

  /**
   * Method creates a http get request for all cart items and returns a mapped observable array.
   * If error is omitted, it's handled and an empty array is returned in an observable.
   */
  public fetchCartItems(): Observable<Item[]> {
    return this.http.get<ApiResponse<ItemResponse[]>>(this.url.concat('cart-items'), {
      headers: this.utilsService.initHeaders()
    }).pipe(
      map((response: ApiResponse<ItemResponse[]>) => response.data.map(item => this.itemMapper.map(item))),
      catchError((errResponse: ApiResponse<any>) => this.utilsService.handleApiError(errResponse, [])),
      shareReplay()
    );
  }

  /**
   * Method creates a http post request to add an item to the cart and returns a mapped observable array.
   * If error is omitted, it's handled and an empty array is returned in an observable.
   */
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

  /**
   * Method creates a http delete request to remove an item from the cart and returns a mapped observable array.
   * If error is omitted, it's handled and an empty array is returned in an observable.
   */
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

  /**
   * Method creates a http get request for all cart item details and returns a mapped observable array.
   * If error is omitted, it's handled and an empty array is returned in an observable.
   */
  public fetchCartItemDetails(itemId: string): Observable<Detail[]> {
    return this.http.get<ApiResponse<DetailResponse[]>>(this.url.concat('cart-item-details'), {
      params: {
        itemId: itemId
      },
      headers: this.utilsService.initHeaders()
    }).pipe(
      map((response: ApiResponse<DetailResponse[]>) => response.data.map(item => this.detailMapper.map(item))),
      catchError((errResponse: ApiResponse<any>) => this.utilsService.handleApiError(errResponse, [])),
      shareReplay()
    );
  }
}
