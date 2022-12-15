import {CollectionViewer} from "@angular/cdk/collections";
import {Observable} from "rxjs";
import {TableData} from "../table-data.interface";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";

export interface AbstractDataSource {
  loading: Observable<boolean>;
  connect(collectionViewer: CollectionViewer): Observable<TableData[]>
  disconnect(collectionViewer: CollectionViewer): void
  dataLength(): number
  hasData(): boolean
  set(data: TableData[]): void
  get(index: number): TableData
  all(): TableData[]
  add(item: TableData): void
  remove(item: TableData): void
  edit(item: TableData): void
  loadingOn(): void
  loadingOff(): void
  setSort(sort: MatSort): void
  setPaginator(paginator: MatPaginator): void
  getPaginator(): MatPaginator | null
  setFilter(filter: string): void
}
