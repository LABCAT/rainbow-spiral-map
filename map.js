var myCRS = L.extend({}, L.CRS.Simple, {
  transformation: new L.Transformation(1, 0,
    // -1, // works like expected
    1, // image travels while zooming
    0)
});

if (typeof initialZoomLevel === 'undefined') {
  var initialZoomLevel = 0;
}

if (typeof maxZoomLevel === 'undefined') {
  var maxZoomLevel = 16;
}

var worldMap = new L.Map('map', {  
  continuousWorld:true, 
  minZoom: 0,
  maxZoom: maxZoomLevel,
  crs: myCRS,
  attributionControl: false,
  center: [512, 512], 
  zoom: initialZoomLevel});

worldMap._p5_seed = Math.floor(Math.random() * 1000);
worldMap._p5_depth = 0.0;
// console.log("Seed start", worldMap._p5_seed)
// Assuming your map instance is in a variable called map
var hash = new L.Hash(worldMap);
// console.log("Seed now", worldMap._p5_seed)

var s = function( p ) {

  p.setup = function() {
    canvas = p.createCanvas(p._L_width, p._L_height);
    p.noLoop();
  };

  p.draw = function() {
    if ("_L_size" in p && "_L_nw" in p) {
      var nw = p._L_nw;
      var t_size = p._L_size;
      var zoom = p._L_zoom;
      var m_x1 = nw.lng;
      var m_y1 = nw.lat;
      var m_x2 = m_x1 + t_size;
      var m_y2 = m_y1 + t_size;
      var depth = p._L_depth;
      p.noiseSeed(p._L_seed)
      drawGrid(p, m_x1, m_x2, m_y1, m_y2, depth, zoom);
    }
  };
};

var tiles = new L.GridLayer({continuousWorld: true});
tiles.createTile = function(coords) {
  if (!("_hash_parsed" in worldMap)) {
    return L.DomUtil.create('canvas', 'leaflet-tile');
  }
  var size = this.getTileSize();
  var myp5 = new p5(s);
  myp5._L_width = size.x;
  myp5._L_height = size.y;
  myp5._L_zoom = coords.z;
  myp5._L_seed = worldMap._p5_seed;
  myp5._L_depth = worldMap._p5_depth;
  myp5._L_coords = coords;
  // calculate projection coordinates of top left tile pixel
  myp5._L_nwPoint = coords.scaleBy(size);
  myp5._L_size = 256.0 / Math.pow(2, coords.z)
  
  // calculate geographic coordinates of top left tile pixel
  myp5._L_nw = worldMap.unproject(myp5._L_nwPoint, coords.z)

  myp5._start();
  var tile = myp5.canvas;
  L.DomUtil.addClass(tile, 'leaflet-tile');

  return tile;
}

tiles.addTo(worldMap)

var curLinkIndex = 0;

linkHome = "#0/0/512/512/0"

if (typeof tourPath === 'undefined') {
  var tourPath = [
    [2, 512, 512],
    [4, 512, 512],
    [6, 512, 512],
    [8, 512, 512]
  ]
}
tourPath.unshift([initialZoomLevel, 512, 512]);

if (typeof tourSeed === 'undefined') {
  var tourSeed = 0;
}

function clickHome() {
  worldMap.flyTo([tourPath[0][1], tourPath[0][2]], tourPath[0][0]);
}

function clickDemo() {
  if(worldMap._p5_seed != tourSeed) {
    var center = worldMap.getCenter();
    var zoom = worldMap.getZoom();
    worldMap._p5_seed = tourSeed;
    tiles.redraw();
    // worldMap.setView(center, zoom, {reset: true});
    curLinkIndex = 0;
  }
  else {
    curLinkIndex = (curLinkIndex + 1) % tourPath.length
  }
  var curDest = tourPath[curLinkIndex]
  worldMap.flyTo([curDest[1], curDest[2]], curDest[0]);
}

function clickReset() {
  window.location.reload();
}

attrib = new L.Control.Attribution
attrib.setPrefix("")
attrStr = '<a href="#" onclick="javascript:clickHome();">home</a> | '
attrStr += '<a href="#" onclick="javascript:clickReset();">reset</a> | '
attrStr += '<a href="#" onclick="javascript:clickDemo();">tour</a>'
attrib.addAttribution(attrStr)
worldMap.addControl(attrib)

