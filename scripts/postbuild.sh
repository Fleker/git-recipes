# Copy compiled components
cp build/default/frontend/*.js public/src/
# Host dependencies
cp -r build/default/node_modules public/
cp app.yaml dist/app.yaml
cp package.json dist/package.json
echo "OK"
