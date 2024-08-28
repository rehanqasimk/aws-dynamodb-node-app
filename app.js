const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { 
  DynamoDBDocumentClient, 
  PutCommand, 
  GetCommand, 
  UpdateCommand, 
  DeleteCommand,
  ScanCommand
} = require("@aws-sdk/lib-dynamodb");


const _env = require("dotenv")
_env.config()
const ENV = process.env


// Initialize the DynamoDB client
const client = new DynamoDBClient({ 
  region: ENV.REGION,
  credentials: {
    accessKeyId: ENV.ACCESS_KEY_ID,
    secretAccessKey: ENV.SECRET_ACCESS_KEY
  }
});

const docClient = DynamoDBDocumentClient.from(client);

// Define table name
const TableName = "Users";

// CRUD Operations

// Create (Put) an item
async function createItem(id, name) {
  const params = {
    TableName,
    Item: { id, name }
  };

  try {
    await docClient.send(new PutCommand(params));
    console.log(`Item ${id} created successfully`);
  } catch (err) {
    console.error("Error creating item:", err);
  }
}

// Read (Get) an item
async function getItem(id) {
  const params = {
    TableName,
    Key: { id }
  };

  try {
    const { Item } = await docClient.send(new GetCommand(params));
    console.log("Retrieved item:", Item);
    return Item;
  } catch (err) {
    console.error("Error retrieving item:", err);
  }
}

// Update an item
async function updateItem(id, newName) {
  const params = {
    TableName,
    Key: { id },
    UpdateExpression: "set #name = :name",
    ExpressionAttributeNames: { '#name': 'name' },
    ExpressionAttributeValues: { ':name': newName }
  };

  try {
    await docClient.send(new UpdateCommand(params));
    console.log(`Item ${id} updated successfully`);
  } catch (err) {
    console.error("Error updating item:", err);
  }
}

// Delete an item
async function deleteItem(id) {
  const params = {
    TableName,
    Key: { id }
  };

  try {
    await docClient.send(new DeleteCommand(params));
    console.log(`Item ${id} deleted successfully`);
  } catch (err) {
    console.error("Error deleting item:", err);
  }
}

// Scan (list all items)
async function listItems() {
  const params = { TableName };

  try {
    const { Items } = await docClient.send(new ScanCommand(params));
    console.log("All items:", Items);
    return Items;
  } catch (err) {
    console.error("Error listing items:", err);
  }
}

// Usage example
async function runExample() {
  await createItem("1", "John Doe");
  await getItem("1");
  await updateItem("1", "Jane Doe");
  await getItem("1");
  await listItems();
  await deleteItem("1");
}

runExample();