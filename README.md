# Cake for Facebook Birthday 
Automagically wish your Facebook friends on their birthday.

## Installation

### Web UI

1. Run the commands below to setup the environment:
    ```
    git clone https://github.com/prakharprasad/facebook-birthday.git
    cd backend && mkdir db
    python -m venv .venv && source .venv/bin/activate
    pip3 install -r requirments.txt
    cd ../frontend
    npm run build 
    sudo chown -R www-data:www-data ../
    ```
1. Use the Apache configuration below and modify the `DocumentRoot` and `Directory` as per your Web UI setup directory. Once completed save the file to `/etc/apache2/sites-available/cake.conf`
2. Run the commands below to activate the site:
    ```
    sudo apache2ctl configtest
    sudo a2ensite cake.conf
    sudo service apache2 reload
    ```
**Web UI systemd service**
1. Modify the `WorkingDirectory` in `cake.service`
2. Execute the following commands:
    ```
    sudo  cp cake.service /etc/systemd/system/
    sudo systemctl daemon-reload
    ```


### Cron Job 

This will execute everyday at 12:00am system time.
```
0 0 * * * /path/to/backend.venv/bin/python3 /path/to/backend/cron.py --dry-run=false
```

### Run

**Staging** 

1. Install `npm install concurrently --save`
2. Launch `npm run staging` from `/frontend` directory

**Production**

`sudo systemctl start cake`



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
