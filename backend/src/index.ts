import { APIGatewayProxyEvent } from 'aws-lambda'
import { Handler } from './Handler/Handler'
import { IHandler } from './Handler/IHandler'
import { allowOrigin } from './utils/allowOrigin'
import { IResponse } from './Response/IResponse'
import { Response } from './Response/Response'
import {
  deleteHandler,
  getHandler,
  getPresignedUrlHandler,
  invalidMethodHandler,
  optionsHandler,
  postHandler
} from './controllers'

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      S3_BUCKET_IMAGES_STORE: string
      IMAGE_METADATA_TABLE: string
      DB_METADATA_TABLE: string
      WEBSITE_ORIGIN: string
      ITEMS_ON_PAGE: number
    }
  }
}

export const handler = async (event: APIGatewayProxyEvent) => {
  let sucess: boolean
  let statusCode: number
  let handler: IHandler
  let response: IResponse

  const allowedOrigin = allowOrigin(event.headers.origin || '')

  process.env.ITEMS_ON_PAGE = 20

  switch (event.httpMethod) {
    case 'GET':
      if (event.path === '/presigned-url') {
        handler = new Handler(getPresignedUrlHandler)
      } else {
        handler = new Handler(getHandler)
      }
      statusCode = 200
      break
    case 'POST':
      handler = new Handler(postHandler)
      statusCode = 201
      break
    case 'DELETE':
      handler = new Handler(deleteHandler)
      statusCode = 200
      break
    case 'OPTIONS':
      handler = new Handler(optionsHandler)
      statusCode = 200
      break
    default:
      handler = new Handler(invalidMethodHandler)
      statusCode = 400
      break
  }

  try {
    const data = await handler.handle(event)
    sucess = true
    response = new Response(statusCode, sucess, allowedOrigin, data)
  } catch (err) {
    sucess = false
    if (!statusCode) statusCode = 500
    response = new Response(statusCode, sucess, allowedOrigin)
    console.error((err as Error).message)
  }

  return response.formatResponse()
}
