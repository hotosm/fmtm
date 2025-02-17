# reset
docker compose down --volumes

nvm use node

cd src/frontend
pnpm install

cd ../mapper
pnpm install

docker compose build ui --no-cache
docker compose build ui-mapper --no-cache

docker compose up --build
