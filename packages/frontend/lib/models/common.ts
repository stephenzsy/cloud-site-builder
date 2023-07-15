export type ID = string;

export type Entity<T> = {
  id?: ID;
  attributes?: Partial<T>;
};

export type EntityResponse<T> = {
  data?: Entity<T>;
};

export type RelationResponseCollection<T> = { data?: Entity<T>[] };
