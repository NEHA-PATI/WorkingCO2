import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Link } from "react-router-dom";

import { blueCarbonApi } from "@features/org/services/blueCarbonApi";
import "@features/org/styles/BlueCarbon.css";
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

function gridDisplayColor(tile) {
  const key = String(tile.tile_id || tile.tile_code || "grid");
  let hash = 0;
  for (let index = 0; index < key.length; index += 1) {
    hash = (hash * 31 + key.charCodeAt(index)) | 0;
  }
  return gridPalette[Math.abs(hash) % gridPalette.length];
}

export default function BlueCarbonOperations() {
  const [projects, setProjects] = useState([]);
  const [projectId, setProjectId] = useState("");
  const [tiles, setTiles] = useState([]);
  const [assignments, setAssignments] = useState([]);

  const [boundary, setBoundary] = useState([]);
  const [drawing, setDrawing] = useState(false);
  const [assignee, setAssignee] = useState("");
  const [blockSize, setBlockSize] = useState(300);
  const [innerGridSize, setInnerGridSize] = useState(30);
  const [frequency, setFrequency] = useState("monthly");

  const [message, setMessage] = useState("");
  const [selectedBlock, setSelectedBlock] = useState(null);
  const [selectedTile, setSelectedTile] = useState(null);
  const [tileHistory, setTileHistory] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const generationRequest = useRef(0);

  const refresh = async (id = projectId) => {
    if (!id) return;

    try {
      const [tileResult, assignmentResult] = await Promise.all([
        blueCarbonApi.tiles(id),
        blueCarbonApi.assignments(id),
      ]);

      const rows = tileResult.data || [];
      const activeAssignments = assignmentResult.data || [];

      setAssignments(activeAssignments);
      setTiles(
        rows.map((tile) => {
          const activeAssignment = activeAssignments.find(
            (item) => item.tile_id === tile.tile_id && item.active !== false
          );
          return {
            ...tile,
            assignee_id: tile.assignee_id || activeAssignment?.assignee_id,
            status: activeAssignment ? "assigned" : tile.status,
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
    refresh();
    setSelectedBlock(null);
    setSelectedTile(null);
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
  }, [selectedTile]);

  const blocks = useMemo(() => makeBlocks(tiles, blockSize, innerGridSize), [tiles, blockSize, innerGridSize]);

  const generate = async (boundaryOverride = boundary) => {
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

  useEffect(() => {
    if (boundary.length >= 3 && projectId) generate();
    // Size selectors are intentionally live: changing either one regenerates
    // the clipped projected grid immediately.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blockSize, innerGridSize]);

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
    setSelectedBlock(null);
    setSelectedTile(null);
    setTileHistory(null);

    try {
      await blueCarbonApi.clearAssignments(projectId);
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
        <div className="bc-end-user-entry">
          <button type="button" className="bc-end-user-button">
            <FaUserCheck /> End User workspace
          </button>
          <div className="bc-end-user-options">
            <Link to="/field/dashboard"><FaMapMarkedAlt /> My monitoring tasks</Link>
            <Link to="/field/dashboard"><FaCheckCircle /> Start or submit a field visit</Link>
            <Link to="/profile"><FaUserCheck /> My profile</Link>
          </div>
        </div>
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
              <button className={`bc-gis-tool ${drawing ? "active" : ""}`} onClick={drawing ? () => setDrawing(false) : startNewDrawing}><FaDrawPolygon />{drawing ? "Drawing enabled" : "Draw boundary"}</button>
              <button className="bc-gis-tool" onClick={finishDrawing}><FaCheckCircle />Finish &amp; generate</button>
              <button className="bc-gis-tool bc-gis-clear-tool" onClick={clearGridData}><FaTrashAlt />Clear drawing</button>
            </div>
          </div>

          <HierarchicalMap
            boundary={boundary}
            setBoundary={setBoundary}
            drawing={drawing}
            blocks={blocks}
            selectedBlock={selectedBlock}
            selectedTile={selectedTile}
            onBlock={setSelectedBlock}
            onTile={setSelectedTile}
            onAssignGrid={assignSelected}
            onCloseSelection={() => setSelectedTile(null)}
            onBoundaryEdited={generate}
          />

          <div className="bc-gis-legend">
            <span><FaWater className="bc-gis-stat-icon water" />
              <i style={{ background: statusColor.monitored }} />
              Monitored
            </span>
            <span><FaLayerGroup className="bc-gis-stat-icon layers" />
              <i style={{ background: statusColor.pending }} />
              Pending
            </span>
            <span><FaUserCheck className="bc-gis-stat-icon users" />
              <i style={{ background: statusColor.in_progress }} />
              In progress
            </span>
            <span><FaInfoCircle className="bc-gis-stat-icon info" />
              <i style={{ background: statusColor.unassigned }} />
              Unassigned
            </span>
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

          {selectedTile && (
            <TileDetails tile={selectedTile} history={tileHistory} />
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
  const grouped = new Map();
  tiles.forEach((tile) => {
    const row = Number(tile.grid_row || 0), column = Number(tile.grid_column || 0);
    const key = tile.geometry_geojson?.properties?.block_geometry_geojson
      ? `${tile.geometry_geojson.properties.block_geometry_geojson.coordinates[0][0][0]}-${tile.geometry_geojson.properties.block_geometry_geojson.coordinates[0][0][1]}`
      : `${Math.floor((row * cellWidth) / blockWidth)}-${Math.floor((column * cellWidth) / blockWidth)}`;
    if (!grouped.has(key)) grouped.set(key, []);
    grouped.get(key).push(tile);
  });
  return [...grouped.values()].map((group, index) => ({
      id: `block-${index + 1}`,
      label: `Block ${String(index + 1).padStart(2, "0")}`,
      tiles: group,
      subBlocks: [],
      bounds: group[0].geometry_geojson?.properties?.block_geometry_geojson?.coordinates?.[0]?.map(([lng, lat]) => [lat, lng]) || boundsFor(group),
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
    }));
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

function boundsFor(tiles) {
  const positions = tiles.flatMap((tile) =>
    tile.geometry_geojson?.coordinates?.[0]?.map(([lng, lat]) => [lat, lng]) ||
    [[Number(tile.centroid_lat), Number(tile.centroid_lng)]]
  );
  const lat = positions.map(([value]) => value).filter(Number.isFinite);
  const lng = positions.map(([, value]) => value).filter(Number.isFinite);

  return [
    [Math.min(...lat), Math.min(...lng)],
    [Math.min(...lat), Math.max(...lng)],
    [Math.max(...lat), Math.max(...lng)],
    [Math.max(...lat), Math.min(...lng)],
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
  onCloseSelection,
  onBoundaryEdited,
}) {
  const ref = useRef(null);
  const map = useRef(null);
  const layers = useRef([]);

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
            .bindTooltip(tile.tile_code || tile.tile_id, {
              sticky: true,
            })
            .on("click", (event) => {
              L.DomEvent.stopPropagation(event);
              onTile(tile);
            });

          tileLayer.addTo(map.current);
          layers.current.push(tileLayer);
        });
      }
    });

    // Cell polygons are deliberately added first in the visual hierarchy;
    // redraw the parent outlines last so every 3px block edge remains visible
    // above the 1px inner-cell boundaries.
    majorBlockLayers.forEach((layer) => layer.bringToFront());

    if (boundary.length > 2) {
      map.current.fitBounds(L.latLngBounds(boundary).pad(0.15));
    } else if (blocks.length) {
      map.current.fitBounds(
        L.latLngBounds(
          blocks.flatMap((block) => block.bounds)
        ).pad(0.15)
      );
    }
  }, [
    boundary,
    drawing,
    blocks,
    selectedBlock,
    selectedTile,
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
          <small>Only this selected tile will be assigned</small>
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

function TileDetails({ tile, history, assignments = [] }) {
  const visits = history?.visits || [];

  const assignment = assignments.find(
    (item) => item.tile_id === tile.tile_id
  );

  const fieldUser =
    tile.assignee_id ||
    tile.assigned_to ||
    assignment?.assignee_id ||
    "Unassigned";

  return (
    <div className="bc-gis-tile-details">
      <small>SELECTED TILE</small>
      <h3>{tile.tile_code || tile.tile_id}</h3>

      <span
        className="bc-gis-status"
        style={{
          color: statusColor[tile.status] || statusColor.unassigned,
        }}
      >
        {statusLabel(tile.status)}
      </span>

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
    </div>
  );
}

TileDetails.defaultProps = {
  assignments: [],
};
