LearnQube LMS + MOOC.

## Project Documentation
```
cp .env env/local
source .env

sudo apt install virtualenvwrapper

mkvirtualenv -p $(which python3.6) ${PROJECT}
workon ${PROJECT}
pip install -r requirements.txt
# Install custom python packages
# cd src && python setup.py develop && cd - (Optional)
```

### Install frontend packages using yarn
```
yarn --modules-folder app/static/assets
# Add any other frontend packages
# yarn add font-awesome --modules-folder app/static/assets
git add -f yarn.lock
```

## Create database
```
python scripts/createdb.py | sudo -s -u postgres psql postgres
python manage.py migrate
python manage.py createsuperuser

python manage.py runscript create_demo_accounts -v3

python manage.py makemigrations (Optional)
python manage.py collectstatic (Optional)
```

## Deepstream Hub
```
source /etc/lsb-release && echo "deb http://dl.bintray.com/deepstreamio/deb ${DISTRIB_CODENAME} main" | sudo tee -a /etc/apt/sources.list
sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys 379CE192D401AB61
sudo apt-get update
sudo apt-get install -y deepstream.io
sudo deepstream service add && sudo systemctl enable deepstream.service
```

https://deepstreamhub.com/open-source/install/ubuntu/
https://deepstreamhub.com/open-source/core/deepstream-service/

## Kurento media server
```
sudo vim /etc/apt/sources.list.d/kurento.list
deb [arch=amd64] http://ubuntu.openvidu.io/dev xenial kms6

sudo apt-key adv --keyserver keyserver.ubuntu.com --recv-keys 5AFA7A83
sudo apt update && sudo apt install kurento-media-server
sudo update-rc.d kurento-media-server defaults
```

## Openvidu
```
sudo apt install default-jdk
sudo cp -r deploy/openvidu/* /root/.

/usr/bin/java -jar -Dopenvidu.secret=openvidu -Dserver.ssl.key-store=/root/openvidu.jks -Dserver.ssl.key-store-password=openvidu -Dserver.ssl.key-alias=openvidu /root/openvidu-server-1.9.0.jar

sudo cp deploy/openvidu/openvidu.service /etc/systemd/system/
sudo systemctl enable openvidu
```

## Troubleshooting
```
netstat -nltp
check if all three services are running
deepstream - 6020
kurento    - 8888
openvidu   - 8443
```
