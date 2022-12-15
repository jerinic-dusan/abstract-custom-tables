import {TableData} from "../table-data.interface";
import {TemplateRef} from "@angular/core";
import {StyleConfiguration} from "./style-configuration.interface";

export interface DetailsConfiguration {
  data: TableData[] | any
  customChildComponent: TemplateRef<any>
  childStyle: StyleConfiguration
}
