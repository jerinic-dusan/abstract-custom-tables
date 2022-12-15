export interface FooterConfiguration {
  stickyFooter: boolean
  customFooter?: (column: string) => string
}
