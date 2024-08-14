#clean up old docker files
docker image prune -af
docker volume rm $(docker volume ls -qf dangling=true)
# login to ecr
docker login -u AWS -p $(aws ecr get-login-password --region us-east-1) 973920270561.dkr.ecr.us-east-1.amazonaws.com
#copy env files
cp ../.env.production .
cp ../.env.migrations .
#install dependencies
npm install
#run db migrations
npm run migration:run
#start application services
docker compose down
GIT_TAG=$(git rev-parse --short HEAD) docker compose up -d
# GIT_TAG=$(git rev-parse --short HEAD) docker compose up -d --scale auth=2 --scale api=2 --no-recreate
# sleep 10
# docker rm -f backend-v2_auth_1 && docker rm -f backend-v2_api_1
# GIT_TAG=$(git rev-parse --short HEAD) docker compose up -d --scale auth=1 --scale api=1 --no-recreate
