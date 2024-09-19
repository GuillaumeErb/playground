export interface ODataContext {
  '@odata.context'?: string;
}

export interface ODataValueArray<T> extends ODataContext {
  value: T[];
  '@odata.nextLink'?: string;
  '@odata.count'?: number;
}
