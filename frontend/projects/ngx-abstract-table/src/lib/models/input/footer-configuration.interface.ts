/**
 * Interface specifying footer row options
 * @stickyFooter Specifies whether the footer row will be sticky
 * @customFooter Specifies the custom footer function to be used for each column
 */
export interface FooterConfiguration {
  stickyFooter: boolean
  customFooter?: (column: string) => string
}
