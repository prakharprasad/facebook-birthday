from datetime import datetime
from pydantic import BaseModel
import pony.orm as ent

database_file = "../db/db.sqlite"
database = ent.Database()

# Database Models


class FacebookUser(database.Entity):
    uid = ent.PrimaryKey(int, size=64)
    name = ent.Optional(str)
    birthday = ent.Required(datetime)
    is_blacklisted = ent.Optional(bool, default=False)
    created_at = ent.Required(datetime, sql_default="CURRENT_TIMESTAMP")


class AccessToken(database.Entity):
    id = ent.PrimaryKey(int)
    token = ent.Required(str)


database.bind(provider="sqlite", filename=database_file, create_db=True)
database.generate_mapping(create_tables=True)

# Fast API Models


class BlacklistPayload(BaseModel):
    uid: int
    is_blacklisted: bool


class AccessTokenPayload(BaseModel):
    access_token: str


class RunnerExecutePayload(BaseModel):
    dry_run: bool
