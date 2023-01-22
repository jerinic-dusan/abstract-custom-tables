/**
 * Interface specifying paginator options
 * @pageSizes Specifies the array of page sizes for paginator
 * @totalData Specifies the total data information needed when using server side implementation
 */
export interface PaginatorConfiguration {
  pageSizes: number[]
  totalData?: number
}
