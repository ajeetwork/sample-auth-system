if [ "$1" = "down" ]
  then
    docker-compose -f development.docker-compose.yml down
  else
    docker-compose -f development.docker-compose.yml up --build --renew-anon-volumes $1
fi
