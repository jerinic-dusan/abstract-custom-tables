import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import {TableData} from "../../models/table-data.interface";
import {UtilsService} from "../../services/utils.service";
import {MatSort} from "@angular/material/sort";
import {MatPaginator} from "@angular/material/paginator";
import {fromEvent, merge} from "rxjs";
import {debounceTime, distinctUntilChanged, tap} from "rxjs/operators";
import {Configuration} from "../../models/input/configuration.enum";
import {FilterConfiguration} from "../../models/input/filter-configuration.interface";
import {SortConfiguration} from "../../models/input/sort-configuration.interface";
import {PaginatorConfiguration} from "../../models/input/paginator-configuration.interface";
import {DetailsConfiguration} from "../../models/input/details-configuration.interface";
import {FooterConfiguration} from "../../models/input/footer-configuration.interface";
import {HeaderConfiguration} from "../../models/input/header-configuration.interface";
import {StyleConfiguration} from "../../models/input/style-configuration.interface";
import {AbstractDataSource} from "../../models/datasources/abstract-data-source.interface";
import {ClientSideDataSource} from "../../models/datasources/client-side-data-source.model";
import {ServerSideDataSource} from "../../models/datasources/server-side-data-source.model";
import {DataAlignment} from "../../models/enums/data-alignment.enum";

@Component({
  selector: 'ngx-custom-table',
  templateUrl: './custom-table.component.html',
  styleUrls: ['./custom-table.component.css']
})
export class CustomTableComponent implements OnInit, OnChanges, AfterViewInit {

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('filter') filter!: ElementRef;

  @Input('data') data: TableData[] = [];
  @Input('fetch') fetch: ((filter? : string,
                           sortDirection?: string,
                           pageIndex?: number,
                           pageSize?: number) => void) | undefined;
  @Output() rowClicked = new EventEmitter<TableData | null>();
  @Input('configuration') configuration: Configuration = Configuration.CLIENT_SIDE;
  @Input('filterConfiguration') filterConfiguration: FilterConfiguration | undefined;
  @Input('sortConfiguration') sortConfiguration: SortConfiguration | undefined;
  @Input('paginatorConfiguration') paginatorConfiguration: PaginatorConfiguration | undefined;
  @Input('detailsConfiguration') detailsConfiguration: DetailsConfiguration | undefined;
  @Input('footerConfiguration') footerConfiguration: FooterConfiguration | undefined;
  @Input('headerConfiguration') headerConfiguration: HeaderConfiguration | undefined;
  @Input('styleConfiguration') styleConfiguration: StyleConfiguration | undefined;

  public dataSource: AbstractDataSource = new ClientSideDataSource();
  public dataSourceColumns: string[] = [];
  public selected: TableData | null = null;
  private configurationFlag: boolean = false;
  private dataFlag: boolean = false;

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
      this.dataSource.set(this.data);
      this.initTableColumns();
      this.dataSource.loadingOff();
    }
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    // When using client side we set sort and paginator on dataSource
    if (this.configuration === Configuration.CLIENT_SIDE){
      if (this.sortConfiguration) {
        this.dataSource.setSort(this.sort);
      }
      if (this.paginatorConfiguration) {
        this.dataSource.setPaginator(this.paginator);
      }
    }else{
      // When using server side search we place event listeners on sort and paginator
      this.sort.sortChange.subscribe(() => this.resetPaginator());

      // On sort or paginate events, load a new page
      merge(this.sort.sortChange, this.paginator.page)
        .pipe(
          tap(() => this.tableEvent())
        )
        .subscribe();
    }

    // Filter event needs to be handled both for client and server side implementations
    if (this.filterConfiguration){
      fromEvent(this.filter.nativeElement,'keyup')
        .pipe(
          debounceTime(150),
          distinctUntilChanged(),
          tap(() => {
            this.resetPaginator();
            this.tableEvent();
          })
        )
        .subscribe();
    }
  }

  private initTableColumns() {
    if (!this.dataFlag){
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
    if (this.filterConfiguration) {
      const filter: string = this.filter.nativeElement.value;
      this.dataSource.setFilter(filter.trim().toLowerCase());
    }
  }

  private serverSideFetch(): void {
    this.dataSource.loadingOn();
    const filter = this.filter ? this.filter.nativeElement.value : undefined;
    const sortDirection = this.sort ? this.sort.direction : undefined;
    const pageIndex = this.paginator ? this.paginator.pageIndex : undefined;
    const pageSize = this.paginator ? this.paginator.pageSize : undefined;
    if (this.fetch) {
      this.fetch(filter, sortDirection, pageIndex, pageSize);
    }
  }

  private resetPaginator() {
    if (this.configuration === Configuration.CLIENT_SIDE) {
      this.dataSource.getPaginator()?.firstPage();
    }else{
      this.paginator.pageIndex = 0;
    }
  }

  public elementClicked(element: TableData | null): void {
    this.selected = this.selected === element ? null : element;
    this.rowClicked.emit(this.selected);
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

  public paginatorLength(): number {
    if (this.configurationFlag){
      if (this.configuration === Configuration.CLIENT_SIDE){
        return this.dataSource.dataLength();
      }else{
        if (this.paginatorConfiguration && this.paginatorConfiguration.totalData){
          return this.paginatorConfiguration.totalData;
        }
      }
    }
    return 0;
  }

}
