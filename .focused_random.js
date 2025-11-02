function resetFocusedRandom() {
  return Math.seedrandom(arguments);
}

function focusedRandom(min, max, focus, mean) {
  // console.log("hello")
  if(max === undefined) {
    max = min;
    min = 0;
  }
  if(focus === undefined) {
    focus = 1.0;
  }
  if(mean === undefined) {
    mean = (min + max) / 2.0;
  }
  if(focus == 0) {
    return d3.randomUniform(min, max)();
  }
  else if(focus < 0) {
    focus = -1 / focus;
  }
  sigma = (max - mean) / focus;
  val = d3.randomNormal(mean, sigma)();
  if (val > min && val < max) {
    return val;
  }
  return d3.randomUniform(min, max)();
}
