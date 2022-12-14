import {TableData} from "./table-data.interface";
import {Configuration} from "./input/configuration.enum";
import {FilterConfiguration} from "./input/filter-configuration.interface";
import {SortConfiguration} from "./input/sort-configuration.interface";
import {PaginatorConfiguration} from "./input/paginator-configuration.interface";
import {DetailsConfiguration} from "./input/details-configuration.interface";
import {FooterConfiguration} from "./input/footer-configuration.interface";
import {HeaderConfiguration} from "./input/header-configuration.interface";
import {StyleConfiguration} from "./input/style-configuration.interface";

export interface AbstractCustomTable {
  data?: TableData[];
  fetch?: (filter? : string,
            sortDirection?: string,
            pageIndex?: number,
            pageSize?: number) => void;
  rowClicked?: (row: TableData | null) => void;
  configuration: Configuration;
  filterConfiguration?: FilterConfiguration;
  sortConfiguration?: SortConfiguration;
  paginatorConfiguration?: PaginatorConfiguration;
  detailsConfiguration?: DetailsConfiguration;
  footerConfiguration?: FooterConfiguration;
  headerConfiguration?: HeaderConfiguration;
  styleConfiguration?: StyleConfiguration;
}
