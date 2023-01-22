/**
 * Interface specifies the item response object
 * @_id - Specifies the item id
 * @_name - Specifies the item name
 * @_type - Specifies the item type
 * @price - Specifies the item price
 * @createdAt - Specifies the item creation date
 */
export interface ItemResponse {
  _id: string;
  name: string;
  type: string;
  price: string;
  createdAt: Date;
}
