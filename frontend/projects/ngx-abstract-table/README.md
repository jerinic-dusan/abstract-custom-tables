# NgxAbstractTable
NgxAbstractTable is an angular library build for customizing angular material tables with passable configuration.
The library supports both server-side and client-side pagination, ﬁltering and sorting by using polymorphic data sources.
CustomTableComponent expects multiple input variables for certain options to be activated.
Table is then displayed and can be interacted with certain events, such as: rowClick, childClick and CRUD operations.

## Configuration
CustomTableComponent expects input as shown below:
```
  data?: TableData[];
  details?: TableData[] | any;
  fetch?: (filter? : string,
            sortDirection?: string,
            pageIndex?: number,
            pageSize?: number) => void;
  rowClicked?: (row: TableData | null) => void;
  childClicked?: (row: TableData | null) => void;
  configuration: Configuration;
  filterConfiguration?: FilterConfiguration;
  sortConfiguration?: SortConfiguration;
  paginatorConfiguration?: PaginatorConfiguration;
  footerConfiguration?: FooterConfiguration;
  headerConfiguration?: HeaderConfiguration;
  styleConfiguration?: StyleConfiguration;
  customChildComponent?: TemplateRef<any>;
```
[AbstractCustomTable](src/lib/models/abstract-custom-table.interface.ts) interface can be implement on parent component of CustomTableComponent implementation.
Let's go over all configurable options: 

### Data
Main data array to be displayed. This should be a class of choice which implements [TableData](src/lib/models/table-data.interface.ts) interface.
TableData interface includes column meta-data which is mandatory for table to be functioning properly.

### Details
Details data array or object to be displayed. This can be a child table class which also implements TableData interface, or an any object to be passed as data for CustomChildComponent.

### Fetch function
Fetch function specifies the function to be called from within the CustomTableComponent to fetch server-side data with included parameters specifying filter, sort, and pagination data.

### Row click event function
Row click event function is called when parent table row is clicked.

### Child click event function
Child click event function is called when child table is clicked.

### Configuration
Main configuration specifying the data source implementation which is either server-side or client-side.
Server-side implementation will use fetch function to fetch new data on sort, filter and pagination events.
Client-side implementation will wait for new data to be passed to display new data. Sort, filter and pagination events happen on already passed data.

### Filter configuration
Filter configuration specifies mat-form-field options and its documentation can be found [here](src/lib/models/input/filter-configuration.interface.ts)

### Sort configuration
Sort configuration specifies mat-sort-header options and its documentation can be found [here](src/lib/models/input/sort-configuration.interface.ts)

### Paginator configuration
Paginator configuration specifies mat-paginator options and its documentation can be found [here](src/lib/models/input/paginator-configuration.interface.ts)

### Footer configuration
Footer configuration specifies mat-footer-row options and its documentation can be found [here](src/lib/models/input/footer-configuration.interface.ts)

### Header configuration
Header configuration specifies mat-header-row options and its documentation can be found [here](src/lib/models/input/header-configuration.interface.ts)

### Style configuration
Style configuration specifies styling options and its documentation can be found [here](src/lib/models/input/style-configuration.interface.ts)

### Custom child component
Custom child component specifies the child component to be displayed for each row

## Examples of passing the input
```
<ngx-custom-table
  [configuration]="configuration"
  [data]="items$ | async"
  [details]="details$ | async"
  [filterConfiguration]="filterConfiguration"
  [paginatorConfiguration]="paginatorConfiguration"
  [sortConfiguration]="sortingConfiguration"
  [styleConfiguration]="styleConfiguration"
  [fetch]="fetchAllItemsPages.bind(this)"
  (rowClicked)="itemClicked($event)"
  (childClicked)="childClicked($event)">
</ngx-custom-table>
```
```
<ngx-custom-table
  [configuration]="configuration"
  [data]="items$ | async"
  [details]="details$ | async"
  (rowClicked)="itemClicked($event)"
  [filterConfiguration]="filterConfiguration"
  [sortConfiguration]="sortingConfiguration"
  [styleConfiguration]="styleConfiguration"
  [customChildComponent]="customChild">
</ngx-custom-table>

<ng-template #customChild>
  <app-cart-item-details [details]="details$ | async"></app-cart-item-details>
</ng-template>
```

## End result
![Homepage-Image](https://raw.githubusercontent.com/jerinic-dusan/abstract-custom-tables/main/homepage.png)

## Updates
Library will get new updates depending on if there is any need for them. For now,  I hope anyone that uses it gets a good use out of it.

## Non-commercial use
This library is my personal project, and it does not have direct or indirect income-generating use. It will not be marketed or sold.

## Links
* [GitHub](https://github.com/jerinic-dusan)
* [LinkedIn](https://www.linkedin.com/in/dusan-jerinic/)
