import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges, TemplateRef,
  ViewChild
} from '@angular/core';
import {TableData} from "../../models/table-data.interface";
import {UtilsService} from "../../services/utils.service";
import {MatSort} from "@angular/material/sort";
import {MatPaginator} from "@angular/material/paginator";
import {fromEvent, merge, Observable, of} from "rxjs";
import {catchError, debounceTime, distinctUntilChanged, tap} from "rxjs/operators";
import {Configuration} from "../../models/input/configuration.enum";
import {FilterConfiguration} from "../../models/input/filter-configuration.interface";
import {SortConfiguration} from "../../models/input/sort-configuration.interface";
import {PaginatorConfiguration} from "../../models/input/paginator-configuration.interface";
import {FooterConfiguration} from "../../models/input/footer-configuration.interface";
import {HeaderConfiguration} from "../../models/input/header-configuration.interface";
import {StyleConfiguration} from "../../models/input/style-configuration.interface";
import {AbstractDataSource} from "../../models/datasources/abstract-data-source.interface";
import {ClientSideDataSource} from "../../models/datasources/client-side-data-source.model";
import {ServerSideDataSource} from "../../models/datasources/server-side-data-source.model";
import {DataAlignment} from "../../models/enums/data-alignment.enum";
import {animate, state, style, transition, trigger} from "@angular/animations";

@Component({
  selector: 'ngx-custom-table',
  templateUrl: './custom-table.component.html',
  styleUrls: ['./custom-table.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class CustomTableComponent implements OnInit, OnChanges, AfterViewInit {

  @ViewChild(MatPaginator) paginator: MatPaginator | null = null;
  @ViewChild(MatSort) sort: MatSort | null = null;
  @ViewChild('filter') filter: ElementRef | null = null;

  @Input('data') data: TableData[] | null = [];
  @Input('details') details: TableData[] | any;
  @Input('fetch') fetch: ((filter? : string,
                           sortColumn?: string,
                           sortDirection?: string,
                           pageIndex?: number,
                           pageSize?: number) => void) | undefined;
  @Output() rowClicked = new EventEmitter<TableData | null>();
  @Output() childClicked = new EventEmitter<TableData | null>();
  @Input('configuration') configuration: Configuration = Configuration.CLIENT_SIDE;
  @Input('filterConfiguration') filterConfiguration: FilterConfiguration | undefined;
  @Input('sortConfiguration') sortConfiguration: SortConfiguration | undefined;
  @Input('paginatorConfiguration') paginatorConfiguration: PaginatorConfiguration | undefined;
  @Input('footerConfiguration') footerConfiguration: FooterConfiguration | undefined;
  @Input('headerConfiguration') headerConfiguration: HeaderConfiguration | undefined;
  @Input('styleConfiguration') styleConfiguration: StyleConfiguration | undefined;
  @Input('customChildComponent') customChildComponent: TemplateRef<any> | undefined;

  public dataSource: AbstractDataSource = new ClientSideDataSource();
  public dataSourceColumns: string[] = [];
  public selected: TableData | null = null;
  private configurationFlag: boolean = false;
  private dataFlag: boolean = false;
  public paginatorLength: Observable<number> = of(0);

  constructor(private utilsService: UtilsService) {}

  ngOnChanges(changes: SimpleChanges): void {
    // First configuration check and dataSource initialization
    if (this.utilsService.checkForChanges(changes.configurations) && !this.configurationFlag){
      if (this.configuration === Configuration.CLIENT_SIDE){
        this.dataSource = new ClientSideDataSource();
      }else{
        this.dataSource = new ServerSideDataSource();
      }
      this.dataSource.loadingOn();
      this.configurationFlag = true;
    }

    // Checking for new incoming data
    if (this.utilsService.checkForChanges(changes.data)){
      this.dataSource.set(this.data ? this.data : []);
      this.paginatorLength = this.setPaginatorLength();
      this.initTableColumns();
      this.dataSource.loadingOff();
    }

    if (this.utilsService.checkForChanges(changes.paginatorConfiguration)){
      this.paginatorLength = this.setPaginatorLength();
    }
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    // When using client side we set sort and paginator on dataSource
    if (this.configuration === Configuration.CLIENT_SIDE){
      if (this.sortConfiguration && this.sort) {
        this.dataSource.setSort(this.sort);
      }
      if (this.paginatorConfiguration && this.paginator) {
        this.dataSource.setPaginator(this.paginator);
      }
    }else{
      // When using server side search we place event listeners on sort and paginator
      this.sort?.sortChange.subscribe(() => this.resetPaginator());

      // On sort or paginate events, load a new page
      if (this.sort && this.paginator){
        merge(this.sort.sortChange, this.paginator.page)
          .pipe(
            tap(() => this.tableEvent())
          )
          .subscribe();
      }
    }

    // Filter event needs to be handled both for client and server side implementations
    fromEvent(this.filter?.nativeElement,'keyup')
      .pipe(
        debounceTime(150),
        distinctUntilChanged(),
        tap(() => {
          this.resetPaginator();
          this.tableEvent();
        }),
        catchError(() => of())
      )
      .subscribe();

  }

  private initTableColumns() {
    if (!this.dataFlag && this.dataSource.hasData()){
      this.dataSourceColumns = this.utilsService.getColumns(this.dataSource.get(0));
      this.dataFlag = true;
    }
  }

  //Filter, pagination, sorting events
  private tableEvent(): void {
    if (this.configuration === Configuration.CLIENT_SIDE) {
      this.clientSideFetch();
    } else {
      this.serverSideFetch();
    }
  }

  private clientSideFetch(): void {
    if (this.filterConfiguration && this.filter) {
      const filter: string = this.filter.nativeElement.value;
      this.dataSource.setFilter(filter.trim().toLowerCase());
    }
  }

  private serverSideFetch(): void {
    this.dataSource.loadingOn();
    const filter = this.filter ? this.filter.nativeElement.value : undefined;
    const sortColumn = this.sort ? this.sort.active : undefined;
    const sortDirection = this.sort ? this.sort.direction : undefined;
    const pageIndex = this.paginator ? this.paginator.pageIndex + 1 : undefined;
    const pageSize = this.paginator ? this.paginator.pageSize : undefined;
    if (this.fetch) {
      this.fetch(filter, sortColumn, sortDirection, pageIndex, pageSize);
    }
  }

  private resetPaginator() {
    if (this.configuration === Configuration.CLIENT_SIDE) {
      this.dataSource.getPaginator()?.firstPage();
    }else{
      if (this.paginator){
        this.paginator.pageIndex = 0;
      }
    }
  }

  public elementClicked(element: TableData | null): void {
    this.selected = this.selected === element ? null : element;
    this.rowClicked.emit(this.selected);
  }

  public detailClicked(element: TableData | null): void {
    this.childClicked.emit(element);
  }

  // Styling and formatting functions
  public getFooterCellValue(column: string): string {
    return this.footerConfiguration?.customFooter ?
      this.footerConfiguration.customFooter(column) :
      this.utilsService.getFooterCellValue(this.dataSource.all(), column);
  }

  public getCellAlignment(column: string): string {
    return this.dataSource.hasData() ? this.utilsService.getAlignment(this.dataSource.get(0), column) : DataAlignment.NORMAL;
  }

  public getCellFormatting(item: TableData, column: string): string {
    return this.utilsService.getCellFormatting(item, column);
  }

  public getSortHeader(column: string): any {
    return this.dataSource.hasData() ? this.utilsService.getAttributeName(this.dataSource.get(0), column) : '';
  }

  public rowBackgroundColor(element: TableData): string {
    if (this.selected === element && this.styleConfiguration && this.styleConfiguration.selectedRowColor){
      return this.styleConfiguration.selectedRowColor;
    }else {
      return '#FFFFFF'
    }
  }

  private setPaginatorLength(): Observable<number> {
    if (this.paginatorConfiguration && this.paginatorConfiguration.totalData) {
      return of(this.paginatorConfiguration.totalData);
    }else {
      return of(this.dataSource.dataLength())
    }
  }

}
