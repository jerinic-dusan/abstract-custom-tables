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

/**
 * Main component for implementing custom angular material tables.
 * Component checks passed configuration to choose the correct data source implementation depending on if user wants server or client side implementation.
 * Each table has the possibility of having filtering, pagination, sorting, custom footer values and child rows with custom components or recursive table implementation.
 * Table has event handlers for filter, pagination and sort events, as well as row and child row clicking events.
 */
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

  /**
   * First lifecycle method which checks for new incoming data, initialises correct datasource, columns and paginator length
   */
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

  /**
   * Last lifecycle method which initialises sort, filter and the paginator to the correct datasource implementation and their event changes.
   */
  ngAfterViewInit(): void {
    if (this.configuration === Configuration.CLIENT_SIDE){
      if (this.sortConfiguration && this.sort) {
        this.dataSource.setSort(this.sort);
      }
      if (this.paginatorConfiguration && this.paginator) {
        this.dataSource.setPaginator(this.paginator);
      }
    }else{
      this.sort?.sortChange.subscribe(() => this.resetPaginator());

      if (this.sort && this.paginator){
        merge(this.sort.sortChange, this.paginator.page)
          .pipe(
            tap(() => this.tableEvent())
          )
          .subscribe();
      }
    }

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

  /**
   * Method initialises data columns
   */
  private initTableColumns() {
    if (!this.dataFlag && this.dataSource.hasData()){
      this.dataSourceColumns = this.utilsService.getColumns(this.dataSource.get(0));
      this.dataFlag = true;
    }
  }

  /**
   * Method decides which configuration implementation to use on filter, pagination and sorting events
   */
  private tableEvent(): void {
    if (this.configuration === Configuration.CLIENT_SIDE) {
      this.clientSideFetch();
    } else {
      this.serverSideFetch();
    }
  }

  /**
   * Method applies filter to the client side datasource implementation
   */
  private clientSideFetch(): void {
    if (this.filterConfiguration && this.filter) {
      const filter: string = this.filter.nativeElement.value;
      this.dataSource.setFilter(filter.trim().toLowerCase());
    }
  }

  /**
   * Method calls server side implementation function
   */
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

  /**
   * Method resets paginator page to 0
   */
  private resetPaginator() {
    if (this.configuration === Configuration.CLIENT_SIDE) {
      this.dataSource.getPaginator()?.firstPage();
    }else{
      if (this.paginator){
        this.paginator.pageIndex = 0;
      }
    }
  }

  /**
   * Method sets current clicked element and emits the value to the parent component
   * @param element - Specifies clicked element
   */
  public elementClicked(element: TableData | null): void {
    this.selected = this.selected === element ? null : element;
    this.rowClicked.emit(this.selected);
  }

  /**
   * Method emits current clicked detail element to the parent component
   * @param element - Specifies clicked child element
   */
  public detailClicked(element: TableData | null): void {
    this.childClicked.emit(element);
  }


  /**
   * Method gets footer value for passed column. If custom footer function is supplied, default function is not used.
   * @param column - Specifies column name
   */
  public getFooterCellValue(column: string): string {
    return this.footerConfiguration?.customFooter ?
      this.footerConfiguration.customFooter(column) :
      this.utilsService.getFooterCellValue(this.dataSource.all(), column);
  }

  /**
   * Method gets cell alignment by passed column
   * @param column - Specifies column name
   */
  public getCellAlignment(column: string): string {
    return this.dataSource.hasData() ? this.utilsService.getAlignment(this.dataSource.get(0), column) : DataAlignment.NORMAL;
  }

  /**
   * Method gets cell formatting by checking item column data type
   * @param item - Specifies element
   * @param column - Specifies column
   */
  public getCellFormatting(item: TableData, column: string): string {
    return this.utilsService.getCellFormatting(item, column);
  }

  /**
   * Method gets header cell name programmatically
   * @param column - Specifies column name
   */
  public getSortHeader(column: string): any {
    return this.dataSource.hasData() ? this.utilsService.getAttributeName(this.dataSource.get(0), column) : '';
  }

  /**
   * Method sets row color by checking if element is clicked or not
   * @param element - Specifies row element
   */
  public rowBackgroundColor(element: TableData): string {
    if (this.selected === element && this.styleConfiguration && this.styleConfiguration.selectedRowColor){
      return this.styleConfiguration.selectedRowColor;
    }else {
      return '#FFFFFF'
    }
  }

  /**
   * Method sets paginator length by checking configuration implementation. If server side implementation is selected, user must provide total data information by passing it in paginatorConfiguration
   */
  private setPaginatorLength(): Observable<number> {
    if (this.paginatorConfiguration && this.paginatorConfiguration.totalData) {
      return of(this.paginatorConfiguration.totalData);
    }else {
      return of(this.dataSource.dataLength())
    }
  }

}
