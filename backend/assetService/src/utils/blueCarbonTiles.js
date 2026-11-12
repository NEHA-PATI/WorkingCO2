const { calculateGeometry } = require('./blueCarbonGeometry');

// WGS84 / UTM projection. Tile dimensions are therefore measured in metres in
// a proper local projected CRS rather than in latitude/longitude degrees.
function zoneFor(lng) { return Math.max(1, Math.min(60, Math.floor((lng + 180) / 6) + 1)); }
function project([lng, lat], zone) {
  const a=6378137, ecc=0.00669438, k0=0.9996, e2=ecc/(1-ecc), r=Math.PI/180, p=lat*r, l=(lng-(zone*6-183))*r;
  const n=a/Math.sqrt(1-ecc*Math.sin(p)**2), t=Math.tan(p)**2, c=e2*Math.cos(p)**2, A=Math.cos(p)*l;
  const M=a*((1-ecc/4-3*ecc**2/64-5*ecc**3/256)*p-(3*ecc/8+3*ecc**2/32+45*ecc**3/1024)*Math.sin(2*p)+(15*ecc**2/256+45*ecc**3/1024)*Math.sin(4*p)-(35*ecc**3/3072)*Math.sin(6*p));
  return [k0*n*(A+(1-t+c)*A**3/6+(5-18*t+t*t+72*c-58*e2)*A**5/120)+500000,k0*(M+n*Math.tan(p)*(A*A/2+(5-t+9*c+4*c*c)*A**4/24+(61-58*t+t*t+600*c-330*e2)*A**6/720))+(lat<0?10000000:0)];
}
function unproject([x,y], zone, southern) {
  const a=6378137,ecc=0.00669438,k0=0.9996,e1=(1-Math.sqrt(1-ecc))/(1+Math.sqrt(1-ecc)),x0=x-500000,y0=southern?y-10000000:y,e2=ecc/(1-ecc),M=y0/k0,mu=M/(a*(1-ecc/4-3*ecc**2/64-5*ecc**3/256)),p=mu+(3*e1/2-27*e1**3/32)*Math.sin(2*mu)+(21*e1**2/16-55*e1**4/32)*Math.sin(4*mu)+(151*e1**3/96)*Math.sin(6*mu);
  const n1=a/Math.sqrt(1-ecc*Math.sin(p)**2),t1=Math.tan(p)**2,c1=e2*Math.cos(p)**2,r1=a*(1-ecc)/(1-ecc*Math.sin(p)**2)**1.5,d=x0/(n1*k0),lat=(p-n1*Math.tan(p)/r1*(d*d/2-(5+3*t1+10*c1-4*c1*c1-9*e2)*d**4/24+(61+90*t1+298*c1+45*t1*t1-252*e2-3*c1*c1)*d**6/720))/ (Math.PI/180),lng=(zone*6-183)+(d-(1+2*t1+c1)*d**3/6+(5-2*c1+28*t1-3*c1*c1+8*e2+24*t1*t1)*d**5/120)/Math.cos(p)/(Math.PI/180);
  return [lng,lat];
}
function clip(subject, edge, value, keepGreater) {
  const out = [];
  for (let i = 0; i < subject.length; i++) {
    const a = subject[i], b = subject[(i + 1) % subject.length];
    const av = a[edge], bv = b[edge];
    const ain = keepGreater ? av >= value : av <= value;
    const bin = keepGreater ? bv >= value : bv <= value;
    if (ain !== bin) {
      const t = (value - av) / (bv - av);
      out.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]);
    }
    if (bin) out.push(b);
  }
  return out;
}
function clipRect(poly, x0, x1, y0, y1) {
  let out = poly;
  [[0, x0, true], [0, x1, false], [1, y0, true], [1, y1, false]].forEach(([edge, value, greater]) => { if (out.length) out = clip(out, edge, value, greater); });
  return out;
}
function isConvex(poly) { let sign=0; for(let i=0;i<poly.length;i++){const a=poly[i],b=poly[(i+1)%poly.length],c=poly[(i+2)%poly.length],cross=(b[0]-a[0])*(c[1]-b[1])-(b[1]-a[1])*(c[0]-b[0]); if(Math.abs(cross)<1e-9)continue; const next=Math.sign(cross); if(!sign)sign=next; else if(sign!==next)return false;} return true; }
function pointInPolygon(point, poly) { let inside=false; for(let i=0,j=poly.length-1;i<poly.length;j=i++){const a=poly[i],b=poly[j]; if(((a[1]>point[1])!==(b[1]>point[1]))&&point[0]<(b[0]-a[0])*(point[1]-a[1])/(b[1]-a[1])+a[0])inside=!inside;} return inside; }
function clipToConvexPolygon(subject, polygon) { let out=subject; const ccw=polygon.reduce((sum,p,i)=>{const q=polygon[(i+1)%polygon.length];return sum+p[0]*q[1]-q[0]*p[1]},0)>0; for(let i=0;i<polygon.length&&out.length;i++){const a=polygon[i],b=polygon[(i+1)%polygon.length]; const edge=(p)=>(b[0]-a[0])*(p[1]-a[1])-(b[1]-a[1])*(p[0]-a[0]); const keep=ccw?edge:((p)=>-edge(p)); const next=[]; for(let j=0;j<out.length;j++){const p=out[j],q=out[(j+1)%out.length],pv=keep(p),qv=keep(q),pin=pv>=-1e-9,qin=qv>=-1e-9; if(pin!==qin){const t=pv/(pv-qv);next.push([p[0]+(q[0]-p[0])*t,p[1]+(q[1]-p[1])*t]);} if(qin)next.push(q);} out=next;} return out; }
function areaAndCentroid(points) {
  let a = 0, x = 0, y = 0;
  for (let i = 0; i < points.length; i++) { const p = points[i], q = points[(i + 1) % points.length], cross = p[0] * q[1] - q[0] * p[1]; a += cross; x += (p[0] + q[0]) * cross; y += (p[1] + q[1]) * cross; }
  a /= 2; return { area: Math.abs(a), centroid: [x / (6 * a), y / (6 * a)] };
}
function generateTiles(geometry, tileSizeM = 250, shape = 'square', blockSizeM = tileSizeM) {
  const origin = (() => { const g = calculateGeometry(geometry); return [g.centroid_lng, g.centroid_lat]; })();
  const zone = zoneFor(origin[0]); const southern = origin[1] < 0;
  const ring = geometry.type === 'Feature' ? geometry.geometry.coordinates[0] : geometry.type === 'Polygon' ? geometry.coordinates[0] : geometry.coordinates[0][0];
  const points = ring.map(p => project(p, zone));
  const convexBoundary = isConvex(points);
  const xs = points.map(p => p[0]), ys = points.map(p => p[1]);
  const width = Number(tileSizeM); const height = shape === 'rectangle' ? width * 0.5 : width;
  const blockWidth = Number(blockSizeM);
  if (!Number.isFinite(width) || width < 10 || width > 10000) throw new Error('tileSizeM must be between 10 and 10000 metres');
  const tiles = [];
  for (let row = 0, y = Math.min(...ys); y < Math.max(...ys); row++, y += height) for (let col = 0, x = Math.min(...xs); x < Math.max(...xs); col++, x += width) {
    const cell = [[x,y],[x+width,y],[x+width,y+height],[x,y+height]];
    const center = [x + width/2, y + height/2];
    // For concave hand-drawn boundaries, keep only complete cells whose corners
    // are inside the polygon. This prevents generated grids from spilling
    // outside the user's boundary. Convex boundaries are clipped below so
    // their edge cells can follow the drawn outline precisely.
    if (!convexBoundary && !cell.every((corner) => pointInPolygon(corner, points))) continue;
    const clipped = convexBoundary ? clipToConvexPolygon(cell, points) : clipRect(cell, x, x+width, y, y+height);
    if (clipped.length < 3) continue;
    const metric = areaAndCentroid(clipped); if (metric.area < 1) continue;
    const blockColumn = Math.floor((x - Math.min(...xs)) / blockWidth);
    const blockRow = Math.floor((y - Math.min(...ys)) / blockWidth);
    const blockX = Math.min(...xs) + blockColumn * blockWidth;
    const blockY = Math.min(...ys) + blockRow * blockWidth;
    const blockCell = [[blockX,blockY],[blockX+blockWidth,blockY],[blockX+blockWidth,blockY+blockWidth],[blockX,blockY+blockWidth]];
    const clippedBlock = convexBoundary ? clipToConvexPolygon(blockCell, points) : clipRect(blockCell, blockX, blockX+blockWidth, blockY, blockY+blockWidth);
    const geo = clipped.concat([clipped[0]]).map(p => unproject(p, zone, southern));
    const blockGeo = clippedBlock.length >= 3 ? clippedBlock.concat([clippedBlock[0]]).map(p => unproject(p, zone, southern)) : null;
    const centroid = unproject(metric.centroid, zone, southern);
    tiles.push({ row, column: col, area_hectares: metric.area / 10000, centroid_lat: centroid[1], centroid_lng: centroid[0], block_row: blockRow, block_column: blockColumn, geometry_geojson: { type: 'Polygon', coordinates: [geo], properties: { block_geometry_geojson: blockGeo ? { type: 'Polygon', coordinates: [blockGeo] } : null } } });
  }
  return tiles;
}
module.exports = { generateTiles };
