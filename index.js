const h = document.documentElement.clientHeight;
const w = document.documentElement.clientWidth;

const canvas  = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const pxRatio = window.devicePixelRatio;

const width = w * pxRatio;
const height = h * pxRatio;


canvas.width  = width;
canvas.height = height;
canvas.style.width  = w + 'px';
canvas.style.height = h + 'px';

ctx.translate(width / 2, height / 2);

function generate([cx, cy] = [0,0], r = 100, sides = 10, startAngle = 0) {
  let angle = startAngle;
  const incr = 360 / sides;
  const polygon = [];
  for (let i = 0; i < sides; i++) {
    polygon.push([
      cx + r * Math.cos(angle),
      cy + r * Math.sin(angle)
    ]);
    angle += incr;
  }
  return polygon;
}

function renderContour(polygon) {
  ctx.lineWidth = 1;
  ctx.strokeStyle = 'rgba(100,0,0,0.5)';
  ctx.beginPath();
  ctx.moveTo(polygon[0][0], polygon[0][1]);
  for (let i = 1, len = polygon.length; i < len; i++) {
    const [x, y] = polygon[i];
    ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.stroke();
  ctx.fill();
}

function offset(polygon) {

}
