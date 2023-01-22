import {MatTableDataSource} from "@angular/material/table";
import {TableData} from "../table-data.interface";
import {AbstractDataSource} from "./abstract-data-source.interface";
import {BehaviorSubject, Observable} from "rxjs";
import {MatSort} from "@angular/material/sort";
import {MatPaginator} from "@angular/material/paginator";

/**
 * Client side data source implementation for interacting with data completely on client side.
 * This implementation used MatTableDataSource under the hood as most of the angular material table examples show.
 * Filtering, pagination and sorting is done on passed data within the datasource.
 */
export class ClientSideDataSource extends MatTableDataSource<TableData> implements AbstractDataSource{

  public loading: Observable<boolean>;
  private loadingSubject: BehaviorSubject<boolean>;

  constructor(initialData?: TableData[]) {
    super(initialData ? initialData : []);
    this.loadingSubject = new BehaviorSubject<boolean>(false);
    this.loading = this.loadingSubject.asObservable();
  }

  public dataLength(): number {
    return this.data.length;
  }

  public hasData(): boolean {
    return this.data.length > 0;
  }

  public set(data: TableData[]): void {
    this.data = data
  }

  public get(index: number): TableData {
    return this.data[index];
  }

  public all(): TableData[] {
    return this.data;
  }

  public add(item: TableData): void {
    this.data.push(item);
  }

  public remove(item: TableData): void {
    const filteredArray = this.data.filter(item => item.id !== item.id);
    this.set(filteredArray);
  }

  public edit(item: TableData): void {
    const tableItemIndex = this.data.indexOf(item);
    if (tableItemIndex > -1){
      this.data.splice(tableItemIndex, 1, item);
    }
  }

  public loadingOn(): void {
    return;
  }

  public loadingOff(): void {
    return;
  }

  public setPaginator(paginator: MatPaginator): void {
    this.paginator = paginator;
  }

  public getPaginator(): MatPaginator | null {
    return this.paginator;
  }

  public setSort(sort: MatSort): void {
    this.sort = sort;
  }

  public setFilter(filter: string): void {
    this.filter = filter;
  }

}
