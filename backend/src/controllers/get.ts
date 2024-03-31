import { DynamoDBClient, GetItemCommand, QueryCommand } from '@aws-sdk/client-dynamodb'
import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { APIGatewayProxyEvent } from 'aws-lambda'
import { getPages } from '../utils/getPages'

export async function getHandler(event: APIGatewayProxyEvent): Promise<Record<string, unknown>> {
  const itemsOnPage = process.env.ITEMS_ON_PAGE
  const askedPage = event.queryStringParameters ? Number(event.queryStringParameters.page) || 1 : 1

  const dynamoClient = new DynamoDBClient({})
  const s3Client = new S3Client({})

  const getTotalPagesCommand = new GetItemCommand({
    TableName: process.env.DB_METADATA_TABLE,
    Key: {
      table_name: { S: process.env.IMAGE_METADATA_TABLE }
    }
  })

  const totalPagesCommandResponse = await dynamoClient.send(getTotalPagesCommand)
  const numberOfItems = totalPagesCommandResponse.Item
    ? Number(totalPagesCommandResponse.Item.items.N)
    : 0

  const totalPages = getPages(numberOfItems)

  if (totalPages && askedPage <= totalPages) {
    let itemsData = [] as {
      title: string
      description: string
      fileName: string
      created_at: string
      image_group: string
      uri: string
    }[]
    let page = 1

    while (itemsData.length < itemsOnPage * askedPage && page <= totalPages) {
      const newItems = await queryAndTreatImagesData(dynamoClient, s3Client, page)
      newItems.forEach((item) => {
        itemsData.push(item)
      })
      page++
    }

    const sliceStart = askedPage * itemsOnPage - itemsOnPage
    const sliceEnd = askedPage * itemsOnPage

    const dataSliced = itemsData.slice(sliceStart, sliceEnd)

    return {
      data: {
        images: dataSliced,
        totalPages
      }
    }
  }
  return { data: { images: null, totalPages } }
}

const queryAndTreatImagesData = async (
  dynamoClient: DynamoDBClient,
  s3Client: S3Client,
  page: number | string
) => {
  const queryCommand = new QueryCommand({
    TableName: process.env.IMAGE_METADATA_TABLE,
    KeyConditionExpression: '#G = :g',
    ExpressionAttributeNames: {
      '#G': 'image_group'
    },
    ExpressionAttributeValues: {
      ':g': { N: String(page) }
    }
  })
  const queryResponse = await dynamoClient.send(queryCommand)
  if (queryResponse.Items && queryResponse.Items.length > 0) {
    const treatedItems = queryResponse.Items.map((item) => {
      return {
        title: item.title.S || '',
        description: item.description.S || '',
        fileName: item.file_name.S || '',
        created_at: item.created_at.N || '',
        image_group: item.image_group.N || '',
        uri: ''
      }
    })

    for (let i = 0; i < treatedItems.length; i++) {
      const getCommand = new GetObjectCommand({
        Bucket: process.env.S3_BUCKET_IMAGES_STORE,
        Key: treatedItems[i].fileName
      })

      const preSignedUrl = await getSignedUrl(s3Client, getCommand, { expiresIn: 3600 })

      treatedItems[i].uri = preSignedUrl
    }
    return treatedItems
  }
  return []
}
