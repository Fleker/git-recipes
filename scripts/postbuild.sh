# Copy compiled components
cp build/default/src/carousel-image.js public/src/carousel-image.js
cp build/default/src/recipe.js public/src/recipe.js
cp build/default/src/video-youtube.js public/src/video-youtube.js
# Host dependencies
cp -r build/default/node_modules public/
echo "OK"
