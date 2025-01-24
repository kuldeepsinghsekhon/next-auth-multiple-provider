export const RESPONSE_FORMATS = {
    RETRIVED: {
        code: 200,
        message: 'data retrived successfully',
        status: false
      },
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
  