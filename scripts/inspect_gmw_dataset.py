import json, sqlite3, struct, sys
from pathlib import Path
from shapely import wkb

DEFAULT = Path(__file__).resolve().parents[1] / 'gmw_v4112_2025_mng_ext_cntry_info_vec.gpkg'

def gpkg_wkb(blob):
    if blob[:2] != b'GP': raise ValueError('Not a GeoPackage geometry blob')
    flags = blob[3]; envelope = (flags >> 1) & 0x07
    offset = 8 + {0: 0, 1: 32, 2: 48, 3: 48, 4: 64}[envelope]
    return wkb.loads(blob[offset:])

def inspect(path):
    if path.is_dir():
        candidates = list(path.glob('*.gpkg'))
        if len(candidates) != 1: raise ValueError(f'Expected one GeoPackage inside {path}')
        path = candidates[0]
    con = sqlite3.connect(path)
    layers = con.execute("SELECT table_name, identifier, srs_id FROM gpkg_contents WHERE data_type='features'").fetchall()
    result = {'path': str(path), 'layers': []}
    for table, identifier, srs_id in layers:
        columns = con.execute(f'PRAGMA table_info("{table}")').fetchall()
        geom_col, geom_type, geom_srs = con.execute('SELECT column_name, geometry_type_name, srs_id FROM gpkg_geometry_columns WHERE table_name=?', (table,)).fetchone()
        count = con.execute(f'SELECT COUNT(*) FROM "{table}"').fetchone()[0]
        sample = con.execute(f'SELECT "{geom_col}", * FROM "{table}" LIMIT 1').fetchone()
        geom = gpkg_wkb(sample[0]) if sample and sample[0] else None
        result['layers'].append({'table': table, 'identifier': identifier, 'srs_id': srs_id, 'geometry_column': geom_col, 'geometry_type': geom_type, 'geometry_srs_id': geom_srs, 'feature_count': count, 'columns': [{'name': c[1], 'type': c[2]} for c in columns], 'sample_bounds': list(geom.bounds) if geom else None})
    result['spatial_ref_sys'] = [dict(zip(['srs_name','srs_id','organization','organization_coordsys_id','definition'], row[:5])) for row in con.execute('SELECT srs_name,srs_id,organization,organization_coordsys_id,definition FROM gpkg_spatial_ref_sys').fetchall()]
    print(json.dumps(result, indent=2, default=str))

if __name__ == '__main__': inspect(Path(sys.argv[1]) if len(sys.argv) > 1 else DEFAULT)
