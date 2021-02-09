set -e
set -x # Show commands
cp -r ./backend/views ./dist/views
# Copy compiled components
cp build/default/frontend/*.js public/src/
ls -R build
# Host dependencies
cp -r build/default/node_modules public/node_modules
ls -R dist/
cp -r ./public ./dist/public

cp app.yaml dist/app.yaml
cp package.json dist/package.json
cp .gcloudignore dist/.gcloudignore

ls -R dist/

# cp backend/key.json dist/key.json
echo "OK"
