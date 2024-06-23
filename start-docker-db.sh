#!/bin/bash
set -e

source .env

echo "echo stop & remove old docker and starting new fresh instance"

(docker kill postgres_server || :) && \
(docker rm postgres_server || :) && \
docker run --name postgres_server -e POSTGRES_PASSWORD=$POSTGRES_PASSWORD -e PGPASSWORD=$POSTGRES_PASSWORD -p 5432:5432 -d postgres

# wait for pg to start
echo "sleep wait for pg-server [postgres_server] to start";
sleep 3;

# create the db 
echo "CREATE DATABASE $POSTGRES_DATABASE ENCODING 'UTF-8';" | docker exec -i postgres_server psql -U postgres
echo "\l" | docker exec -i postgres_server psql -U postgres