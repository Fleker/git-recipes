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

node dist/index.js
