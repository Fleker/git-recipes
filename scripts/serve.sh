set -e
set -x # Show commands
# Clear cache
rm -rf ./dist
yarn build:back
cp -r ./backend/views ./dist/views
cp -r ./public ./dist/public

rm -rf ./build
yarn build:front

bash scripts/postbuild.sh
node dist/index.js

