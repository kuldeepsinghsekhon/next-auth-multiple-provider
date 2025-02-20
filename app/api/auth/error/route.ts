// import { NextResponse } from 'next/server'

// export async function GET(request: Request) {
//   const { searchParams } = new URL(request.url)
//   const error = searchParams.get('error')

//   return NextResponse.json({ 
//     error: error || 'Authentication failed',
//     message: getErrorMessage(error)
//   })
// }

// function getErrorMessage(error: string | null): string {
//   switch (error) {
//     case 'AccessDenied':
//       return 'You do not have permission to sign in'
//     case 'Verification':
//       return 'The sign in link is no longer valid'
//     case 'Configuration':
//       return 'There is a problem with the server configuration'
//     case 'EmailSignin':
//       return 'The e-mail sign in link is invalid or has expired'
//     default:
//       return 'An error occurred during authentication'
//   }
// }