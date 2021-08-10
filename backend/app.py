import pony.orm as ent
import uvicorn
import os
import core.runner as runner
from core.model import *
from core.utils import *
from datetime import datetime
from fastapi import FastAPI,HTTPException

app = FastAPI()

@app.get("/ping")
async def ping():
    return {"data":"pong"}

@app.get("/api/get_facebook_users")
async def get_facebook_users():
    with ent.db_session:
        users = []
        results = FacebookUser.select(lambda p:p).order_by(FacebookUser.name)[:]
        if len(results) > 0:
            for user in results:
                users.append({
                    "uid": user.uid,
                    "name": user.name, 
                    "is_blacklisted": user.is_blacklisted   ,
                    "birthday": datetime.strftime(user.birthday, "%d %B"),
            })
    return users

@app.get("/api/get_access_token")
async def get_access_token():
        with ent.db_session: 
            result = AccessToken.get(id=1)
            if not result:
                raise HTTPException(status_code=404, detail="No token was found")
            else:
                return result.token
@app.put("/api/runner/execute")
async def runner_execute(payload: RunnerExecutePayload):
    date = datetime.today()
    try: 
        output = await runner.execute(date=date, dry_run=payload.dry_run)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    if output:
        return output
    else:
        raise HTTPException(status_code=404, detail="No users were wished, check if anyone has their birthday today.")
    
    
@app.put("/api/generate_database")
async def generate_db():
    error, message = await generate_database()
    if error:
        raise HTTPException(status_code=500,detail=f"Failed to generate database: {message}")
    return {"data":"Database generated"}

@app.put("/api/set_access_token")
async def set_access_token(payload: AccessTokenPayload):
    try: 
        client = facebook.GraphAPI(access_token=payload.access_token)
        data = client.get_object("/me", fields=["name"])
        if data:
            with ent.db_session:
                existing_token = AccessToken.get(id=1)
                if existing_token:
                    existing_token.token = payload.access_token
                else:
                    AccessToken(id=1, token=payload.access_token)
                ent.commit()
            return {"name": data["name"]}
    except facebook.GraphAPIError as e:
        raise HTTPException(status_code=500,detail=str(e))
    raise HTTPException(status_code=500,detail="Failed to Set Access Token")    

@app.put("/api/reset_database")
async def reset_database():
    try: 
        with ent.db_session: 
            result = FacebookUser.select(lambda p:p).delete()    
            ent.commit()
            return result
    except Exception as e:
        return f"Failed to reset database: {str(e)}" 
@app.put("/api/update_blacklist")
async def update_blacklist(payload: BlacklistPayload):
    with ent.db_session: 
      user = FacebookUser.get(uid=payload.uid)
      if user:
            user.is_blacklisted = payload.is_blacklisted
            ent.commit()
            return True
      raise HTTPException(status_code=500)
        
if __name__ == "__main__":
    if os.environ.get("APP_ENV") == "production":
        uvicorn.run("app:app", host="0.0.0.0", port=5000)
    elif os.environ.get("APP_ENV") == "development":
        uvicorn.run("app:app", host="0.0.0.0", port=5000, reload=True, debug=True)