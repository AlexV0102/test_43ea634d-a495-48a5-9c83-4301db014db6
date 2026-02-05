export interface PaginationOptions {
  take: number;
  skip: number;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
}
