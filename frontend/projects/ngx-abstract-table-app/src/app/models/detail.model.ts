import {ColumnData, TableData, DataType, DataAlignment} from "ngx-abstract-table";
import {Injectable} from "@angular/core";
import {Mapper} from "./mapper.interface";
import {DetailResponse} from "./responses/detail-response.interface";

/**
 * Detail class which represents child data for each item.
 * In order to be displayed as a table it needs to implement TableData interface and specify column meta-data
 */
export class Detail implements TableData{

  id: string;
  private _name: string;
  private _value: string;

  columnData: ColumnData[];

  constructor(id: string, name: string, value: string) {
    this.id = id;
    this._name = name;
    this._value = value;

    this.columnData = [
      {field: '_name', column: 'Name', type: DataType.STRING, formatting: DataType.STRING, alignment: DataAlignment.NORMAL},
      {field: '_value', column: 'Value', type: DataType.STRING, formatting: DataType.STRING, alignment: DataAlignment.NORMAL},
    ];
  }

  public get name(): string {
    return this._name;
  }

  public set name(value: string) {
    this._name = value;
  }

  public get value(): string {
    return this._value;
  }

  public set value(value: string) {
    this._value = value;
  }
}

/**
 * Injectable detail mapper which converts a detail response to a mapped detail
 */
@Injectable({providedIn: "root"})
export class DetailMapper implements Mapper<Detail> {
  public map(item: DetailResponse): Detail {
    return new Detail(
      item._id,
      item.name,
      item.value
    );
  }
}
