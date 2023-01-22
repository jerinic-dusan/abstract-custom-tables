import {ItemResponse} from "./item-response.interface";

/**
 * Interface specifies the paged items response object
 * @items - Specifies an array of returned items
 * @count - Specifies the total count of data that matches the sent request
 */
export interface PagedItemsResponse {
  items: ItemResponse[],
  count: number
}
