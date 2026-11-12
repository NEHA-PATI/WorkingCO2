"""Extract India features from the GMW GeoPackage without modifying the source.

The supplied layer has country attributes only; it does not contain named
regional boundaries. The output therefore deliberately exposes India as a
source extent and records that named-region selection needs an authoritative
region boundary dataset.
"""
import json, sqlite3, struct, sys
from pathlib import Path
from shapely import wkb
from shapely.geometry import mapping
from shapely.ops import unary_union

SUPPORTED_REGION_TARGETS = [
    'Sundarbans','Subernarekha Estuary','Bhitarkanika','Mahanadi Delta','Chilika',
    'Coringa/Godavari','Krishna Delta','Pulicat','Pichavaram/Kazhuveli','Muthupet/Ramnad',
    'Rann of Kachchh','Gulf of Khambhat','Dumas-Ubharat','Mumbra-Diva/Vikhroli',
    'Veldur/Kundalika','Ratnagiri/Malwan','Mandovi-Zuari','Karwar','Kundapura','Mangalore','Kannur','Vembanad'
]

def decode(blob):
    flags=blob[3]; envelope=(flags>>1)&7; offset=8+{0:0,1:32,2:48,3:48,4:64}[envelope]; return wkb.loads(blob[offset:])

def main(src, out_dir):
    if src.is_dir(): src=next(src.glob('*.gpkg'))
    out_dir.mkdir(parents=True, exist_ok=True)
    con=sqlite3.connect(src); table=con.execute("select table_name from gpkg_contents where data_type='features'").fetchone()[0]
    rows=con.execute(f'SELECT fid, geom, cntry_iso3, cntry_name FROM "{table}" WHERE upper(cntry_iso3)=\'IND\' OR lower(cntry_name)=\'india\'')
    features=[]; geoms=[]; bounds=[180,90,-180,-90]
    for fid, blob, iso, country in rows:
        g=decode(blob); geoms.append(g); b=g.bounds; bounds=[min(bounds[0],b[0]),min(bounds[1],b[1]),max(bounds[2],b[2]),max(bounds[3],b[3])]; features.append({'type':'Feature','geometry':mapping(g),'properties':{'source_feature_id':fid,'country_iso3':iso,'country_name':country,'dataset':'Global Mangrove Watch','dataset_version':'v4.1.1','observation_year':2025}})
    collection={'type':'FeatureCollection','name':'gmw_v4112_2025_india_mangrove_extent','features':features}
    (out_dir/'gmw_v4112_2025_india_mangrove_extent.geojson').write_text(json.dumps(collection,separators=(',',':')),encoding='utf-8')
    lookup={'dataset':'Global Mangrove Watch','dataset_version':'v4.1.1','observation_year':2025,'source_crs':'EPSG:4326','country':'India','feature_count':len(features),'named_regions_available':False,'limitation':'Source attributes contain country only; named regional boundaries are not asserted or fabricated.','india_bounds':bounds if features else None,'regions':{name:{'status':'unsupported','reason':'No authoritative region polygon supplied; country-level mangrove features cannot define this named region.'} for name in SUPPORTED_REGION_TARGETS}}
    (out_dir/'gmw_v4112_2025_region_index.json').write_text(json.dumps(lookup,indent=2),encoding='utf-8')
    print(json.dumps(lookup,indent=2))

if __name__=='__main__': main(Path(sys.argv[1]),Path(sys.argv[2]) if len(sys.argv)>2 else Path('data/blue-carbon'))
