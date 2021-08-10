import facebook
import os
import asyncio
import pony.orm as ent
from datetime import datetime
from core.model import *

async def generate_facebook_client():
     today = datetime.today()
     with ent.db_session:
        access_token = AccessToken.get(id=1)
        if access_token:
            access_token = access_token.token
        return facebook.GraphAPI(access_token=access_token)

async def generate_database():
    error = False
    message = ""
    try:
        client = await generate_facebook_client()
        friends = client.get_object("/me/friends", limit=5000, fields="birthday,name")
        if "data" in friends:
            for friend in friends["data"]:
                name = friend["name"]
                uid = friend["id"]
                if "birthday" in friend:
                    birthday = datetime.strptime(friend["birthday"][:5], "%m/%d")
                    with ent.db_session:
                        if not FacebookUser.get(uid=uid):
                            FacebookUser(name=name, uid=uid, birthday=birthday)
                        ent.commit()    
    except Exception as e:
        error = True
        message = str(e)
    return error, message

