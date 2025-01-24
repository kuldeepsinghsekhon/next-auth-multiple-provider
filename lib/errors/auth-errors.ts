export const AUTH_ERRORS = {
    UNAUTHORIZED: {
      code: 401,
      message: 'You do not have permission to access this resource',
      status: false
    },
    FORBIDDEN: {
      code: 403, 
      message: 'Access forbidden',
      status: false
    }
  } as const
  
  export class AuthError extends Error {
    code: number
    status: boolean
  
    constructor({ code, message, status }: typeof AUTH_ERRORS[keyof typeof AUTH_ERRORS]) {
      super(message)
      this.name = 'AuthError'
      this.code = code
      this.status = status
    }
  }