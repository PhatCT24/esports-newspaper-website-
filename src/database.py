from pymongo import mongo_client
import pymongo
from src.config import settings

client = mongo_client.MongoClient(settings.DATABASE_URL, serverSelectionTimeoutMS=5000)

try:
    conn = client.server_info()
    print(f'MongoDB connected successfully{conn.get("version")}')
except Exception:
    print(f'MongoDB connected failed!')

db = client[settings.MONGO_INITDB_DATABASE]
User = db.users
Post = db.posts
User.create_index([("email", pymongo.ASCENDING)], unique=True)
# auto delete unverified users
User.create_index([("code_expires_at", pymongo.ASCENDING)], expireAfterSeconds=0)