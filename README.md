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


### Apache Site Configuration
```
<VirtualHost *:80>
    #ReactJS /build directory
    DocumentRoot "/var/www/html/frontend/build"
    #Route API requests, change port if required
    ProxyPass /api/ http://127.0.0.1:5000/api/
    ProxyPassReverse /api/ http://127.0.0.1:5000/api/
    ServerName example.com

<Directory /var/www/html/frontend/build>
    AllowOverride all
    Require all granted
</Directory>
</VirtualHost>
