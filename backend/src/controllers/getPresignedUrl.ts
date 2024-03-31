import { APIGatewayProxyEvent } from 'aws-lambda'
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

export async function getPresignedUrlHandler(
  event: APIGatewayProxyEvent
): Promise<Record<string, unknown> | undefined> {
  if (!event.queryStringParameters) {
    return undefined
  }
  const { fileName, contentType } = event.queryStringParameters

  const s3Client = new S3Client({})

  const putCommand = new PutObjectCommand({
    Bucket: process.env.S3_BUCKET_IMAGES_STORE,
    Key: fileName,
    ContentType: contentType
  })

  const preSignedUrl = await getSignedUrl(s3Client, putCommand, { expiresIn: 3600 })

  return { preSignedUrl }
}
