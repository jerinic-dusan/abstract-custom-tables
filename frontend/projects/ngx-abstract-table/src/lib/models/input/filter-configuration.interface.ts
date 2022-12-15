import {FilterAppearance} from "../enums/filter-appearance.enum";

export interface FilterConfiguration {
  filterLabel: string
  filterPlaceholder: string
  filterAppearance: FilterAppearance
}
