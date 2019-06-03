// Takes a coordinate pair in rectangular space and
// translates into coordinates on the face of a cylindrical drawing.

const mapToCylinder = function(
  xRect,
  yRect,
  widthRect,
  widthCylinder,
  xRad,
  yRad
) {
  // xRad should always be 1/2 cylinder diameter. yRad can change with perspective.
  const xCenter = widthCylinder / 2;

  // To avoid stretching make input (widthRect) === 1/2 circumference of cylinder.
  const xPercent = xRect / widthRect;

  // in radians from 0 to pi
  const angle = xPercent * Math.PI;

  const x = xCenter - Math.cos(angle) * xCenter;

  // Formula:
  // center: (h, k)
  // horizontal rad: a
  // vertical rad: b
  // ellipse point: (x, y)
  // (x-h)^2 / a^2 + (y-k)^2 / b^2 = 1
  // therefore
  // y = k +- b sqrt( 1 - ( x^2  - 2xh + h^2) / a^2 )
  const y =
    yRect +
    yRad *
      Math.sqrt(
        1 - (x * x - 2 * x * xCenter + xCenter * xCenter) / (xRad * xRad)
      );

  return [x, y + yRad];
};

export default mapToCylinder;
