import toGeoJSON from "togeojson";
import { DOMParser } from "@xmldom/xmldom";

const parseKML = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const kmlString = e.target.result;
      const kmlDom = new DOMParser().parseFromString(kmlString, "text/xml");
      const geoJson = toGeoJSON.kml(kmlDom);
      resolve(geoJson);
    };
    reader.onerror = (error) => reject(error);
    reader.readAsText(file);
  });
};

export default parseKML;