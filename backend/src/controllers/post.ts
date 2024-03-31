import {
  DynamoDBClient,
  GetItemCommand,
  PutItemCommand,
  UpdateItemCommand
} from '@aws-sdk/client-dynamodb'
import { APIGatewayProxyEvent } from 'aws-lambda'
import { getPages } from '../utils/getPages'

export async function postHandler(event: APIGatewayProxyEvent): Promise<Record<string, unknown>> {
  const bodyData = JSON.parse(event.body || '{}')
  const { title, description, fileName } = bodyData
  let numberOfItemsAlreadyOnTable: number
  let newItemGroup: number

  const dynamoClient = new DynamoDBClient({})

  const getItemsTableCommand = new GetItemCommand({
    TableName: process.env.DB_METADATA_TABLE,
    Key: {
      table_name: { S: process.env.IMAGE_METADATA_TABLE }
    }
  })

  const getItemsResponse = await dynamoClient.send(getItemsTableCommand)

  if (!getItemsResponse.Item) {
    numberOfItemsAlreadyOnTable = 0
    newItemGroup = 1
    const putItemsTableCommand = new PutItemCommand({
      TableName: process.env.DB_METADATA_TABLE,
      Item: {
        table_name: { S: process.env.IMAGE_METADATA_TABLE },
        items: { N: String(numberOfItemsAlreadyOnTable) }
      }
    })

    await dynamoClient.send(putItemsTableCommand)
  } else {
    numberOfItemsAlreadyOnTable = Number(getItemsResponse.Item.items.N)
    const newItemNumberOnTable = numberOfItemsAlreadyOnTable + 1
    newItemGroup = getPages(newItemNumberOnTable)
  }

  const putImageMetadataCommand = new PutItemCommand({
    TableName: process.env.IMAGE_METADATA_TABLE,
    Item: {
      image_group: { N: String(newItemGroup) },
      created_at: { N: String(new Date().getTime()) },
      title: { S: title },
      description: { S: description },
      file_name: { S: fileName }
    }
  })

  const putMetadataResponse = await dynamoClient.send(putImageMetadataCommand)

  const increaseTableCountCommand = new UpdateItemCommand({
    TableName: process.env.DB_METADATA_TABLE,
    Key: {
      table_name: { S: process.env.IMAGE_METADATA_TABLE }
    },
    UpdateExpression: 'SET #I = :i',
    ExpressionAttributeNames: { '#I': 'items' },
    ExpressionAttributeValues: {
      ':i': { N: String(numberOfItemsAlreadyOnTable + 1) }
    }
  })

  await dynamoClient.send(increaseTableCountCommand)

  return { data: putMetadataResponse.Attributes }
}
