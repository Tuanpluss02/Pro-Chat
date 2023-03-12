import logging
import json
import pymongo
from fastapi import FastAPI, WebSocket

# from websockets.exceptions import ConnectionClosedError
# from starlette.websockets import WebSocketDisconnect
from controllers.rooms import get_room, remove_user_from_room, add_user_to_room, upload_message_to_room
from mongodb import close_mongo_connection, connect_to_mongo, get_nosql_db
from starlette.middleware.cors import CORSMiddleware
from config import MONGODB_DB_NAME
from api import router as api_router
from notifier import ConnectionManager
from starlette.websockets import WebSocketState


app = FastAPI()
logger = logging.getLogger(__name__)

# origins = [
#     "http://localhost.tiangolo.com",
#     "https://localhost.tiangolo.com",
#     "http://localhost",
#     "http://localhost:3000",
#     "http://localhost:3000",
# ]
origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # can alter with time
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def startup_event():
    """
     Create mongo collections and indexes on startup. This is run as a coroutine so we don't have to worry about threading
    """
    await connect_to_mongo()
    client = await get_nosql_db()
    db = client[MONGODB_DB_NAME]
    # try:
    #     db.create_collection("users")
    # except pymongo.errors.CollectionInvalid as e:
    #     logging.warning(e)
    #     pass
    # try:
    #     db.create_collection("rooms")
    # except pymongo.errors.CollectionInvalid as e:
    #     logging.warning(e)
    #     pass
    # try:
    #     db.create_collection("messages")
    # except pymongo.errors.CollectionInvalid as e:
    #     logging.warning(e)
    #     pass
    try:
        user_collection = db.users
        room_collection = db.rooms
        user_collection.create_index("username", name="username", unique=True)
        room_collection.create_index(
            "room_name", name="room_name", unique=True)
    except pymongo.errors.CollectionInvalid as e:
        logging.warning(e)
        pass


@app.on_event("shutdown")
async def shutdown_event():
    await close_mongo_connection()


manager = ConnectionManager()


@app.websocket("/ws/{room_name}/{user_name}")
async def websocket_endpoint(websocket: WebSocket, room_name, user_name):
    try:
        # add user
        await manager.connect(websocket, room_name)
        await add_user_to_room(user_name, room_name)
        room = await get_room(room_name)
        data = {
            "content": f"{user_name} has entered the chat",
            "user": {"username": user_name},
            "room_name": room_name,
            "type": "entrance",
            "new_room_obj": room,
        }
        await manager.broadcast(f"{json.dumps(data, default=str)}")
        # wait for messages
        while True:
            if websocket.application_state == WebSocketState.CONNECTED:
                data = await websocket.receive_text()
                message_data = json.loads(data)
                if "type" in message_data and message_data["type"] == "dismissal":
                    logger.warning(message_data["content"])
                    logger.info("Disconnecting from Websocket")
                    await manager.disconnect(websocket, room_name)
                    break
                else:
                    await upload_message_to_room(data)
                    logger.info(f"DATA RECIEVED: {data}")
                    await manager.broadcast(f"{data}")
            else:
                logger.warning(
                    f"Websocket state: {websocket.application_state}, reconnecting...")
                await manager.connect(websocket, room_name)
    except Exception as ex:
        template = "An exception of type {0} occurred. Arguments:\n{1!r}"
        message = template.format(type(ex).__name__, ex.args)
        logger.error(message)
        # remove user
        logger.warning("Disconnecting Websocket")
        await remove_user_from_room(None, room_name, username=user_name)
        room = await get_room(room_name)
        data = {
            "content": f"{user_name} has left the chat",
            "user": {"username": user_name},
            "room_name": room_name,
            "type": "dismissal",
            "new_room_obj": room,
        }
        await manager.broadcast(f"{json.dumps(data, default=str)}")
        await manager.disconnect(websocket, room_name)


app.include_router(api_router, prefix="/api")
