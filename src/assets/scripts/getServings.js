const getServings = function(width, height, shape = 'round', servingSize = 13) {
  if (shape === 'square') {
    return Math.round((width * width * height) / servingSize);
  }
  const r = width / 2;
  return Math.round((Math.PI * r * r * height) / servingSize);
};

export default getServings;
