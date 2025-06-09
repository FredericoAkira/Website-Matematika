declare module "react-svg-donut-chart";

type Nullable<T> = { [K in keyof T]: T[K] | null };

type DeepNullable<T> = {
  [K in keyof T]: DeepNullable<T[K]> | null;
};

type PartialAndNullable<T> = Partial<Nullable<T>>;

interface BaseResponse<T> {
  /**
   * The HTTP status code of the operation.
   */
  code: number;
  /**
   * The successful operation message.
   */
  message: string;
  /**
   * The HTTP status text of the operation.
   */
  status: string;
  /**
   * The returned data of the operation.
   */
  data: T;
}

interface BasePagination {
  meta: {
    /**
     * The current page of the pagination.
     */
    currentPage: number;
    /**
     * The number or records shown per page on the pagination.
     */
    perPage: number;
    /**
     * The total number of records of the pagionation.
     */
    totalItem: number;
    /**
     * The total pages available of the pagionation.
     */
    totalPage: number;
  };
}

interface BasePaginatedResponse<T> {
  content: T;
  pageable: {
    sort: {
      unsorted: boolean;
      sorted: boolean;
      empty: boolean;
    };
    pageSize: number;
    pageNumber: number;
    offset: number;
    paged: boolean;
    unpaged: boolean;
  };
  totalPages: number;
  totalElements: number;
  last: boolean;
  first: boolean;
  sort: {
    unsorted: boolean;
    sorted: boolean;
    empty: boolean;
  };
  numberOfElements: number;
  size: number;
  number: number;
  empty: boolean;
}
