import {ColumnData} from "./column-data.interface";

/**
 * Interface needed to be implemented on data passed inside abstract custom table component
 * @id - Specifies unique identification for each element
 * @columnData - Specifies the array of column meta-data information
 */
export interface TableData {
  id: number | string | object
  columnData: ColumnData[]
}
