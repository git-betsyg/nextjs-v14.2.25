/**
 * Generic Paged Data Structure
 */
export interface PaginatedData<T> {
  list: T[]
  current: number
  pageSize: number
  total: number
}

/**
 * Generic API Response Structure
 */
export interface ApiResponse<T> {
  success: boolean
  data?: T
}

/**
 * Paginated API Response (Common Combination)
 */
export type PaginatedApiResponse<T> = ApiResponse<PaginatedData<T>>
