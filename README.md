## Rainbow Spiral Map

![alt text](https://raw.githubusercontent.com/LABCAT/rainbow-spiral-map/master/preview.png)

The rainbow spiral map is a gigantic diamond shape consisting of approximately 1.5 million octagon zones.  Each octagon zone is placed on the map in a specific order with the first zone located slightly to the left of the maps center.  Every following zone is placed on the map based on the location of the zone that precedes it.

The colour palette of the map uses the HSB colour mode.  Beginning from the first octagon zone, there is a repeating pattern consisting of 24 colours used to determine the colour of each zone.  This creates the rainbow spiral effect present at the highest zoom level.

Each octagon zone also consists of a set of 24 glyphs. At the higher zoom levels the glyphs consist of a simple shape.  This shape is chosen using the perlin noise value obtained from the x and y co-ordinates of the glyphs center.  As you zoom into the map the glyphs start transforming into intricate patterns made by rotating the shape around it's center.

The octagon zones have been designed to provide an interesting experience when using the zooming tool.  If you start from the center of a zone at the highest level and then zoom into the deepest level, you will see the glyphs evolve as you travel through each layer. As you get closer to the deepest level, a secret glyph becomes visible at the very center of the zone. This glyph represents the primary colour of the zone and is unique for each of the 24 possible colours.  
