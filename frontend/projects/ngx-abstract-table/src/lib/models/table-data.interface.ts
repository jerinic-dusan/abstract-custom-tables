import {ColumnData} from "./column-data.interface";

export interface TableData {
  id: number | string | object
  columnData: ColumnData[]
}
