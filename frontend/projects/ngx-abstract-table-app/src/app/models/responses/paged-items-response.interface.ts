import {ItemResponse} from "./item-response.interface";

export interface PagedItemsResponse {
  items: ItemResponse[],
  count: number
}
