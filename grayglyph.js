/* This is based on the code I created for PS2 in MDDN242:
 * http://www.purview.nz/versions/a14e8ec6660813fd3db1bb6525500e42.html
 * I have made minor modifications to the code in order to allow it to work
 * in co-orditaion with map.js and sketch.js
 */
function GrayGlyph() {
	/*
   * values is an array of 3 numbers: [hue, saturation, brightness]
   *   + hue ranges from 0..360
   *   + saturation ranges from 0..100
   *   + brightness ranges from 0..100
   * this matches the default range for p5.js colorMode(HSB) as describe at:
   *   https://p5js.org/reference/#/p5/colorMode
   *
   * size is the number of pixels for width and height
   *
   * use p5.js to draw a round grayscale glpyh
   * the glyph should stay within the bounding box [0, 0, width, height]
   * this is a grayscale glyph, so only brighness can be adjusted.
   * the range for brighness is 0..100
   *
   * the color mode will be HSB, so you can either:
   *    + use a one argument grayscale call; this is easiest. examples:
   *       - fill(50);    // ranges from 0-100
   *       - stroke(100); // white
   *    + use a three arguement HSB call with values but set both H and S to 0. examples:
   *       - fill(0, 0, 51);    // equivalent to above
   *       - stroke(0, 0, 100); //
   */

  /*
   * @param {Object} p5              - the p5.js object
   * @param {Number} centerX  - center of the x-axis for the current octagon zone
   * @param {Number} centerY  - center of the y-axis for the current octagon zone
   * @param {Number} x1       - left side of a map tile
   * @param {Number} x2		- right side of a map tile
   * @param {Number} y1 		- top side of a map tile
   * @param {Number} y2		- bottom side of a map tile
   * @param {Number}  spot_hue       - value of the hue - a number between 0 and 359
   * @param {Number}  spotMin    	 - minimum hue value that determines whether or not to use the spot_hue - a number between 0 and 359
   * @param {Number}  spotMax   	 - maximum hue value that determines whether or not to use the spot_hue - a number between 0 and 359
   */
  this.draw = function(values, size, p5, centerX, centerY, x1, x2, y1, y2, spot_hue = 360, spotMin = 0, spotMax = 0) {
    //determine the center of the circle
    var center = size/2;

    //this translation required to make the variable center the actual center of an octagonZone object
    var cx = p5.map(centerX, x1, x2, 0, 256);
    var cy = p5.map(centerY, y1, y2, 0, 256);
    p5.translate(cx - center, cy  - center);
    //value of the hue dimension
    var hueDegree = Math.floor(values[0]) % 360;

    //horiVertMin and horiVertMax are values that determine the positions for the alternating points (between the center of a circle and its edge)
    //of the vertical and horizontal triangles used to represent the hue dimension
    var horiVertMin = p5.map(hueDegree, 0, 179, center, 0);
    var horiVertMax = p5.map(hueDegree, 0, 179, center, size);
    if(hueDegree > 179) {
        horiVertMin = 0;
        horiVertMax = size;
    }

    //diagonalMin and diagonalMax are values that determine the position for the alternating points (between the center of a circle and its edge)
    //of the diagonal triangles representing the hue dimension
    var diagonalMin = p5.map(hueDegree, 359, 180, (0 + size/8 + size/32), center);
    var diagonalMax = p5.map(hueDegree, 359, 180, (size - size/8 - size/32), center);

    //variables created by the saturation dimension
    var circleSize = p5.map(values[1], 100, 0, size, 0 + size/16);
	//JSON object containing the different values for the three circles drawn to represent the saturation dimension
	var satCircles = {
		'brightness' : [
					0,
					100,
					0
				],
		'alpha' : [
					0.1875,
					0.625,
					0.375
				],
		'size' : [
					circleSize,
					circleSize/2,
					circleSize/4,
				]
	}

    //variables created by the brightness dimension
    var brightnessTrans = p5.map(values[2], 0, 100, 0.9, 0);
    var hueColour = p5.map(values[2], 0, 100, 100, 0);
    var hueTrans = p5.map(values[2], 100, 0, 0.9, 0.1);

    //set up the JSON objects used to store all the x and y positions of the triangles that will be drawn when this is passed to the drawStar function
    var positions = {
      'x1': [
				center - size/32,
				center - size/32,
				center,
				center + size/32,
				center - size/32,
				center - size/32,
				center,
				center + size/32,
            ],
      'y1': [
				center,
				center - size/32,
				center - size/32,
				center - size/32,
				center,
				center - size/32,
				center - size/32,
				center - size/32
            ],
      'x2': [
				center,
				diagonalMax,
				horiVertMax,
				diagonalMax,
				center,
				diagonalMin,
				horiVertMin,
				diagonalMin
            ],
      'y2': [
				horiVertMin,
				diagonalMin,
				center,
				diagonalMax,
				horiVertMax,
				diagonalMax,
				center,
				diagonalMin
            ],
      'x3': [
				center + size/32,
				center + size/32,
				center,
				center - size/32,
				center + size/32,
				center + size/32,
				center,
				center - size/32
            ],
      'y3': [
				center,
				center + size/32,
				center + size/32,
				center + size/32,
				center,
				center + size/32,
				center + size/32,
				center + size/32
            ]
    }

	//draw the circles that represent the saturation dimension
    p5.stroke(0);
	for(var i = 0; i < 3; i++){
		p5.fill(0, 0,satCircles['brightness'][i], satCircles['alpha'][i]);
		p5.ellipse(center, center, satCircles['size'][i]);
	}

    //draw the hexagon that represents the brightness dimension
    var oct_sat = 0;
    if(spot_hue < 360){
        oct_sat = 100;
    }
    p5.fill(spot_hue, oct_sat, 100, brightnessTrans);
    octagon(p5, center, center, size/3);

	//draw the stars that represent the hue dimension
    p5.noStroke();
	p5.angleMode(p5.DEGREES);
    p5.translate(center, center);
    p5.rotate(hueDegree);

	var hsba = Array(spot_hue, 0, 100, hueTrans);
    if(spot_hue < 360){
        hsba[1] = 100;
    }
    drawStar(p5, hsba, positions, 3);
    p5.rotate(-hueDegree);
    p5.translate(-center, -center);
    hsba = Array(spot_hue, 100, 100, hueTrans);
	drawStar(p5, Array(0, 0, 100, 0.8), positions);
    //reset various settings to their previous values before this functoin was called
    p5.noFill();
    p5.angleMode(p5.RADIANS);
    p5.translate(-(cx - center), -(cy - center));
  }
}

/*
 * function to draw a hexagon shape
 * adapted from: https://p5js.org/examples/form-regular-polygon.html
 * @param {Object} p5       - the p5.js object
 * @param {Number} x       	- x-coordinate of the hexagon
 * @param {Number} y    	- y-coordinate of the hexagon
 * @param {Number} radius   - radius of the hexagon
 */
function octagon(p5, x, y, radius) {
  p5.angleMode(p5.RADIANS);
  var angle = p5.TWO_PI / 8;
  p5.beginShape();
  for (var a = p5.TWO_PI/16; a < p5.TWO_PI + p5.TWO_PI/16; a += angle) {
    var sx = x + p5.cos(a) * radius;
    var sy = y + p5.sin(a) * radius;
    p5.vertex(sx, sy);
  }
  p5.endShape(p5.CLOSE);
}

/*
 * function to draw the 8 triangles that repressnt the hue dimension
 * the colour and transparency level of the triangles is also affected by the brightness dimension
 * @param {Object} p5               - the p5.js object
 * @param {Array}  hsba       		- Array of values used to set the values for the fill function
 * @param {Object} positions    	- Object containing all the x and y positions of the 8 triangles that make up the star
 * @param {Number} sizeReducer   	- Variable that allows the star to drawn at smaller size, should be greater than 1
 */
function drawStar(p5, hsba, positions, sizeReducer = 1) {
	p5.fill(hsba[0], hsba[1], hsba[2], hsba[3]);
	for($i = 0; $i < 8; $i++){
        p5.triangle(positions['x1'][$i]/sizeReducer, positions['y1'][$i]/sizeReducer, positions['x2'][$i]/sizeReducer, positions['y2'][$i]/sizeReducer, positions['x3'][$i]/sizeReducer, positions['y3'][$i]/sizeReducer);
    }
}
