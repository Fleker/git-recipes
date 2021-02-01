# Copy compiled components
cp build/default/frontend/carousel-image.js public/src/carousel-image.js
cp build/default/frontend/cookbook.js public/src/cookbook.js
cp build/default/frontend/recipe.js public/src/recipe.js
cp build/default/frontend/styled-card.js public/src/styled-card.js
cp build/default/frontend/titlebar.js public/src/titlebar.js
cp build/default/frontend/video-youtube.js public/src/video-youtube.js
# Host dependencies
cp -r build/default/node_modules public/
# Update index
# cp
echo "OK"
