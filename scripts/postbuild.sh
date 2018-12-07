# Copy compiled components
cp build/default/src/carousel-image.js public/src/carousel-image.js
cp build/default/src/cookbook.js public/src/cookbook.js
cp build/default/src/recipe.js public/src/recipe.js
cp build/default/src/styled-card.js public/src/styled-card.js
cp build/default/src/titlebar.js public/src/titlebar.js
cp build/default/src/video-youtube.js public/src/video-youtube.js
# Host dependencies
cp -r build/default/node_modules public/
echo "OK"
