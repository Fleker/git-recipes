# Copy over from serve.sh
cp -r ./backend/views ./dist/views
cp -r ./public ./dist/public
# Copy compiled components
cp build/default/frontend/*.js public/src/
# Host dependencies
cp -r build/default/node_modules public/
cp app.yaml dist/app.yaml
cp package.json dist/package.json
# cp backend/key.json dist/key.json
echo "OK"
