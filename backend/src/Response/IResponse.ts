export interface IResponse {
  status: number
  sucess: boolean
  allowedOrigin: string
  data?: Record<string, unknown>

  formatResponse(): Record<string, unknown>
}
