import {Injectable} from "@angular/core";
import {Mapper} from "./mapper.interface";
import {Item} from "./item.model";
import {PagedItemsResponse} from "./responses/paged-items-response.interface";

export class PagedItems {
  private readonly _items: Item[];
  private readonly _count: number;

  constructor(items: Item[], count: number) {
    this._items = items;
    this._count = count;
  }

  public get items(): Item[] {
    return this._items;
  }

  public get count(): number {
    return this._count;
  }
}

@Injectable({providedIn: "root"})
export class PagedItemsMapper implements Mapper<PagedItems> {
  public map(response: PagedItemsResponse): PagedItems {
    return new PagedItems(
      response.items.map(item =>
        new Item(
          item._id,
          item.name,
          item.type,
          item.price,
          new Date(item.createdAt))
        ),
      response.count
    )
  }
}
