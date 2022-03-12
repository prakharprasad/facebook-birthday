# 🍰 Cake for Facebook Birthday 

![Made with love in India](https://madewithlove.now.sh/in?heart=true&colorA=%23ff7e05&colorB=%2318af59)
![Deployment](https://github.com/prakharprasad/facebook-birthday/actions/workflows/deploy-app.yml/badge.svg)

Automagically wish your Facebook friends on their birthday.

Requirements:
1. Python 3.x
2. Apache httpd Server
3. Node.js NPM

## Installation

### A. Web UI

1. Run the commands below to setup the environment:
    ```
    git clone https://github.com/prakharprasad/facebook-birthday.git && cd facebook-birthday
    cd backend && pip3 install -r requirments.txt
    cd ../frontend
    npm install
    npm run build 
    sudo chown -R $WEB_SERVER_USER ../
    ```
2. Use the Apache configuration in `/scripts` and modify the `DocumentRoot` and `Directory` as per your Web UI setup directory. Once completed save the file to `/etc/apache2/sites-available/apache-cake.conf`
3. Run the commands below to activate the site:
    ```
    sudo apache2ctl configtest
    sudo a2ensite apache-cake.conf
    sudo service apache2 reload
    ```
**Web UI systemd service**
1. Modify the `WorkingDirectory` in `cake.service`
2. Execute the following commands:
    ```
    sudo cp cake.service /etc/systemd/system/
    sudo systemctl daemon-reload
    ```


### B. Cron Job 

This will execute everyday at 12:00am system time.
```
0 0 * * * python3 /path/to/app/backend/cron.py --dry-run=false
```

## Run

**Staging** 

1. Launch `npm run staging` from `/frontend` directory

**Production**

1. Launch `npm run production` from `/frontend` directory

OR

`sudo systemctl start cake`

