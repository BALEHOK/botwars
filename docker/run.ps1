#git image
docker build -t git:latest --rm=true .\git

#web-server
docker build -t botwarswebsrv:latest --no-cache --rm=true .\web-server
docker run --name botwars-websrv -p 3001:3001 --env DATABASE_URL="postgres://postgres:pwd@172.17.0.2:5432/postgres" -d botwarswebsrv

#fe image
docker build -t botwarsfe:latest --no-cache --rm=true .\fe
docker run --name botwars-fe -p 3000:3000 --env SERVER_URL="http://172.17.0.3:3001" -d botwarsfe

#postres
docker run --name bot-wars-postgres -p 5432:5432 -e POSTGRES_PASSWORD=pwd -d postgres



