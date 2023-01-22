import {TableData} from "./table-data.interface";
import {Configuration} from "./input/configuration.enum";
import {FilterConfiguration} from "./input/filter-configuration.interface";
import {SortConfiguration} from "./input/sort-configuration.interface";
import {PaginatorConfiguration} from "./input/paginator-configuration.interface";
import {FooterConfiguration} from "./input/footer-configuration.interface";
import {HeaderConfiguration} from "./input/header-configuration.interface";
import {StyleConfiguration} from "./input/style-configuration.interface";
import {TemplateRef} from "@angular/core";

/**
 * Interface specifying abstract custom table options and can be implemented on the component that's implementing the abstract custom table component
 * @data - Specifies main data array to be displayed
 * @details - Specifies details data array or object to be displayed
 * @fetch - Specifies fetch function for server side filter, pagination and sorting
 * @rowClicked - Specifies the function for row click event
 * @childClicked - Specifies the function for child click event
 * @configuration - Specifies the main configuration and data source implementation
 * @filterConfiguration - Specifies the filter configuration options
 * @sortConfiguration - Specifies the sort configuration options
 * @paginatorConfiguration - Specifies the pagination configuration options
 * @footerConfiguration - Specifies the footer configuration options
 * @headerConfiguration - Specifies the header configuration options
 * @styleConfiguration - Specifies the style configuration options
 * @customChildComponent - Specifies the child component to be displayed for each row
 */
export interface AbstractCustomTable {
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
}
