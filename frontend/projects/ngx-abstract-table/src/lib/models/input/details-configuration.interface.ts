import {TableData} from "../table-data.interface";
import {TemplateRef} from "@angular/core";
import {StyleConfiguration} from "./style-configuration.interface";

export interface DetailsConfiguration {
  customChildComponent: TemplateRef<any>
  childStyle: StyleConfiguration
}
