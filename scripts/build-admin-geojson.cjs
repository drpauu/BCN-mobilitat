const fs = require("node:fs");
const path = require("node:path");
const proj4 = require("proj4");

const SRC_PROJ = "EPSG:25831";
const DST_PROJ = "EPSG:4326";

proj4.defs(
  SRC_PROJ,
  "+proj=utm +zone=31 +ellps=GRS80 +units=m +no_defs +type=crs"
);

const rootDir = path.resolve(__dirname, "..");
const polygonsPath = path.join(rootDir, "0301100100_UNITATS_ADM_POLIGONS.json");
const pointsPath = path.join(rootDir, "0301100100_UNITATS_ADM_PUNTS.json");
const outDir = path.join(rootDir, "public", "data");

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function transformPoint(coord) {
  const [x, y] = coord;
  const [lng, lat] = proj4(SRC_PROJ, DST_PROJ, [x, y]);
  return [Number(lng.toFixed(6)), Number(lat.toFixed(6))];
}

function transformCoordinates(coords, depth = 0) {
  if (!Array.isArray(coords)) return coords;
  if (typeof coords[0] === "number") return transformPoint(coords);
  return coords.map((part) => transformCoordinates(part, depth + 1));
}

function transformFeature(feature) {
  return {
    type: "Feature",
    id: feature.id,
    properties: feature.properties,
    geometry: {
      type: feature.geometry.type,
      coordinates: transformCoordinates(feature.geometry.coordinates),
    },
  };
}

function uniqueByName(features) {
  const seen = new Set();
  return features.filter((feature) => {
    const name = feature.properties?.NOM;
    if (!name) return false;
    if (seen.has(name)) return false;
    seen.add(name);
    return true;
  });
}

function buildFiles() {
  const polygonsRaw = readJson(polygonsPath);
  const pointsRaw = readJson(pointsPath);

  const polygonsFiltered = polygonsRaw.features.filter((feature) =>
    ["TERME", "DISTRICTE", "BARRI"].includes(feature.properties?.TIPUS_UA)
  );

  const labelsFiltered = uniqueByName(
    pointsRaw.features.filter((feature) => feature.properties?.TIPUS_UA === "DISTRICTE")
  );

  const polygonsWgs84 = {
    type: "FeatureCollection",
    features: polygonsFiltered.map(transformFeature),
  };

  const labelsWgs84 = {
    type: "FeatureCollection",
    features: labelsFiltered.map(transformFeature),
  };

  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(
    path.join(outDir, "bcn-admin-polygons.geojson"),
    JSON.stringify(polygonsWgs84)
  );
  fs.writeFileSync(
    path.join(outDir, "bcn-admin-district-labels.geojson"),
    JSON.stringify(labelsWgs84)
  );

  console.log("Generated admin layers:");
  console.log(`- polygons: ${polygonsWgs84.features.length}`);
  console.log(`- district labels: ${labelsWgs84.features.length}`);
}

buildFiles();
