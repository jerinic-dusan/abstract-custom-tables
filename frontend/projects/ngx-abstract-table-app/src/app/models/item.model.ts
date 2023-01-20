import {Detail} from "./detail.model";
import {ColumnData, TableData} from "ngx-abstract-table";
import {DataType} from "../../../../ngx-abstract-table/src/lib/models/enums/data-type.enum";
import {DataAlignment} from "../../../../ngx-abstract-table/src/lib/models/enums/data-alignment.enum";
import {Injectable} from "@angular/core";
import {Mapper} from "./mapper.interface";
import {ItemResponse} from "./responses/item-response.interface";

export class Item implements TableData{

  id: string;
  private _name: string;
  private _type: string;
  private _price: string;
  private _createdAt: Date;
  private _details: Detail[];

  columnData: ColumnData[];

  constructor(id: string, name: string, type: string, price: string, createdAt: Date, details: Detail[] = []) {
    this.id = id;
    this._name = name;
    this._type = type;
    this._price = price;
    this._createdAt = createdAt;
    this._details = details;

    this.columnData = [
      {field: '_name', column: 'Name', type: DataType.STRING, formatting: DataType.STRING, alignment: DataAlignment.NORMAL},
      {field: '_type', column: 'Type', type: DataType.STRING, formatting: DataType.STRING, alignment: DataAlignment.NORMAL},
      {field: '_price', column: 'Price', type: DataType.STRING, formatting: DataType.STRING, alignment: DataAlignment.CENTER},
      {field: '_createdAt', column: 'Date', type: DataType.DATE, formatting: DataType.DATE, customDateFormatFunction: this.dateFormatter, alignment: DataAlignment.CENTER},
    ];
  }

  public dateFormatter(date: Date): string {
    return date.toLocaleString("en-GB");
  }

  public get name(): string {
    return this._name;
  }

  public set name(value: string) {
    this._name = value;
  }

  public get type(): string {
    return this._type;
  }

  public set type(value: string) {
    this._type = value;
  }

  public get price(): string {
    return this._price;
  }

  public set price(value: string) {
    this._price = value;
  }

  public get createdAt(): Date {
    return this._createdAt;
  }

  public set createdAt(value: Date) {
    this._createdAt = value;
  }

  public get details(): Detail[] {
    return this._details;
  }

  public set details(value: Detail[]) {
    this._details = value;
  }

}

@Injectable({providedIn: "root"})
export class ItemMapper implements Mapper<Item> {
  public map(item: ItemResponse): Item {
    return new Item(
      item._id,
      item.name,
      item.type,
      item.price,
      new Date(item.createdAt)
    );
  }
}
