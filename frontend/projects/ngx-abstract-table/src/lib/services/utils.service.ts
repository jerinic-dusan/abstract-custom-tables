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

  public checkForChanges(change: SimpleChange): boolean {
    return change !== undefined && change.currentValue !== undefined && change.currentValue !== change.previousValue;
  }

  public getColumns(classObj: TableData): string[] {
    return classObj.columnData.map(item => item.column);
  }

  public getColumn(classObj: TableData, column: string): ColumnData | undefined {
    return classObj.columnData.find(item => item.column === column);
  }

  public getAlignment(classObj: TableData, column: string): any {
    const columnData = this.getColumn(classObj, column);
    return columnData ? columnData.alignment : DataAlignment.NORMAL;
  }

  public getAttributeName(classObj: TableData, column: string): string {
    const attribute = this.getColumn(classObj, column)?.field;
    return attribute ? attribute : '';
  }

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

  private formatDate(date: Date, func?: (date: Date)=>string): string {
    return func ? func(date) : date.toLocaleDateString("en-GB");
  }

  private formatDefault(value: any): any {
    return value;
  }

  private formatInteger(value: number): any {
    return new Intl.NumberFormat().format(value);
  }

  private formatFloat(value: number, fractions: number = 2): string {
    return value.toLocaleString('en-US', {minimumFractionDigits: fractions, maximumFractionDigits: fractions})
  }

  private summarizeColumn(data: TableData[], column: string): number {
    return data.reduce((prev: number, curr: TableData) =>
      prev + this.getValue(curr, column), 0);
  }

  private getValue(item: TableData, column: string): any {
    const columnData = this.getColumn(item, column);
    const fieldName = columnData ? columnData.field : '';
    return (<any>item)[fieldName] ? (<any>item)[fieldName] : null;
  }

  private minDate(dates: Date[]): string {
    const date =  dates.reduce((a, b) => { return a < b ? a : b; })
      .toLocaleDateString("en-US", {day: '2-digit', month: 'short', year: '2-digit'});
    return date.slice(date.indexOf(','));
  }

  private maxDate(dates: Date[]): string {
    const date = dates.reduce((a, b) => { return a > b ? a : b; })
      .toLocaleDateString("en-US", {day: '2-digit', month: 'short', year: '2-digit'});
    return date.slice(date.indexOf(','));
  }
}
