const svgPathParser = function(path) {
  // "M0 0L100 100z" => [["M", "0", "0"], ["L", "100", "100"], ["z"]]
  // "M10,.10,h80v80h-80Z" => [["M", "10", ".10"], ["h", "80"], ["v", "80"], ["h", "-80"], ["Z"]]
  return path
    .split(/(?=[A-Za-z])/)
    .map(arr => arr.split(/[ ,\n]|([A-Za-z])(?=[0-9]|-|.)/).filter(el => el));
};

export default svgPathParser;
