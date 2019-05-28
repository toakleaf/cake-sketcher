const getServings = function(width, height, shape = 'round', servingSize = 13) {
  if (!shape || shape === 'round') {
    const r = width / 2;
    return Math.round((Math.PI * r * r * height) / servingSize);
  }
  if (!shape || shape === 'square') {
    return Math.round((width * width * height) / servingSize);
  }
  return 0;
};

export default getServings;
