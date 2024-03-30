import { Handler as LambdaHandler, APIGatewayProxyEvent, Context } from 'aws-lambda'
import {
  getHandler,
  patchHandler,
  postHandler,
  invalidMethodHandler,
  deleteHandler,
  optionsHandler
} from './controllers'
import { Response } from './Response/Response'
import { Handler } from './Handler/Handler'
import { IHandler } from './Handler/IHandler'
import { IResponse } from './Response/IResponse'
import { allowOrigin } from './utils/allowOrigin'

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      S3_BUCKET_IMAGES_STORE: string
      IMAGE_METADATA_TABLE: string
      DB_METADATA_TABLE: string
      WEBSITE_ORIGIN: string
    }
  }
}

export const handler: LambdaHandler = async (event: APIGatewayProxyEvent) => {
  let sucess: boolean
  let statusCode: number
  let handler: IHandler
  let response: IResponse
  const allowedOrigin = allowOrigin(event.headers.origin || '')

  switch (event.httpMethod) {
    case 'GET':
      handler = new Handler(getHandler)
      statusCode = 200
      break
    case 'POST':
      handler = new Handler(postHandler)
      statusCode = 201
      break
    case 'PATCH':
      handler = new Handler(patchHandler)
      statusCode = 201
      break
    case 'DELETE':
      handler = new Handler(deleteHandler)
      statusCode = 201
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
    const data = await handler.handler(event)
    sucess = true
    response = new Response(statusCode, sucess, allowedOrigin, data)
  } catch (err) {
    sucess = false
    if (!statusCode) statusCode = 500
    response = new Response(statusCode, sucess, allowedOrigin)
  }

  return response.formatResponse()
}
