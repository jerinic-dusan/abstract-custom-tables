/**
 * Mapper interface that maps any object or array to a passed generic.
 * Interface is implemented in injectable mappers for easier mapping inside http response streams
 */
export interface Mapper<T> {
  map(item: any): T;
}
