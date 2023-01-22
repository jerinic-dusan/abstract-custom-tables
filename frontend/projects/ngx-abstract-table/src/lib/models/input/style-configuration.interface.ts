/**
 * Interface specifying styling options for the table
 * @styles Specifies the css styles object
 * @childStyles Specifies the child css styles object
 * @alternatingRowColors Specifies whether the table will have alternating row colors
 * @selectedRowColor Specifies the color of selected row. E.g. #FFFFFF
 */export interface StyleConfiguration {
  styles?: any
  childStyles?: any
  alternatingRowColors?: boolean
  selectedRowColor?: string
}
