import facebook
import os
import random
from datetime import datetime
from core.model import *
from core.utils import *
from core.message import *

# Add more messages here


async def execute(date: datetime = datetime.today(), dry_run=True):
    client = await generate_facebook_client()
    date = datetime.strptime(f"{date.month}/{date.day}", "%m/%d")
    output = []
    with ent.db_session:
        users = FacebookUser.select(
            lambda user: user.is_blacklisted is False and user.birthday == date)
        for user in users:
            message = await generate_birthday_message()
            try:
                if not dry_run:
                    client.put_object(parent_object=user.uid,
                                      connection_name="feed", message=message)
                output.append(f"{user.name}")
            except:
                output.append(f"{user.name} [failed]")
        return output
