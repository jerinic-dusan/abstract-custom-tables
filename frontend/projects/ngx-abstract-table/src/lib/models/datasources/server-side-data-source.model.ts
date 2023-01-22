import {AbstractDataSource} from "./abstract-data-source.interface";
import {CollectionViewer} from "@angular/cdk/collections";
import {BehaviorSubject, Observable} from "rxjs";
import {TableData} from "../table-data.interface";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";

/**
 * Server side data source implementation for interacting with data with a help of a external server for filter, pagination and sorting events.
 */
export class ServerSideDataSource implements AbstractDataSource{

  loading: Observable<boolean>;
  private loadingSubject: BehaviorSubject<boolean>;
  private tableDataSubject: BehaviorSubject<TableData[]>;

  constructor(inputData?: TableData[]) {
    this.tableDataSubject = inputData ? new BehaviorSubject(inputData) : new BehaviorSubject<TableData[]>([]);
    this.loadingSubject = new BehaviorSubject<boolean>(false);
    this.loading = this.loadingSubject.asObservable();
  }

  public connect(collectionViewer: CollectionViewer): Observable<TableData[]> {
    return this.tableDataSubject.asObservable();
  }

  public disconnect(collectionViewer: CollectionViewer): void {
    this.tableDataSubject.complete();
    this.loadingSubject.complete();
  }

  public dataLength(): number {
    return this.tableDataSubject.value.length;
  }

  public hasData(): boolean {
    return this.tableDataSubject.value.length > 0;
  }

  public set(data: TableData[]): void {
    this.tableDataSubject.next(data);
  }

  public get(index: number): TableData {
    return this.tableDataSubject.value[index];
  }

  public all(): TableData[] {
    return this.tableDataSubject.value;
  }

  public add(item: TableData): void {
    const tableData = this.tableDataSubject.value;
    tableData.push(item);
    this.tableDataSubject.next(tableData);
  }

  public remove(item: TableData): void {
    const tableDataFiltered = this.tableDataSubject.value.filter(tableItem => tableItem.id !== item.id);
    this.tableDataSubject.next(tableDataFiltered);
  }

  public edit(item: TableData): void {
    const tableData = this.tableDataSubject.value;
    const tableItemIndex = tableData.indexOf(item);
    if (tableItemIndex > -1) {
      tableData.splice(tableItemIndex, 1, item);
      this.tableDataSubject.next(tableData);
    }
  }

  public loadingOn(): void {
    this.loadingSubject.next(true);
  }

  public loadingOff(): void {
    this.loadingSubject.next(false);
  }

  public setPaginator(paginator: MatPaginator): void {
    return;
  }

  public getPaginator(): MatPaginator | null {
    return null;
  }

  public setSort(sort: MatSort): void {
    return;
  }

  public setFilter(filter: string): void {
    return;
  }

}
