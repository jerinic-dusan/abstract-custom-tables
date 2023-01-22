import {DataType} from "./enums/data-type.enum";
import {DataAlignment} from "./enums/data-alignment.enum";

/**
 * Interface specifying column meta-data for the table
 * @field Specifies the field name in the class that's displayed in the table
 * @column Specifies the column value
 * @type Specifies the column data type
 * @formatting Specifies the column formatting
 * @customDataFormatFunction If supplied, specifies the custom function for date formatting
 * @alignment Specifies cell alignment
 */
export interface ColumnData {
  field: string
  column: string
  type: DataType
  formatting: DataType
  customDateFormatFunction?: (date: Date) => string
  alignment: DataAlignment
}
