const getServings = function(
  width,
  height,
  shape = 'round',
  servingSize = 13,
  taper = 1
) {
  const r = width / 2;
  switch (shape) {
    case 'square':
      return Math.round((width * width * height) / servingSize);
    case 'topsy_turvy_up':
    case 'topsy_turvy_down':
    case 'round_taper':
      // formula for tapered tiers: https://keisan.casio.com/exec/system/1223372110
      return Math.round(
        ((1 / 3) *
          Math.PI *
          (Math.pow(r, 2) + r * (r - taper / 2) + Math.pow(r - taper / 2, 2)) *
          height) /
          servingSize
      );
    default:
      return Math.round((Math.PI * r * r * height) / servingSize);
  }
};

export default getServings;
