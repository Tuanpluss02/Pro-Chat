from pymongo import MongoClient
import logging
from config import MONGODB_URL, MAX_CONNECTIONS_COUNT, MIN_CONNECTIONS_COUNT

client = MongoClient(str(MONGODB_URL), maxPoolSize=MAX_CONNECTIONS_COUNT, minPoolSize=MIN_CONNECTIONS_COUNT,)

async def get_nosql_db() -> MongoClient:
    return client

async def close_mongo_connection():
    client.close()
    logging.info("closed mongo connection")
