import "dotenv/config";
import { Collection, MongoClient, ObjectId } from "mongodb";
import { User } from "./UsersModel";

const dbName = process.env.DB_NAME;
const dbUri = process.env.DB_URL;

let usersCollection: Collection<User>;

const client = new MongoClient(dbUri);

export async function connect() {
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
    const dataBase = client.db(dbName);
    usersCollection = dataBase.collection<User>("users");
  } catch (error) {
    console.error(error);
  }
}

export async function close() {
  await client.close();
}

export async function addUser(user: User) {
  const result = await usersCollection.insertOne(user);
  return result.insertedId.toString();
}

export async function getUser(userId: string) {
  const result = await usersCollection.findOne({
    _id: new ObjectId(userId),
  });
  return result;
}

export async function getAllUsers() {
  const result = usersCollection.find().toArray();
  return result;
}
