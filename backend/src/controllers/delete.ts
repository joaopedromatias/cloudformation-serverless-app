import {
  DeleteItemCommand,
  DynamoDBClient,
  GetItemCommand,
  UpdateItemCommand
} from '@aws-sdk/client-dynamodb'
import { APIGatewayProxyEvent } from 'aws-lambda'

export async function deleteHandler(
  event: APIGatewayProxyEvent
): Promise<Record<string, unknown> | undefined> {
  const bodyData = JSON.parse(event.body || '{}')
  const { created_at, image_group } = bodyData

  const dynamoClient = new DynamoDBClient({})

  const deleteItemCommand = new DeleteItemCommand({
    TableName: process.env.IMAGE_METADATA_TABLE,
    Key: {
      image_group: { N: String(image_group) },
      created_at: { N: String(created_at) }
    }
  })

  const deleteItemResponse = await dynamoClient.send(deleteItemCommand)

  const getItemsCountCommand = new GetItemCommand({
    TableName: process.env.DB_METADATA_TABLE,
    Key: {
      table_name: { S: process.env.IMAGE_METADATA_TABLE }
    }
  })

  const responseItemsCount = await dynamoClient.send(getItemsCountCommand)

  if (responseItemsCount && responseItemsCount.Item) {
    const itemsCount = Number(responseItemsCount.Item.items.N)
    const newItemsCount = itemsCount - 1
    await decreaseItemsCount(dynamoClient, newItemsCount)
    return { data: deleteItemResponse.Attributes }
  } else {
    return undefined
  }
}

export const decreaseItemsCount = async (dynamoClient: DynamoDBClient, newCount: number) => {
  const decreaseItemsTableCommand = new UpdateItemCommand({
    TableName: process.env.DB_METADATA_TABLE,
    Key: {
      table_name: { S: process.env.IMAGE_METADATA_TABLE }
    },
    UpdateExpression: 'SET #I = :i',
    ExpressionAttributeNames: { '#I': 'items' },
    ExpressionAttributeValues: {
      ':i': { N: String(newCount) }
    }
  })
  await dynamoClient.send(decreaseItemsTableCommand)
}
