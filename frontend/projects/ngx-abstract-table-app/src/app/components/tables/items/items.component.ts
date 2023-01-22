import {DetailEditorDialogComponent} from "../../dialogs/detail-editor-dialog/detail-editor-dialog.component";
import {ItemEditorDialogComponent} from "../../dialogs/item-editor-dialog/item-editor-dialog.component";
import {Component, OnInit} from '@angular/core';
import {Item} from "../../../models/item.model";
import {Detail} from "../../../models/detail.model";
import {ShoppingService} from "../../../services/shopping.service";
import {UtilsService} from "../../../services/utils.service";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {Observable, of} from "rxjs";
import {map, tap} from "rxjs/operators";
import {ComponentType} from "@angular/cdk/overlay";
import {
  Configuration,
  FilterAppearance,
  FilterConfiguration,
  PaginatorConfiguration,
  SortArrowPosition,
  SortConfiguration,
  StyleConfiguration,
  TableData
} from "ngx-abstract-table";

/**
 * Items component for displaying "store" items and handling their actions.
 */
@Component({
  selector: 'app-items',
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.scss']
})
export class ItemsComponent implements OnInit {

  public configuration = Configuration.SERVER_SIDE;
  public items$: Observable<Item[]> = of([]);
  public details$: Observable<Detail[]> = of([]);
  public selectedItem: Item | null = null;
  public selectedItemDetail: Detail | null = null;

  public filterConfiguration: FilterConfiguration = {filterLabel: 'Search', filterPlaceholder: 'Try searching pro...', filterAppearance: FilterAppearance.STANDARD};
  public paginatorConfiguration: PaginatorConfiguration = {pageSizes: [5, 10], totalData: 0};
  public sortingConfiguration: SortConfiguration = {arrowPosition: SortArrowPosition.AFTER};
  public styleConfiguration: StyleConfiguration = {alternatingRowColors: true, selectedRowColor: '#ff4081'};

  constructor(private shoppingService: ShoppingService,
              private utilsService: UtilsService,
              private dialog: MatDialog) {
    this.fetchAllItemsPages();
  }

  ngOnInit(): void {
  }

  /**
   * Method for fetching data from the back-end
   * @param filter - Specifies filter value
   * @param sortColumn - Specifies column for sorting
   * @param sortDirection - Specifies sort direction
   * @param pageIndex - Specifies next or previous page index
   * @param pageSize - Specifies page size
   */
  public fetchAllItemsPages(filter? : string, sortColumn?: string, sortDirection?: string, pageIndex?: number, pageSize?: number): void {
    const column = sortColumn && sortColumn.startsWith('_') ? sortColumn.slice(1) : sortColumn;
    const direction = sortDirection ? sortDirection === 'asc' ? 1 : -1 : 1;

    this.shoppingService.fetchAllItemsPaged(filter, column, direction, pageIndex, pageSize)
      .subscribe(response => {
        this.items$ = of(response.items);
        this.paginatorConfiguration.totalData = response.count;
        this.selectedItem = null;
      })
  }

  /**
   * Method opens an item editor dialog and attempts to add a new item to the observable array
   */
  public addItem(): void {
    this.openDialog(ItemEditorDialogComponent).afterClosed().subscribe(result => {
      if (result && result.data){
        this.shoppingService.addItem(result.data.name, result.data.type, result.data.price).subscribe(item => {
          this.items$ = this.items$.pipe(tap((items: Item[]) => this.addItemIfExists(items, item)));
          this.selectedItem = null;
          this.shoppingService.setReloadCart(true);
        });
      }
    });
  }

  /**
   * Method opens an item editor dialog and attempts to edit an existing item and change it in the observable array
   */
  public editItem(): void {
    if (this.selectedItem){
      this.openDialog(ItemEditorDialogComponent, this.selectedItem).afterClosed().subscribe(result => {
        if (result && result.data){
          this.shoppingService.editItem(result.data).subscribe(item => {
            this.items$ = this.items$.pipe(tap((items: Item[]) => this.editItemIfExists(items, item)));
            this.selectedItem = null;
            this.shoppingService.setReloadCart(true);
          });
        }
      });
    }else{
      this.utilsService.handleClientError('No item selected', 'Please select an item');
    }
  }

  /**
   * Method attempts to delete an item and remove it from the observable array
   */
  public deleteItem(): void {
    if (this.selectedItem){
      this.shoppingService.deleteItem(this.selectedItem.id).subscribe(value => {
        if (value && this.selectedItem) {
          const id = this.selectedItem.id;
          this.items$ = this.items$.pipe(map((items: Item[]) => items.filter(item => item.id !== id)));
          this.selectedItem = null;
          this.shoppingService.setReloadCart(true);
        }
      });
    }else{
      this.utilsService.handleClientError('No item selected', 'Please select an item');
    }
  }

  /**
   * Method fetches all item details and places them in details observable array
   */
  public fetchItemDetails(): void {
    if (this.selectedItem){
      this.details$ = this.shoppingService.fetchItemDetails(this.selectedItem.id);
    }
  }

  /**
   * Method opens a detail editor dialog and attempts to add a new detail to the observable array
   */
  public addItemDetail(): void {
    if (this.selectedItem){
      this.openDialog(DetailEditorDialogComponent).afterClosed().subscribe(result => {
        if (result && result.data && this.selectedItem){
          this.shoppingService.addItemDetail(this.selectedItem.id, result.data.name, result.data.value).subscribe(details => {
            this.details$ = this.details$.pipe(map(() => details));
          });
        }
      });
    }else{
      this.utilsService.handleClientError('No item selected', 'Please select an item');
    }
  }

  /**
   * Method opens a detail editor dialog and attempts to edit an existing detail in the observable array
   */
  public editItemDetail(): void {
    if (this.selectedItem && this.selectedItemDetail){
      this.openDialog(DetailEditorDialogComponent, this.selectedItemDetail).afterClosed().subscribe(result => {
        if (result && result.data && this.selectedItem){
          this.shoppingService.editItemDetail(this.selectedItem.id, result.data.id, result.data.name, result.data.value).subscribe(details => {
            this.details$ = this.details$.pipe(map(() => details));
            this.selectedItemDetail = null;
          });
        }
      });
    }else{
      this.utilsService.handleClientError('No detail selected', 'Please select a detail');
    }
  }

  /**
   * Method attempts to delete an existing detail and remove it from the observable array
   */
  public deleteItemDetail(): void {
    if (this.selectedItem && this.selectedItemDetail){
      this.shoppingService.deleteItemDetail(this.selectedItem.id, this.selectedItemDetail.id).subscribe(value => {
        if (value && this.selectedItemDetail) {
          const id = this.selectedItemDetail.id;
          this.details$ = this.details$.pipe(map((details: Detail[]) => details.filter(detail => detail.id !== id)));
          this.selectedItemDetail = null;
        }
      });
    }else{
      this.utilsService.handleClientError('No detail selected', 'Please select a detail');
    }
  }

  /**
   * Method handles the item click event and fetches item details if
   */
  public itemClicked(item: TableData | null): void {
    this.selectedItem = <Item>item;
    this.fetchItemDetails();
    this.shoppingService.setSelectedItem(this.selectedItem);
  }

  /**
   * Method handles the child click event
   */
  public childClicked(child: TableData | null): void {
    this.selectedItemDetail = <Detail>child;
  }

  /**
   * Method adds an item to the item array if item is present
   * @param items - Specifies the item array
   * @param item - Specifies the item to be added
   */
  private addItemIfExists(items: Item[], item: Item | null): void {
    if (item){
      items.push(item);
    }
  }

  /**
   * Method finds the item to be edited and replaces the old one with it
   * @param items - Specifies the item array
   * @param item - Specifies the item to be edited
   * @private
   */
  private editItemIfExists(items: Item[], item: Item | null): void {
    const foundItem = item ? items.find(element => element.id === item.id) : null;
    const foundIndex = foundItem ? items.indexOf(foundItem) : -1
    if (foundIndex > -1 && item){
      items.splice(foundIndex, 1, item);
    }
  }

  /**
   * Method opens the passed custom dialog and return the dialog ref
   * @param component - Specifies the component dialog
   * @param data - Specifies the dialog data
   * @private
   */
  private openDialog<T>(component: ComponentType<T>, data: Item | Detail | null = null): MatDialogRef<T> {
    return this.dialog.open(component, {
      width: '350px',
      autoFocus: false,
      data: data
    });
  }
}
