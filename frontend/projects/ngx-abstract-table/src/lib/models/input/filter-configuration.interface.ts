import {FilterAppearance} from "../enums/filter-appearance.enum";

/**
 * Interface specifying mat-form-field filter options
 * @filterLabel Specifies label above the mat-form-filed
 * @filterPlaceholder Specifies the placeholder for the mat-form-field
 * @filterAppearance Specifies the mat-form-field appearance
 */
export interface FilterConfiguration {
  filterLabel: string
  filterPlaceholder: string
  filterAppearance: FilterAppearance
}
