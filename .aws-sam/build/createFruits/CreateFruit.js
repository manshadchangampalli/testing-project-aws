const AWS = require("aws-sdk");

async function accessItemTable() {
  // Assume IAM role in project A
  const sts = new AWS.STS();
  const assumeRoleParams = {
    RoleArn: `arn:aws:iam::038416732207:role/CrossAccountRole`,
    RoleSessionName: "AssumeRoleSession",
  };

  const assumedRole = await sts.assumeRole(assumeRoleParams).promise();

  // Use the temporary credentials
  const dynamoDB = new AWS.DynamoDB({
    accessKeyId: assumedRole.Credentials.AccessKeyId,
    secretAccessKey: assumedRole.Credentials.SecretAccessKey,
    sessionToken: assumedRole.Credentials.SessionToken,
  });

  // Use DynamoDB to interact with the ITEMTABLE
  // Example: Get an item from the table
  const getItemParams = {
    TableName: "ItemTable",
    Key: {
      PK: { S: `Cashier#1okaNrKXECAc7RxgyxliVvAXGtl` },
      SK: { S: "Cashier#2Nlw6o2euJObUbj9H6Yj0kb1qqi" },
    },
  };

  const item = await dynamoDB.getItem(getItemParams).promise();

  // Process the retrieved item
  // ...

  return item;
}

// Invoke the function
accessItemTable()
  .then((result) => {
    console.log("Item retrieved:", result);
  })
  .catch((error) => {
    console.error("Error:", error);
  });
