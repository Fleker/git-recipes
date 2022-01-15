set -e
set -x # Show commands
# Clear cache
rm -rf ./dist
yarn build:back
cp -r ./backend/views ./dist/views

rm -rf ./build
yarn build:front
bash scripts/postbuild.sh
cp -r ./public ./dist/public
cp backend/key.json dist/key.json

node dist/index.js
