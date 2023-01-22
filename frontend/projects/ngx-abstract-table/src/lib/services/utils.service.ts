import {Injectable, SimpleChange} from '@angular/core';
import {TableData} from "../models/table-data.interface";
import {DataAlignment} from "../models/enums/data-alignment.enum";
import {ColumnData} from "../models/column-data.interface";
import {DataType} from "../models/enums/data-type.enum";

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor() { }

  /**
   * Method checks whether there's been new data changes
   * @param change - Specifies simple change on the attribute passed in @Input
   */
  public checkForChanges(change: SimpleChange): boolean {
    return change !== undefined && change.currentValue !== null && change.currentValue !== undefined && change.currentValue !== change.previousValue;
  }

  /**
   * Method gets all column values needed for the header row
   * @param classObj - Specifies a single element from data array
   */
  public getColumns(classObj: TableData): string[] {
    return classObj.columnData.map(item => item.column);
  }

  /**
   * Method gets column meta-data
   * @param classObj - Specifies a single element from data array
   * @param column - Specifies the column in question
   */
  public getColumn(classObj: TableData, column: string): ColumnData | undefined {
    return classObj.columnData.find(item => item.column === column);
  }

  /**
   * Method gets element alignment for each column
   * @param classObj - Specifies a single element from data array
   * @param column - Specifies the column in question
   */
  public getAlignment(classObj: TableData, column: string): any {
    const columnData = this.getColumn(classObj, column);
    return columnData ? columnData.alignment : DataAlignment.NORMAL;
  }

  /**
   * Method gets element attribute name
   * @param classObj - Specifies a single element from data array
   * @param column - Specifies the column in question
   */
  public getAttributeName(classObj: TableData, column: string): string {
    const attribute = this.getColumn(classObj, column)?.field;
    return attribute ? attribute : '';
  }

  /**
   * Method gets default footer cell value for each column.
   * First cell return "Total:", date columns return "from - to" values, number columns return a sum.
   * @param data - Specifies the data array
   * @param column - Specifies the column in question
   */
  public getFooterCellValue(data: TableData[], column: string): string {
    const columnData = this.getColumn(data[0], column);
    if (!columnData){
      return '';
    }
    const columnIndex = data[0].columnData.indexOf(columnData);
    if (columnIndex === 0) {
      return 'Total';
    }
    if (columnData.type === DataType.DATE){
      const minDate = this.minDate(data.map(item => this.getValue(item, column)));
      const maxDate = this.maxDate(data.map(item => this.getValue(item, column)));
      return minDate + ' - ' + maxDate;
    }else if (columnData.type === DataType.INTEGER || columnData.type === DataType.FLOAT){
      const sum = this.summarizeColumn(data, column);
      return sum % 1 === 0 ?
        this.formatFloat(sum, 0) :
        this.formatFloat(sum, 2)
    }
    return '';
  }

  /**
   * Method gets cell formatting for each column
   * @param item - Specifies single element from the data array
   * @param column - Specifies the column in question
   */
  public getCellFormatting(item: TableData, column: string): string {
    const columnData = this.getColumn(item, column);
    // @ts-ignore
    if (columnData && item[columnData.field]){
      // @ts-ignore
      const value = item[columnData.field];
      const format = columnData?.formatting;
      if (format === DataType.FLOAT){
        return this.formatFloat(value);
      }else if (format === DataType.INTEGER){
        return this.formatInteger(value);
      }else if(format === DataType.DATE){
        return this.formatDate(value, columnData.customDateFormatFunction);
      } else{
        return this.formatDefault(value);
      }
    }else{
      return '';
    }
  }

  /**
   * Method returns the date format. Custom date format function is applied if its supplied.
   * @param date - Specifies the date in question
   * @param func - Specifies the custom date format function
   */
  private formatDate(date: Date, func?: (date: Date)=>string): string {
    return func ? func(date) : date.toLocaleDateString("en-GB");
  }

  /**
   * Method returns non-formatted value
   * @param value - Specifies the value in question
   */
  private formatDefault(value: any): any {
    return value;
  }

  /**
   * Method returns Integer formatted value with the thousand separators
   * @param value - Specifies the value in question
   */
  private formatInteger(value: number): any {
    return new Intl.NumberFormat().format(value);
  }

  /**
   * Method returns Float formatted value with the adjustable fractions
   * @param value - Specifies the value in question
   * @param fractions - Specifies the fractions
   */
  private formatFloat(value: number, fractions: number = 2): string {
    return value.toLocaleString('en-US', {minimumFractionDigits: fractions, maximumFractionDigits: fractions})
  }

  /**
   * Method summarises the column data
   * @param data - Specifies the data array
   * @param column - Specifies the column in question
   */
  private summarizeColumn(data: TableData[], column: string): number {
    return data.reduce((prev: number, curr: TableData) =>
      prev + this.getValue(curr, column), 0);
  }

  /**
   * Method gets field value for each cell
   * @param item - Specifies the element in question
   * @param column - Specifies the column ins question
   */
  private getValue(item: TableData, column: string): any {
    const columnData = this.getColumn(item, column);
    const fieldName = columnData ? columnData.field : '';
    return (<any>item)[fieldName] ? (<any>item)[fieldName] : null;
  }

  /**
   * Method calculates the min date out of array of dates
   * @param dates - Specifies the date array
   */
  private minDate(dates: Date[]): string {
    const date =  dates.reduce((a, b) => { return a < b ? a : b; })
      .toLocaleDateString("en-US", {day: '2-digit', month: 'short', year: '2-digit'});
    return date.slice(date.indexOf(','));
  }

  /**
   * Method calculates the max date out of array of dates
   * @param dates - Specifies the date array
   */
  private maxDate(dates: Date[]): string {
    const date = dates.reduce((a, b) => { return a > b ? a : b; })
      .toLocaleDateString("en-US", {day: '2-digit', month: 'short', year: '2-digit'});
    return date.slice(date.indexOf(','));
  }
}
