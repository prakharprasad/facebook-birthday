# facebook-birthday

## Setup

```
cd backend && mkdir db
python -m venv .venv
source .venv/bin/activate
pip3 install -r requirments.txt
cd ../frontend
npm install concurrently --save
sudo chown -R www-data:www-data ../
```

### Run

```
npm run staging
```

### Service

```
 cp cake.service /etc/systemd/system/
 systemctl daemon-reload
 systemctl start cake
```
