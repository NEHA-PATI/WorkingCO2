import json, sys, time
from pathlib import Path
from shapely.geometry import shape, mapping

src=Path(sys.argv[1]); display=Path(sys.argv[2])
t=time.perf_counter(); data=json.loads(src.read_text(encoding='utf-8')); features=data.get('features',[])
if data.get('type')!='FeatureCollection' or not features: raise SystemExit('Invalid or empty FeatureCollection')
invalid=[]; simplified=[]; bounds=[180,90,-180,-90]
for i,f in enumerate(features):
    g=shape(f.get('geometry'))
    if g.is_empty or not g.is_valid: invalid.append(i); continue
    b=g.bounds; bounds=[min(bounds[0],b[0]),min(bounds[1],b[1]),max(bounds[2],b[2]),max(bounds[3],b[3])]
    simplified.append({'type':'Feature','geometry':mapping(g.simplify(0.0015,preserve_topology=True)),'properties':f.get('properties',{})})
if invalid: raise SystemExit(f'Invalid geometries: {len(invalid)}')
display.parent.mkdir(parents=True,exist_ok=True)
display.write_text(json.dumps({'type':'FeatureCollection','name':'gmw_v4112_2025_india_mangrove_extent_display','features':simplified},separators=(',',':')),encoding='utf-8')
print(json.dumps({'feature_count':len(features),'invalid_count':len(invalid),'bounds':bounds,'source_bytes':src.stat().st_size,'display_bytes':display.stat().st_size,'elapsed_seconds':round(time.perf_counter()-t,3),'crs':'EPSG:4326 per source GeoPackage/region index'},indent=2))
