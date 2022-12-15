import {DataType} from "./enums/data-type.enum";
import {DataAlignment} from "./enums/data-alignment.enum";

export interface ColumnData {
  field: string
  column: string
  type: DataType
  formatting: DataType
  customDateFormatFunction?: (date: Date) => string
  alignment: DataAlignment
}
