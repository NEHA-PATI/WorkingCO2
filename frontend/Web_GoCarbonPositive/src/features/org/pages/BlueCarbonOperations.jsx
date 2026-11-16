import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { blueCarbonApi } from "@features/org/services/blueCarbonApi";
import "@features/org/styles/BlueCarbon.css";
import "@features/org/styles/BlueCarbonOperations.css";
import "leaflet/dist/leaflet.css";
import {
  FaCalendarAlt,
  FaCheckCircle,
  FaDrawPolygon,
  FaInfoCircle,
  FaLayerGroup,
  FaMapMarkedAlt,
  FaRulerCombined,
  FaTrashAlt,
  FaUserCheck,
  FaWater,
} from "react-icons/fa";

const statusColor = {
  monitored: "#16a36a",
  approved: "#16a36a",
  pending: "#ef4444",
  in_progress: "#ed941f",
  assigned: "#ed941f",
  unassigned: "#8b99a6",
};

const statusLabel = (value) =>
  String(value || "unassigned").replaceAll("_", " ");

const gridPalette = [
  "#22c55e", // green — monitored
  "#f59e0b", // amber — in progress
  "#ef4444", // red — pending
];
const VISUAL_COLOR_MODE = true;

function gridDisplayColor(tile) {
  const status = satelliteStatus(tile);
  const indicators = tile.satellite_indicators || tile.indicators || {};
  const ndvi = Number(indicators.NDVI?.mean ?? indicators.NDVI);
  const evi = Number(indicators.EVI?.mean ?? indicators.EVI);
  // Explicit backend warnings always win. When the provider labels every
  // tile GREEN, use the vegetation index values to create a useful three-band
  // visual scale instead of showing a misleading all-green map.
  if (status === "RED") return "#ef4444";
  if (status === "AMBER") return "#f59e0b";
  if (Number.isFinite(ndvi) || Number.isFinite(evi)) {
    const score = [ndvi, evi].filter(Number.isFinite).reduce((sum, value, _, values) => sum + value / values.length, 0);
    // The provider's normalized coastal indices commonly sit below 0.6;
    // these bands keep the map useful for that range.
    if (score < 0.20) return "#ef4444";
    if (score < 0.40) return "#f59e0b";
    return "#22c55e";
  }
  if (status === "GREEN") return "#22c55e";
  return "#94a3b8";
}

function satelliteStatus(tile) {
  return String(tile.satellite_health_status || tile.health_status || "GREY").toUpperCase();
}

function tilePopupContent(tile) {
  const indicators = tile.satellite_indicators || tile.indicators || {};
  const indicatorRows = ["NDVI", "EVI", "NDMI", "NDWI", "MNDWI", "NDRE"]
    .map((key) => `${key}: ${Number.isFinite(Number(indicators[key]?.mean)) ? Number(indicators[key].mean).toFixed(3) : "—"}`)
    .join("<br>");
  return `<div class="bc-tile-popup"><strong>${tile.tile_code || tile.tile_id}</strong><br>Status: <b>${satelliteStatus(tile)}</b><br>Observed: ${tile.satellite_observed_on || "—"}<br>Valid pixels: ${tile.satellite_valid_pixel_percentage == null ? "—" : `${Number(tile.satellite_valid_pixel_percentage).toFixed(1)}%`}<br>Quality: ${tile.satellite_data_quality || "—"}<hr>${indicatorRows}</div>`;
}

export default function BlueCarbonOperations() {
  const [projects, setProjects] = useState([]);
  const [projectId, setProjectId] = useState("");
  const [tiles, setTiles] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const assignmentCache = useRef(new Map());

  const [boundary, setBoundary] = useState([]);
  const [drawing, setDrawing] = useState(false);
  const [editingBoundary, setEditingBoundary] = useState(false);
  const [assignee, setAssignee] = useState("");
  const [blockSize, setBlockSize] = useState(300);
  const [innerGridSize, setInnerGridSize] = useState(30);
  const [frequency, setFrequency] = useState("monthly");

  const [message, setMessage] = useState("");
  const [selectedBlock, setSelectedBlock] = useState(null);
  const [selectedTile, setSelectedTile] = useState(null);
  const [tileHistory, setTileHistory] = useState(null);
  const [satelliteHistory, setSatelliteHistory] = useState([]);
  const [healthFilter, setHealthFilter] = useState("ALL");
  const [isGenerating, setIsGenerating] = useState(false);
  const generationRequest = useRef(0);
  const refreshRequest = useRef(0);

  const refresh = async (id = projectId) => {
    if (!id) return;
    const requestId = ++refreshRequest.current;

    try {
      const [tileResult, assignmentResult] = await Promise.all([
        blueCarbonApi.tiles(id),
        blueCarbonApi.assignments(id),
      ]);

      const rows = tileResult.data || [];
      const serverAssignments = (assignmentResult.data || []).filter(
        (item) => item.active !== false && String(item.active).toLowerCase() !== "false"
      );
      const savedAssignedIds = JSON.parse(window.localStorage.getItem(`blue-carbon-assigned-tiles:${id}`) || "[]");
      const cachedAssignments = assignmentCache.current.get(String(id)) || [];
      const activeAssignments = [...serverAssignments, ...cachedAssignments, ...savedAssignedIds
        .filter((tileId) => !serverAssignments.some((item) => String(item.tile_id) === String(tileId)))
        .map((tileId) => ({ tile_id: tileId, assignee_id: "Assigned field user" }))];
      const uniqueAssignments = activeAssignments.filter((item, index, list) => list.findIndex((candidate) => String(candidate.tile_id) === String(item.tile_id)) === index);
      assignmentCache.current.set(String(id), uniqueAssignments);
      const serverAssignedIds = serverAssignments.map((item) => item.tile_id).filter(Boolean);
      if (serverAssignedIds.length) {
        window.localStorage.setItem(
          `blue-carbon-assigned-tiles:${id}`,
          JSON.stringify([...new Set([...savedAssignedIds, ...serverAssignedIds])])
        );
      }

      // Ignore a slower response for the project that was previously selected.
      if (requestId !== refreshRequest.current || String(id) !== String(projectId)) return;
      const satelliteCacheKey = `blue-carbon-satellite:${id}`;
      const satelliteCache = JSON.parse(window.localStorage.getItem(satelliteCacheKey) || "{}");
      rows.forEach((tile) => {
        const status = String(tile.satellite_health_status || tile.health_status || "GREY").toUpperCase();
        if (status !== "GREY" || tile.satellite_indicators) satelliteCache[String(tile.tile_id)] = tile;
      });
      window.localStorage.setItem(satelliteCacheKey, JSON.stringify(satelliteCache));

      setAssignments(uniqueAssignments);
      setTiles(
        rows.map((tile) => {
          const cachedTile = satelliteCache[String(tile.tile_id)];
          const satelliteTile = String(tile.satellite_health_status || tile.health_status || "GREY").toUpperCase() === "GREY" && cachedTile ? { ...tile, ...cachedTile } : tile;
          const activeAssignment = activeAssignments.find(
            (item) => String(item.tile_id) === String(tile.tile_id)
          );
          return {
            ...satelliteTile,
            ...((String(tile.satellite_health_status || tile.health_status || "GREY").toUpperCase() === "GREY" && satelliteCache[String(tile.tile_id)]) ? satelliteCache[String(tile.tile_id)] : {}),
            // Keep the map independent of API/driver casing differences.
            // The SQL endpoint uses snake_case, while some deployments return
            // the observation field without the join alias.
            satellite_health_status: String(
              satelliteTile.satellite_health_status ||
                satelliteTile.health_status ||
                tile.satelliteHealthStatus ||
                "GREY"
            ).toUpperCase(),
            assignee_id: tile.assignee_id || tile.assigned_to || activeAssignment?.assignee_id,
            assigned_to: tile.assigned_to || activeAssignment?.assignee_id,
            status: activeAssignment || tile.assignee_id || tile.assigned_to || tile.status === "assigned" || tile.status === "in_progress" ? "assigned" : tile.status,
          };
        })
      );
    } catch (error) {
      setMessage(
        error?.response?.data?.message ||
          "Unable to load monitoring grids."
      );
    }
  };

  useEffect(() => {
    blueCarbonApi
      .projects()
      .then((result) => {
        const rows = result.data || [];
        setProjects(rows);

        if (rows[0]) {
          setProjectId(rows[0].project_id);
        }
      })
      .catch(() => setMessage("Unable to load projects."));
  }, []);

  useEffect(() => {
    // projectId is set asynchronously after the project list loads. Fetch here
    // with the captured id so a reload always hydrates the persisted grid.
    setSelectedBlock(null);
    setSelectedTile(null);
    if (projectId) {
      refresh(projectId);
      // A reload can happen while the last satellite write is finishing.
      // Re-read once shortly afterward so persisted observations become
      // visible without requiring tile regeneration.
      const retry = window.setTimeout(() => refresh(projectId), 1500);
      return () => window.clearTimeout(retry);
    }
  }, [projectId]);

  useEffect(() => {
    if (!projectId) return;
    const project = projects.find((item) => item.project_id === projectId);
    const saved = window.localStorage.getItem(`blue-carbon-workspace:${projectId}`);
    if (saved) {
      try {
        const settings = JSON.parse(saved);
        if ([100, 300, 500].includes(Number(settings.blockSize))) setBlockSize(Number(settings.blockSize));
        if ([10, 30, 50].includes(Number(settings.innerGridSize))) setInnerGridSize(Number(settings.innerGridSize));
        if (settings.frequency) setFrequency(settings.frequency);
      } catch { /* ignore malformed browser cache */ }
    }
    const ring = project?.boundary_geojson?.geometry?.coordinates?.[0] || project?.boundary_geojson?.coordinates?.[0];
    if (ring?.length >= 3) setBoundary(ring.slice(0, -1).map(([lng, lat]) => [lat, lng]));
  }, [projectId, projects]);

  useEffect(() => {
    if (!projectId) return;
    window.localStorage.setItem(`blue-carbon-workspace:${projectId}`, JSON.stringify({ blockSize, innerGridSize, frequency }));
  }, [projectId, blockSize, innerGridSize, frequency]);

  useEffect(() => {
    if (!selectedTile) return;

    blueCarbonApi
      .tileHistory(selectedTile.tile_id)
      .then((result) => setTileHistory(result.data))
      .catch(() => setTileHistory(null));
    blueCarbonApi.satelliteHistory(projectId, selectedTile.tile_id)
      .then((result) => setSatelliteHistory(result.data || []))
      .catch(() => setSatelliteHistory([]));
  }, [selectedTile, projectId]);

  const blocks = useMemo(() => makeBlocks(tiles, blockSize, innerGridSize), [tiles, blockSize, innerGridSize]);
  const visibleBlocks = useMemo(() => blocks.map((block) => ({ ...block, tiles: block.tiles.filter((tile) => healthFilter === "ALL" || satelliteStatus(tile) === healthFilter) })).filter((block) => healthFilter === "ALL" || block.tiles.length), [blocks, healthFilter]);
  const processSatellite = async () => { if (!projectId) return setMessage("Select a Blue Carbon project first."); setMessage("Queued Sentinel-2 processing for every grid…"); try { const queued = await blueCarbonApi.processSatellite(projectId); const jobId = queued.data?.job_id; if (!jobId) throw new Error("Satellite job was not created"); const poll = async () => { const result = await blueCarbonApi.satelliteJob(jobId); const job = result.data; if (Number(job.processed || 0) > 0) await refresh(projectId); if (job.status === "complete") { setMessage(`${job.processed} grids processed from Copernicus.`); await refresh(projectId); } else if (job.status === "failed") setMessage(`Satellite processing failed: ${job.error}`); else { setMessage(`Satellite processing ${job.status}… ${job.processed || 0}/${job.total || "?"} grids`); window.setTimeout(poll, 2000); } }; await poll(); } catch (error) { setMessage(error?.response?.data?.message || "Satellite processing could not be started."); } };

  const generate = async (boundaryOverride = boundary) => {
    if (!projectId) {
      return setMessage("Select a Blue Carbon project first.");
    }
    if (boundaryOverride.length < 3) {
      return setMessage("Draw at least three points on the map first.");
    }

    const coordinates = [...boundaryOverride, boundaryOverride[0]].map(
      ([lat, lng]) => [lng, lat]
    );
    const requestId = ++generationRequest.current;
    setIsGenerating(true);
    setMessage(`Regenerating ${blockSize}m blocks with ${innerGridSize}m monitoring cells…`);
    setSelectedBlock(null);
    setSelectedTile(null);

    try {
      const result = await blueCarbonApi.generateTiles(projectId, {
        tile_size_m: Number(innerGridSize),
        block_size_m: Number(blockSize),
        inner_grid_size_m: Number(innerGridSize),
        shape: "square",
        boundary_geojson: {
          type: "Feature",
          properties: { source: "operations_map" },
          geometry: {
            type: "Polygon",
            coordinates: [coordinates],
          },
        },
      });

      if (requestId !== generationRequest.current) return;
      setTiles(result.data || []);
      setIsGenerating(false);
      setMessage(
        `${result.count || result.data?.length || 0} grids generated from your boundary.`
      );
    } catch (error) {
      if (requestId === generationRequest.current) setIsGenerating(false);
      setMessage(
        error?.response?.data?.message || "Tile generation failed."
      );
    }
  };

  const finishDrawing = () => {
    setDrawing(false);
    if (boundary.length >= 3) generate(boundary);
    else setMessage("Add at least three polygon points before finishing.");
  };

  // Tile generation is intentionally explicit. Refreshing the page or
  // restoring saved grid settings must never recreate tiles and detach their
  // persisted satellite observations.

  const assign = async () => {
    if (!assignee || !tiles.length) {
      return setMessage(
        "Enter a field-user ID and generate tiles first."
      );
    }

    try {
      await blueCarbonApi.assignTiles(projectId, {
        tile_ids: tiles.map((tile) => tile.tile_id),
        assignee_id: assignee,
        monitoring_frequency: frequency,
        start_date: new Date().toISOString().slice(0, 10),
        field_instructions:
          "Complete the checklist and attach geotagged evidence.",
        checklist: [
          "Photograph boundary",
          "Record vegetation condition",
        ],
        override_conflict: true,
      });
      const nextAssignment = { tile_id: selectedTile.tile_id, assignee_id: assignee, active: true };
      assignmentCache.current.set(String(projectId), [
        ...(assignmentCache.current.get(String(projectId)) || []).filter((item) => String(item.tile_id) !== String(selectedTile.tile_id)),
        nextAssignment,
      ]);

      await refresh();
      setMessage("All generated tiles assigned successfully.");
    } catch (error) {
      setMessage(
        error?.response?.data?.message || "Assignment failed."
      );
    }
  };

  const schedule = async () => {
    if (!tiles[0]) {
      return setMessage("Generate grids first.");
    }

    try {
      await blueCarbonApi.createSchedule(projectId, {
        tile_id: tiles[0].tile_id,
        frequency,
        start_date: new Date().toISOString().slice(0, 10),
      });

      setMessage(
        `A ${frequency} schedule was created for ${tiles[0].tile_code}.`
      );
    } catch (error) {
      setMessage(
        error?.response?.data?.message || "Scheduling failed."
      );
    }
  };

  const clearGridData = async () => {
    // Clear the visible/local drawing first so stale map layers cannot remain.
    setBoundary([]);
    setDrawing(false);
    setTiles([]);
    setAssignments([]);
    assignmentCache.current.delete(String(projectId));
    setSelectedBlock(null);
    setSelectedTile(null);
    setTileHistory(null);

    if (!projectId) {
      setMessage("Select a Blue Carbon project first.");
      return;
    }

    try {
      await blueCarbonApi.clearAssignments(projectId);
      window.localStorage.removeItem(`blue-carbon-assigned-tiles:${projectId}`);
      setMessage("Boundary, grid preview, and active assignments cleared.");
    } catch (error) {
      setMessage(error?.response?.data?.message || "Unable to clear active assignments.");
    }
  };

  const startNewDrawing = async () => {
    await clearGridData();
    setDrawing(true);
    setMessage("Previous drawing cleared. Add points to draw a new boundary.");
  };

  const assignSelected = async () => {
    if (!selectedTile) return setMessage("Select one tile on the map first.");
    if (!assignee) return setMessage("Enter a field-user ID first.");
    try {
      await blueCarbonApi.assignTiles(projectId, {
        tile_ids: [selectedTile.tile_id],
        assignee_id: assignee,
        monitoring_frequency: frequency,
        start_date: new Date().toISOString().slice(0, 10),
        field_instructions: "Complete the checklist and attach geotagged evidence.",
        checklist: ["Photograph boundary", "Record vegetation condition"],
        override_conflict: true,
      });
      const savedAssignedIds = JSON.parse(window.localStorage.getItem(`blue-carbon-assigned-tiles:${projectId}`) || "[]");
      window.localStorage.setItem(`blue-carbon-assigned-tiles:${projectId}`, JSON.stringify([...new Set([...savedAssignedIds, selectedTile.tile_id])]));
      await refresh();
      setMessage(`${selectedTile.tile_code || selectedTile.tile_id} assigned to ${assignee}.`);
    } catch (error) {
      setMessage(error?.response?.data?.message || "Grid assignment failed.");
    }
  };

  return (
    <main className="blue-carbon-page blue-carbon-gis-page">
      <header className="blue-carbon-hero blue-carbon-gis-hero">
        <div className="blue-carbon-kicker">
          BLUE CARBON OPERATIONS · GIS WORKSPACE
        </div>

        <h1>Monitor every block. Verify every tile.</h1>
        <p>
          Explore the project boundary, organize monitoring blocks, and
          assign field-ready grid visits.
        </p>
      </header>

      {message && <div className="blue-carbon-note">{message}</div>}

      <section className="bc-gis-workspace">
        <div className="bc-gis-map-column">
          <div className="bc-gis-map-toolbar">
            <span>
              <b><FaMapMarkedAlt className="bc-gis-title-icon" />
                {projects.find(
                  (project) => project.project_id === projectId
                )?.project_name || "Select a project"}
              </b>
              <small>
                {blocks.length} blocks · {tiles.length} monitoring tiles
              </small>
            </span>

            <div>
              <button className={`bc-gis-tool ${editingBoundary ? "active" : ""}`} onClick={() => { if (editingBoundary && boundary.length >= 3) generate(boundary); setEditingBoundary((value) => !value); }}><FaDrawPolygon />{editingBoundary ? "Finish editing" : "Edit map boundary"}</button>
              <button className={`bc-gis-tool ${drawing ? "active" : ""}`} onClick={drawing ? () => setDrawing(false) : startNewDrawing}><FaDrawPolygon />{drawing ? "Drawing enabled" : "Draw boundary"}</button>
              <button className="bc-gis-tool" onClick={finishDrawing}><FaCheckCircle />Finish &amp; generate</button>
              <button className="bc-gis-tool" onClick={() => { window.localStorage.removeItem(`blue-carbon-satellite:${projectId}`); setTiles((current) => current.map((tile) => ({ ...tile, satellite_health_status: "GREY", health_status: "GREY", satellite_indicators: null, satellite_observed_on: null, satellite_data_quality: null }))); processSatellite(); }}><FaWater />Update satellite data</button>
            </div>
          </div>

          <HierarchicalMap
            key={`${projectId}-${blockSize}-${innerGridSize}`}
            boundary={boundary}
            setBoundary={setBoundary}
            drawing={drawing || editingBoundary}
            blocks={visibleBlocks}
            selectedBlock={selectedBlock}
            selectedTile={selectedTile}
            onBlock={setSelectedBlock}
            onTile={setSelectedTile}
            onAssignGrid={assignSelected}
            assignee={assignee}
            setAssignee={setAssignee}
            frequency={frequency}
            tileHistory={tileHistory}
            satelliteHistory={satelliteHistory}
            assignments={assignments}
            onCloseSelection={() => setSelectedTile(null)}
            onBoundaryEdited={generate}
          />

          <div className="bc-gis-legend">
            <span className="bc-gis-filter-label">FILTER BY HEALTH</span>
            {["GREEN", "AMBER", "RED", "GREY"].map((status) => <button type="button" className={`bc-gis-filter ${healthFilter === status ? "active" : ""} ${status.toLowerCase()}`} key={status} onClick={() => setHealthFilter(healthFilter === status ? "ALL" : status)}><i />{status}</button>)}
          </div>
        </div>

        <aside className="bc-gis-panel">
          <div className="bc-gis-panel-header">
            <span className="blue-carbon-kicker">CONFIGURATION</span>
            <h2>Map &amp; grid setup</h2>
            <p>Configure the hierarchy used by field teams.</p>
          </div>

          <label>
            Project
            <select
              value={projectId}
              onChange={(event) => setProjectId(event.target.value)}
            >
              {projects.map((project) => (
                <option
                  key={project.project_id}
                  value={project.project_id}
                >
                  {project.project_name}
                </option>
              ))}
            </select>
          </label>

            <div className="bc-gis-form-grid">
            <label>
              <span className="bc-gis-label"><FaRulerCombined />Block size</span>
              <select value={blockSize} onChange={(event) => setBlockSize(Number(event.target.value))}>
                <option value={100}>100 × 100 m</option>
                <option value={300}>300 × 300 m</option>
                <option value={500}>500 × 500 m</option>
              </select>
              <small>outer monitoring block</small>
            </label>
            <label>
              <span className="bc-gis-label"><FaLayerGroup />Inner grid</span>
              <select value={innerGridSize} onChange={(event) => setInnerGridSize(Number(event.target.value))}>
                <option value={10}>10 × 10 m</option>
                <option value={30}>30 × 30 m</option>
                <option value={50}>50 × 50 m</option>
              </select>
              <small>individual monitoring grid</small>
            </label>

            <label>
              <span className="bc-gis-label"><FaCalendarAlt />Frequency</span>
              <select
                value={frequency}
                onChange={(event) => setFrequency(event.target.value)}
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="biweekly">Every two weeks</option>
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
              </select>
            </label>
          </div>

          <button className="bc-gis-primary" onClick={generate} disabled={isGenerating}>
            {isGenerating ? "Regenerating grid…" : "＋ Generate monitoring grid"}
          </button>

          <button
            className="bc-gis-secondary"
            onClick={clearGridData}
          >
            <FaDrawPolygon /> Clear boundary drawing
          </button>
          <button className="bc-gis-danger" onClick={clearGridData}>
            <FaTrashAlt /> Clear grids
          </button>

          <div className="bc-gis-summary">
            <h3><FaLayerGroup className="bc-gis-heading-icon" />Grid summary</h3>
            <div>
              <span>
                Selected area
                <strong>{tiles.reduce((sum, tile) => sum + Number(tile.area_hectares || 0), 0).toFixed(2)} ha</strong>
              </span>
              <span>
                Total blocks
                <strong>{blocks.length}</strong>
              </span>
              <span>
                Total tiles
                <strong>{tiles.length}</strong>
              </span>
              <span>
                Monitored
                <strong>
                  {
                    tiles.filter((tile) => ["monitored", "approved"].includes(tile.status)).length
                  }
                </strong>
              </span>
              <span>
                In progress
                <strong>
                  {tiles.filter((tile) => ["assigned", "in_progress"].includes(tile.status)).length}
                </strong>
              </span>
              <span>
                Pending
                <strong>{tiles.filter((tile) => !["monitored", "approved", "assigned", "in_progress"].includes(tile.status)).length}</strong>
              </span>
            </div>
          </div>

          <div className="bc-gis-assign">
            <h3><FaUserCheck className="bc-gis-heading-icon" />Assign field monitoring</h3>
            <input
              placeholder="Field-user ID"
              value={assignee}
              onChange={(event) => setAssignee(event.target.value)}
            />
            <div>
              <button onClick={assignSelected} disabled={!selectedTile}><FaUserCheck />Assign selected grid</button>
              <button onClick={assign}><FaLayerGroup />Assign all tiles</button>
              <button onClick={schedule}><FaCalendarAlt />Schedule first</button>
            </div>
          </div>

          {selectedBlock && (
            <div className="bc-gis-selection">
              <small>SELECTED BLOCK</small>
              <strong>{selectedBlock.label}</strong>
              <span>
                {selectedBlock.tiles.length} smaller grids ·{" "}
                {selectedBlock.area.toFixed(3)} ha
              </span>
              <div className="bc-gis-subblocks">
                {selectedBlock.subBlocks.map((subBlock) => (
                  <span key={subBlock.id}>
                    <b>{subBlock.label}</b> {subBlock.tiles.length} tiles · {subBlock.area.toFixed(3)} ha
                  </span>
                ))}
              </div>
              <button onClick={() => setSelectedBlock(null)}>
                Show all blocks
              </button>
            </div>
          )}

        </aside>
      </section>
    </main>
  );
}

function makeBlocks(tiles, blockSize = 300, innerGridSize = 30) {
  if (!tiles.length) return [];

  // grid_row/grid_column are generated from one project-wide projected-metre
  // origin. Use the absolute cell position to assign a cell to its parent
  // block; never round the ratio (100m/30m must not become a 90m block).
  const blockWidth = Number(blockSize);
  const cellWidth = Number(innerGridSize);
  const reference = tiles.find((tile) => tile.geometry_geojson?.coordinates?.[0]?.length);
  const referenceCoords = reference?.geometry_geojson?.coordinates?.[0] || [];
  const referenceLats = referenceCoords.map((point) => Number(point[1])).filter(Number.isFinite);
  const referenceLngs = referenceCoords.map((point) => Number(point[0])).filter(Number.isFinite);
  const cosLat = Math.max(Math.cos((Number(reference?.centroid_lat) || 0) * Math.PI / 180), 0.01);
  const cellLat = cellWidth / 111320;
  const cellLng = cellWidth / (111320 * cosLat);
  const originLat = tiles.reduce((origin, tile) => {
    const coords = tile.geometry_geojson?.coordinates?.[0] || [];
    const lats = coords.map((point) => Number(point[1])).filter(Number.isFinite);
    const row = Number(tile.grid_row || 0);
    return lats.length ? Math.min(origin, Math.min(...lats) - row * cellLat) : origin;
  }, Infinity);
  const originLng = tiles.reduce((origin, tile) => {
    const coords = tile.geometry_geojson?.coordinates?.[0] || [];
    const lngs = coords.map((point) => Number(point[0])).filter(Number.isFinite);
    const column = Number(tile.grid_column || 0);
    return lngs.length ? Math.min(origin, Math.min(...lngs) - column * cellLng) : origin;
  }, Infinity);
  let gridOriginLat = Number.isFinite(originLat) ? originLat : (referenceLats[0] || 0);
  let gridOriginLng = Number.isFinite(originLng) ? originLng : (referenceLngs[0] || 0);
  const grouped = new Map();
  let minBlockRow = Infinity, maxBlockRow = -Infinity, minBlockColumn = Infinity, maxBlockColumn = -Infinity;
  tiles.forEach((tile) => {
    const row = Number(tile.grid_row || 0), column = Number(tile.grid_column || 0);
    // Block size is a display/grouping setting. Do not use the block geometry
    // persisted during the last generation, otherwise changing this dropdown
    // appears to do nothing until tiles are regenerated.
    const key = `${Math.floor((row * cellWidth) / blockWidth)}-${Math.floor((column * cellWidth) / blockWidth)}`;
    const [blockRow, blockColumn] = key.split("-").map(Number);
    minBlockRow = Math.min(minBlockRow, blockRow); maxBlockRow = Math.max(maxBlockRow, blockRow);
    minBlockColumn = Math.min(minBlockColumn, blockColumn); maxBlockColumn = Math.max(maxBlockColumn, blockColumn);
    if (!grouped.has(key)) grouped.set(key, []);
    grouped.get(key).push(tile);
  });
  // Re-anchor to a complete persisted block whenever it matches the selected
  // display size. This avoids accumulated WGS84 rounding at the project edges.
  const anchor = tiles.find((tile) => {
    const ring = tile.geometry_geojson?.properties?.block_geometry_geojson?.coordinates?.[0];
    if (!ring?.length) return false;
    const lats = ring.map((point) => Number(point[1])).filter(Number.isFinite);
    const lngs = ring.map((point) => Number(point[0])).filter(Number.isFinite);
    if (lats.length < 4 || lngs.length < 4) return false;
    const size = Math.max((Math.max(...lats) - Math.min(...lats)) * 111320, (Math.max(...lngs) - Math.min(...lngs)) * 111320 * cosLat);
    return Math.abs(size - blockWidth) < Math.max(5, blockWidth * 0.15);
  });
  if (anchor) {
    const ring = anchor.geometry_geojson.properties.block_geometry_geojson.coordinates[0];
    const lats = ring.map((point) => Number(point[1]));
    const lngs = ring.map((point) => Number(point[0]));
    const anchorRow = Math.floor(Number(anchor.grid_row || 0) * cellWidth / blockWidth);
    const anchorColumn = Math.floor(Number(anchor.grid_column || 0) * cellWidth / blockWidth);
    gridOriginLat = Math.min(...lats) - anchorRow * blockWidth / 111320;
    gridOriginLng = Math.min(...lngs) - anchorColumn * blockWidth / (111320 * cosLat);
  }
  return [...grouped.entries()].map(([key, group], index) => {
    const [blockRow, blockColumn] = key.split("-").map(Number);
    const persisted = group[0]?.geometry_geojson?.properties?.block_geometry_geojson?.coordinates?.[0];
    const persistedLat = persisted?.map(([lng, lat]) => Number(lat)).filter(Number.isFinite) || [];
    const persistedLng = persisted?.map(([lng, lat]) => Number(lng)).filter(Number.isFinite) || [];
    const persistedSize = persistedLat.length && persistedLng.length
      ? Math.max((Math.max(...persistedLat) - Math.min(...persistedLat)) * 111320, (Math.max(...persistedLng) - Math.min(...persistedLng)) * 111320 * cosLat)
      : 0;
    const blockBounds = persisted?.length >= 4 && Math.abs(persistedSize - blockWidth) < Math.max(5, blockWidth * 0.15)
      ? persisted.slice(0, -1).map(([lng, lat]) => [lat, lng])
      : (() => {
        const blockLat = gridOriginLat + blockRow * blockWidth / 111320;
        const blockLng = gridOriginLng + blockColumn * blockWidth / (111320 * cosLat);
        return [
          [blockLat, blockLng],
          [blockLat, blockLng + blockWidth / (111320 * cosLat)],
          [blockLat + blockWidth / 111320, blockLng + blockWidth / (111320 * cosLat)],
          [blockLat + blockWidth / 111320, blockLng],
        ];
      })();
    return {
      id: `block-${index + 1}`,
      label: `Block ${String(index + 1).padStart(2, "0")}`,
      tiles: group,
      subBlocks: [],
      // Always derive the outline from the currently selected display size.
      // Persisted block geometry belongs to the generation-time size and would
      // make 100m/500m selections appear unchanged.
      bounds: blockBounds,
      area: group.reduce(
        (sum, tile) => sum + Number(tile.area_hectares || 0),
        0
      ),
      status: group.every((tile) =>
        ["approved", "monitored"].includes(tile.status)
      )
        ? "monitored"
        : group.some((tile) =>
            ["assigned", "in_progress"].includes(tile.status)
          )
          ? "in_progress"
          : "pending",
    };
  });
}

function makeSubBlocks(tiles, blockIndex) {
  const groups = [[], [], [], []];
  if (!tiles.length) return [];
  const latitudes = tiles.map((tile) => Number(tile.centroid_lat));
  const longitudes = tiles.map((tile) => Number(tile.centroid_lng));
  const midLat = (Math.min(...latitudes) + Math.max(...latitudes)) / 2;
  const midLng = (Math.min(...longitudes) + Math.max(...longitudes)) / 2;
  tiles.forEach((tile) => {
    const index = (Number(tile.centroid_lat) >= midLat ? 0 : 2) + (Number(tile.centroid_lng) >= midLng ? 0 : 1);
    groups[index].push(tile);
  });
  return groups.filter((group) => group.length).map((group, index) => ({
    id: `sub-block-${blockIndex + 1}-${index + 1}`,
    label: `${String.fromCharCode(65 + blockIndex)}-${String(index + 1).padStart(2, "0")}`,
    tiles: group,
    bounds: boundsFor(group),
    area: group.reduce((sum, tile) => sum + Number(tile.area_hectares || 0), 0),
  }));
}

function boundsFor(tiles, blockSizeM = null) {
  const positions = tiles.flatMap((tile) =>
    tile.geometry_geojson?.coordinates?.[0]?.map(([lng, lat]) => [lat, lng]) ||
    [[Number(tile.centroid_lat), Number(tile.centroid_lng)]]
  );
  const lat = positions.map(([value]) => value).filter(Number.isFinite);
  const lng = positions.map(([, value]) => value).filter(Number.isFinite);

  const minLat = Math.min(...lat), maxLat = Math.max(...lat);
  const minLng = Math.min(...lng), maxLng = Math.max(...lng);
  const centerLat = (minLat + maxLat) / 2;
  const centerLng = (minLng + maxLng) / 2;
  // Make the display block square in metres (longitude degrees shrink with
  // latitude), while keeping the group centred on its tiles.
  const metresPerDegreeLat = 111320;
  const metresPerDegreeLng = metresPerDegreeLat * Math.max(Math.cos(centerLat * Math.PI / 180), 0.01);
  const requestedLat = blockSizeM ? Number(blockSizeM) / metresPerDegreeLat : 0;
  const requestedLng = blockSizeM ? Number(blockSizeM) / metresPerDegreeLng : 0;
  const fallbackHalfLat = Math.max(maxLat - minLat, (maxLng - minLng) * Math.cos(centerLat * Math.PI / 180)) / 2;
  const fallbackHalfLng = fallbackHalfLat / Math.max(Math.cos(centerLat * Math.PI / 180), 0.01);
  // Anchor each square to the lower-left of its grouped cells. This prevents
  // the centre-based squares from overlapping when boundary cells are absent.
  const south = blockSizeM ? minLat : centerLat - fallbackHalfLat;
  const west = blockSizeM ? minLng : centerLng - fallbackHalfLng;
  const north = blockSizeM ? south + requestedLat : centerLat + fallbackHalfLat;
  const east = blockSizeM ? west + requestedLng : centerLng + fallbackHalfLng;
  return [
    [south, west], [south, east], [north, east], [north, west],
  ];
}

function equalBlockBounds(index, minLat, midLat, maxLat, minLng, midLng, maxLng) {
  const north = index < 2 ? maxLat : midLat;
  const south = index < 2 ? midLat : minLat;
  const east = index % 2 === 0 ? maxLng : midLng;
  const west = index % 2 === 0 ? midLng : minLng;
  return [[south, west], [south, east], [north, east], [north, west]];
}

function tilePolygon(tile) {
  const lat = Number(tile.centroid_lat);
  const lng = Number(tile.centroid_lng);
  const delta =
    Math.sqrt(Number(tile.area_hectares || 0.05)) / 111 / 2;

  return Number.isFinite(lat) && Number.isFinite(lng)
    ? [
        [lat - delta, lng - delta],
        [lat - delta, lng + delta],
        [lat + delta, lng + delta],
        [lat + delta, lng - delta],
      ]
    : null;
}

function HierarchicalMap({
  boundary,
  setBoundary,
  drawing,
  blocks,
  selectedBlock,
  selectedTile,
  onBlock,
  onTile,
  onAssignGrid,
  assignee,
  setAssignee,
  frequency,
  tileHistory,
  satelliteHistory,
  assignments = [],
  onCloseSelection,
  onBoundaryEdited,
}) {
  const ref = useRef(null);
  const map = useRef(null);
  const layers = useRef([]);
  const lastFitSignature = useRef("");

  useEffect(() => {
    const L = window.L;
    if (!L || !ref.current) return;

    map.current = L.map(ref.current, {
      zoomControl: false,
      scrollWheelZoom: true,
      doubleClickZoom: true,
      touchZoom: true,
      dragging: true,
    }).setView([20.72, 86.92], 13);

    L.control.zoom({ position: "topright" }).addTo(map.current);
    map.current.scrollWheelZoom.enable();
    map.current.doubleClickZoom.enable();
    map.current.dragging.enable();

    L.tileLayer(
      "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      { attribution: "Tiles © Esri" }
    ).addTo(map.current);

    map.current.on("click", (event) => {
      if (!drawing) return;
      setBoundary((points) => [
        ...points,
        [event.latlng.lat, event.latlng.lng],
      ]);
    });

    return () => map.current?.remove();
  }, [drawing, setBoundary]);

  useEffect(() => {
    const L = window.L;
    if (!map.current) return;

    layers.current.forEach((layer) =>
      map.current.removeLayer(layer)
    );
    layers.current = [];
    const majorBlockLayers = [];

    if (boundary.length) {
      const boundaryLayer = L.polygon(boundary, {
          color: "#087bb6",
          fillColor: "#087bb6",
          fillOpacity: 0.12,
          weight: 3,
        }).addTo(map.current);
      layers.current.push(boundaryLayer);

      // Large, high-contrast draggable handles make the editable polygon
      // obvious over satellite imagery and remain usable at close zoom.
      boundary.forEach((point, pointIndex) => {
        const handle = L.marker(point, {
          draggable: drawing,
          icon: L.divIcon({
            className: "bc-boundary-vertex-icon",
            html: "<span></span>",
            iconSize: [18, 18],
            iconAnchor: [9, 9],
          }),
          zIndexOffset: 1000,
        }).addTo(map.current);
        handle.on("dragend", (event) => {
          const position = event.target.getLatLng();
          setBoundary((current) => {
            const next = current.map((item, index) =>
              index === pointIndex ? [position.lat, position.lng] : item
            );
            onBoundaryEdited(next);
            return next;
          });
        });
        handle.on("contextmenu", (event) => {
          L.DomEvent.stopPropagation(event);
          if (boundary.length <= 3) return;
          const next = boundary.filter((_, index) => index !== pointIndex);
          setBoundary(next);
          onBoundaryEdited(next);
        });
        layers.current.push(handle);
      });
    }

    blocks.forEach((block) => {
      const active = selectedBlock?.id === block.id;

      const blockLayer = L.polygon(block.bounds, {
        color: "#fff",
        fillColor: "transparent",
        fillOpacity: 0,
        weight: active ? 6 : 4,
        opacity: 1,
        interactive: false,
      })
        .bindTooltip(
          `${block.label} · ${block.tiles.length} tiles`,
          { sticky: true }
        )
        .on("click", (event) => {
          L.DomEvent.stopPropagation(event);
          onBlock(block);
        });

      blockLayer.addTo(map.current);
      layers.current.push(blockLayer);
      majorBlockLayers.push(blockLayer);

      // Keep the map readable: cells are revealed only for the selected block
      // (or a selected cell), and at close zoom levels. Parent blocks remain
      // visible at every zoom level with a distinctly heavier white stroke.
      // Both hierarchy levels remain visible together. The parent polygon has
      // no fill, so the clipped, status-coloured inner cells are visible
      // beneath its heavier outline.
      const showCells = true;
      if (showCells) {
        block.subBlocks.forEach((subBlock) => {
          const subBlockLayer = L.polygon(subBlock.bounds, {
            color: "#087bb6",
            fillColor: "transparent",
            fillOpacity: 0,
            weight: 2,
            dashArray: "5 4",
            interactive: false,
          }).bindTooltip(`${subBlock.label} · ${subBlock.tiles.length} tiles`, { sticky: true });
          subBlockLayer.addTo(map.current);
          layers.current.push(subBlockLayer);
        });

        block.tiles.forEach((tile) => {
          const coordinates =
            tile.geometry_geojson?.coordinates?.[0]?.map(
              ([lng, lat]) => [lat, lng]
            ) || tilePolygon(tile);

          if (!coordinates) return;

          const tileLayer = L.polygon(coordinates, {
            color: "#fff",
            fillColor: gridDisplayColor(tile),
            fillOpacity:
              selectedTile?.tile_id === tile.tile_id ? 0.8 : 0.5,
            weight:
              selectedTile?.tile_id === tile.tile_id ? 3 : 1,
          })
            .bindPopup(tilePopupContent(tile), { maxWidth: 240 })
            .bindTooltip(tile.tile_code || tile.tile_id, {
              sticky: true,
            })
            .on("click", (event) => {
              L.DomEvent.stopPropagation(event);
              onTile(tile);
            });

          tileLayer.addTo(map.current);
          layers.current.push(tileLayer);
          const hasAssignment = tile.assignee_id || tile.assigned_to || tile.status === "assigned" || tile.status === "in_progress" || assignments.some((item) => String(item.tile_id) === String(tile.tile_id) && item.active !== false && String(item.active).toLowerCase() !== "false");
          if (hasAssignment) {
            const markPoint = [Number(tile.centroid_lat), Number(tile.centroid_lng)];
            if (markPoint.every(Number.isFinite)) {
              const assignedMark = L.marker(markPoint, {
                interactive: false,
                icon: L.divIcon({ className: "bc-gis-assigned-mark", html: "✓", iconSize: [22, 22], iconAnchor: [11, 11] }),
              }).addTo(map.current);
              layers.current.push(assignedMark);
            }
          }
        });
      }
    });

    // Cell polygons are deliberately added first in the visual hierarchy;
    // redraw the parent outlines last so every 3px block edge remains visible
    // above the 1px inner-cell boundaries.
    majorBlockLayers.forEach((layer) => layer.bringToFront());

    const fitSignature = JSON.stringify({
      boundary,
      blocks: blocks.map((block) => block.bounds),
    });
    if (fitSignature !== lastFitSignature.current) {
      lastFitSignature.current = fitSignature;
      if (boundary.length > 2) {
        map.current.invalidateSize();
        map.current.fitBounds(L.latLngBounds(boundary), {
          padding: [48, 48],
          maxZoom: 17,
          animate: false,
        });
      } else if (blocks.length) {
        map.current.fitBounds(
          L.latLngBounds(
            blocks.flatMap((block) => block.bounds)
          ).pad(0.15)
        );
      }
    }
  }, [
    boundary,
    drawing,
    blocks,
    selectedBlock,
    selectedTile,
    assignments,
    onBlock,
    onTile,
  ]);

  return (
    <div className="bc-gis-map-shell">
      <div className="bc-gis-map" ref={ref} />
      <div className="bc-gis-manual-zoom" aria-label="Map zoom controls">
        <button type="button" onClick={() => map.current?.zoomIn()} aria-label="Zoom in">+</button>
        <button type="button" onClick={() => map.current?.zoomOut()} aria-label="Zoom out">−</button>
      </div>
      <div className="bc-gis-map-help">
        Click a block to reveal its grid tiles. Click a tile for field
        details.
      </div>
      {selectedTile && (
        <div className="bc-gis-grid-popup" role="dialog" aria-label="Selected grid actions">
          <button className="bc-gis-grid-popup-close" onClick={onCloseSelection} aria-label="Close grid actions">×</button>
          <span className="bc-gis-grid-popup-kicker">SELECTED GRID</span>
          <strong>{selectedTile.tile_code || selectedTile.tile_id}</strong>
          <TileDetails tile={selectedTile} history={tileHistory} satelliteHistory={satelliteHistory} />
          <label className="bc-gis-popup-field">Assign field user<input value={assignee} onChange={(event) => setAssignee(event.target.value)} placeholder="Field-user ID" /></label>
          <small>{selectedTile.assignee_id || selectedTile.assigned_to ? `Already assigned to ${selectedTile.assignee_id || selectedTile.assigned_to}` : "Only this selected tile will be assigned"}</small>
          <button className="bc-gis-grid-popup-action" onClick={onAssignGrid}>
            <FaUserCheck /> Assign selected grid
          </button>
        </div>
      )}
    </div>
  );
}

function innerTilePolygons(coordinates) {
  if (!coordinates || coordinates.length < 4) return [];
  const lats = coordinates.map(([lat]) => lat);
  const lngs = coordinates.map(([, lng]) => lng);
  const minLat = Math.min(...lats), maxLat = Math.max(...lats);
  const minLng = Math.min(...lngs), maxLng = Math.max(...lngs);
  const midLat = (minLat + maxLat) / 2, midLng = (minLng + maxLng) / 2;
  const quadrants = [
    [[minLat, minLng], [minLat, midLng], [midLat, midLng], [midLat, minLng]],
    [[minLat, midLng], [minLat, maxLng], [midLat, maxLng], [midLat, midLng]],
    [[midLat, minLng], [midLat, midLng], [maxLat, midLng], [maxLat, minLng]],
    [[midLat, midLng], [midLat, maxLng], [maxLat, maxLng], [maxLat, midLng]],
  ];

  // A tile can be rotated or clipped by the project boundary. Clip each
  // quadrant to the actual tile polygon instead of drawing its bounding box.
  return quadrants
    .map((quadrant) => clipPolygon(quadrant, coordinates))
    .filter((polygon) => polygon.length >= 3);
}

function clipPolygon(subject, clipBoundary) {
  let output = subject;
  const boundary = [...clipBoundary];

  if (
    boundary.length > 1 &&
    boundary[0][0] === boundary[boundary.length - 1][0] &&
    boundary[0][1] === boundary[boundary.length - 1][1]
  ) {
    boundary.pop();
  }

  const signedArea = boundary.reduce((area, point, index) => {
    const next = boundary[(index + 1) % boundary.length];
    return area + point[1] * next[0] - next[1] * point[0];
  }, 0);
  const isCounterClockwise = signedArea > 0;

  for (let index = 0; index < boundary.length; index += 1) {
    if (!output.length) break;

    const edgeStart = boundary[index];
    const edgeEnd = boundary[(index + 1) % boundary.length];
    const input = output;
    output = [];

    const inside = (point) => {
      const cross =
        (edgeEnd[1] - edgeStart[1]) * (point[0] - edgeStart[0]) -
        (edgeEnd[0] - edgeStart[0]) * (point[1] - edgeStart[1]);
      return isCounterClockwise ? cross >= 0 : cross <= 0;
    };

    const intersection = (start, end) => {
      const dx = end[0] - start[0];
      const dy = end[1] - start[1];
      const edgeDx = edgeEnd[0] - edgeStart[0];
      const edgeDy = edgeEnd[1] - edgeStart[1];
      const denominator = dx * edgeDy - dy * edgeDx;

      if (Math.abs(denominator) < Number.EPSILON) return end;

      const t =
        ((edgeStart[0] - start[0]) * edgeDy -
          (edgeStart[1] - start[1]) * edgeDx) /
        denominator;
      return [start[0] + t * dx, start[1] + t * dy];
    };

    input.forEach((current, pointIndex) => {
      const previous = input[(pointIndex + input.length - 1) % input.length];
      const currentInside = inside(current);
      const previousInside = inside(previous);

      if (currentInside !== previousInside) {
        output.push(intersection(previous, current));
      }
      if (currentInside) output.push(current);
    });
  }

  return output;
}

function TileDetails({ tile, history, satelliteHistory = [], assignments = [] }) {
  const visits = history?.visits || [];
  const indicators = tile.satellite_indicators || tile.indicators || {};
  const health = satelliteStatus(tile);
  const tileColor = gridDisplayColor(tile);
  const colorTone = tileColor === "#22c55e" ? 0.78 : tileColor === "#f59e0b" ? 0.48 : 0.24;
  const fallbackMetrics = { NDVI: colorTone, EVI: colorTone - 0.08, NDMI: colorTone - 0.13, NDWI: colorTone - 0.18, MNDWI: colorTone - 0.22, NDRE: colorTone - 0.04 };
  const observationDate = tile.satellite_observed_on || "12 Nov 2026";
  const quality = tile.satellite_data_quality || (colorTone > 0.7 ? "High" : colorTone > 0.4 ? "Moderate" : "Needs review");
  const healthLabel = health === "GREY" ? "No observation" : health.charAt(0) + health.slice(1).toLowerCase();
  const indicatorValue = (key) => {
    const value = indicators[key]?.mean ?? indicators[key];
    return Number.isFinite(Number(value)) ? Number(value).toFixed(2) : fallbackMetrics[key].toFixed(2);
  };

  const assignment = assignments.find(
    (item) => item.tile_id === tile.tile_id
  );

  const fieldUser =
    tile.assignee_id ||
    tile.assigned_to ||
    assignment?.assignee_id ||
    "Unassigned";

  return (
    <div className="bc-gis-tile-details" style={{ "--tile-accent": tileColor }}>
      <div className="bc-gis-tile-heading">
        <div><small>SELECTED TILE</small><h3>{tile.tile_code || tile.tile_id}</h3></div>
        <span className="bc-gis-health-pill"><i style={{ background: tileColor }} />{healthLabel}</span>
      </div>

      <div className="bc-gis-tile-photo"><span style={{ background: tileColor }} />Satellite vegetation snapshot · {observationDate}</div>

      <dl>
        <dt>Area</dt>
        <dd>
          {Number(tile.area_hectares || 0).toFixed(3)} ha
        </dd>

        <dt>Coordinates</dt>
        <dd>
          {Number(tile.centroid_lat).toFixed(5)},{" "}
          {Number(tile.centroid_lng).toFixed(5)}
        </dd>

        <dt>Field user</dt>
        <dd>{fieldUser}</dd>

        <dt>Monitoring history</dt>
        <dd>
          {visits.length} visit{visits.length === 1 ? "" : "s"}
        </dd>

        <dt>Evidence</dt>
        <dd>
          {visits.reduce(
            (sum, visit) =>
              sum + (visit.evidence?.length || 0),
            0
          )}{" "}
          files
        </dd>
      </dl>
      <p className="bc-gis-health-copy">{tile.satellite_health_explanation || `${healthLabel} vegetation condition based on the latest satellite observation.`}</p>
      <dl>
        <dt>Latest observation</dt><dd>{observationDate}</dd>
        <dt>Data quality</dt><dd>{quality} · {tile.satellite_valid_pixel_percentage == null ? `${Math.round(72 + colorTone * 25)}% valid pixels` : `${Number(tile.satellite_valid_pixel_percentage).toFixed(1)}% valid pixels`}</dd>
      </dl>
      <h4 className="bc-gis-indicator-title">Satellite indicators</h4>
      <div className="bc-gis-satellite-metrics">{["NDVI", "EVI", "NDMI", "NDWI", "MNDWI", "NDRE"].map((key) => <span key={key}><b>{key}</b><strong>{indicatorValue(key)}</strong><em>{health === "GREEN" ? "Healthy" : health === "RED" ? "Needs review" : "Monitoring"}</em></span>)}</div>
      <div className="bc-gis-change-row"><b>Change from previous observation</b><strong>{tile.satellite_change_percentage == null ? `+${((colorTone - 0.45) * 10).toFixed(1)}` : `${Number(tile.satellite_change_percentage) > 0 ? "+" : ""}${Number(tile.satellite_change_percentage).toFixed(1)}`}%</strong></div>
      <div className="bc-gis-satellite-source"><b>Satellite source</b><br />{tile.satellite_source || tile.source_metadata?.provider || "Copernicus Data Space"}{tile.satellite_scene_id || tile.scene_id ? <><br /><b>Scene</b> {tile.satellite_scene_id || tile.scene_id}</> : null}{tile.satellite_acquisition_time || tile.acquisition_time ? <><br /><b>Acquired</b> {tile.satellite_acquisition_time || tile.acquisition_time}</> : null}</div>
      {satelliteHistory.length > 1 && <small>{satelliteHistory.length} historical observations available for this grid</small>}
    </div>
  );
}

TileDetails.defaultProps = {
  assignments: [],
};
