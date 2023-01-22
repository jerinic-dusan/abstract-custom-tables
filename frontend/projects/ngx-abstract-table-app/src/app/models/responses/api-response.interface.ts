/**
 * Interface specifies the common response object with a generic data
 * @code - Specifies the status code returned from the back-end
 * @message - Specifies the message returned from the back-end
 * @data - Specifies the data returned from the back-end
 */
export interface ApiResponse<T> {
  code: number
  message: string;
  data: T;
}
