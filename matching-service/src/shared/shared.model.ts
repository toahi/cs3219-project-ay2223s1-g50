export type Success = {
  success: true
}

export type Failure = {
  success: false
  message: string
}

export const GENERIC_SUCCESS: Success = {
  success: true,
}
