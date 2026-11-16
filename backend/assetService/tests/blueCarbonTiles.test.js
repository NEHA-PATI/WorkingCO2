const { generateTiles } = require('../src/utils/blueCarbonTiles');

describe('Blue Carbon projected tile generation', () => {
  test('generates metre-sized tiles with unique grid coordinates', () => {
    const geometry = { type: 'Polygon', coordinates: [[[86.9,20.7],[86.94,20.7],[86.94,20.74],[86.9,20.74],[86.9,20.7]]] };
    const tiles = generateTiles(geometry, 250, 'square');
    expect(tiles.length).toBeGreaterThan(0);
    expect(new Set(tiles.map((tile) => `${tile.row}:${tile.column}`)).size).toBe(tiles.length);
    expect(tiles.every((tile) => tile.area_hectares > 0 && tile.geometry_geojson.type === 'Polygon')).toBe(true);
  });
  test('clips edge tiles to a convex project boundary', () => {
    const geometry = { type: 'Polygon', coordinates: [[[86.9,20.7],[86.94,20.7],[86.92,20.74],[86.9,20.7]]] };
    const tiles = generateTiles(geometry, 500, 'square');
    expect(tiles.length).toBeGreaterThan(0);
    expect(tiles.some((tile) => tile.area_hectares < 25)).toBe(true);
  });
});
