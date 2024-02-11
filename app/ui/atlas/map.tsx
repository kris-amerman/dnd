'use client'
import { useEffect, useRef } from 'react';
import 'leaflet/dist/leaflet.css';
import L, { LatLng } from 'leaflet';
import { LatLngBoundsExpression } from 'leaflet';
import { geoJSON } from 'leaflet';
import { LatLngTuple } from 'leaflet';


const Map = () => {
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current) {
      // Center of the map 
      const latitude = 40.725374205068128;
      const longitude = -73.960974979866151;

      // Zoom level
      const zoomLevel = 15;

      // Bounds of the image
      const south = 40.7000;
      const west = -74.0200;
      const north = 40.7300;
      const east = -73.9800;


      // Image dimensions
      const imageWidth = 4096;
      const imageHeight = 1969;

      // Calculate aspect ratio
      const aspectRatio = imageWidth / imageHeight;

      // Calculate overlay size to maintain aspect ratio
      const overlayWidth = 0.1; // Adjust this value based on your preference
      const overlayHeight = overlayWidth / aspectRatio;

      // Example map image
      const imageUrl = '/map.jpg';

      // Calculate the new bounds to maintain aspect ratio
      const boundsWidth = overlayWidth / 2; // Adjust this value based on your preference
      const boundsHeight = boundsWidth / aspectRatio;
      const newImageBounds = L.latLngBounds(
        L.latLng(south + (overlayHeight - boundsHeight) / 2, west + (overlayWidth - boundsWidth) / 2),
        L.latLng(south + (overlayHeight + boundsHeight) / 2, west + (overlayWidth + boundsWidth) / 2)
      );

      // Create the map instance
      const map = L.map('map', {
        center: [latitude, longitude],
        zoom: zoomLevel,
        maxBounds: newImageBounds, // Set maxBounds to the bounds of the image 
      });

      L.imageOverlay(imageUrl, newImageBounds, { interactive: true })
        .addTo(map)
        .setBounds(newImageBounds);

      // const polygon = L.polygon([
      //   [40.73606, -73.9950],
      //   [40.73606, -73.9950],
      //   [40.73606, -73.9950],
      //   [40.73606, -73.9950]
      // ], {color: 'red'}).addTo(map);

      const latlns: LatLngTuple[] = [[-73.960974979866151, 40.725374205068128], [-73.960806889354146, 40.725368201835558], [-73.960758863493581, 40.725386211533277], [-73.960722844098143, 40.725362198602987], [-73.960548750353567, 40.725380208300699], [-73.960506727725559, 40.725398217998418], [-73.960476711562706, 40.725380208300699], [-73.960362650143836, 40.725392214765847], [-73.960314624283271, 40.725422230928707], [-73.960290611352974, 40.725422230928707], [-73.960260595190121, 40.725404221230988], [-73.960206566096971, 40.72541622769613], [-73.96013452730611, 40.725380208300699], [-73.960116517608398, 40.725356195370416], [-73.960026469119825, 40.725362198602987], [-73.959972440026675, 40.725260143649265], [-73.959996452956972, 40.725248137184124], [-73.960020465887254, 40.725206114556123], [-73.960074494980404, 40.725188104858404], [-73.960080498212974, 40.72503802404411], [-73.960206566096971, 40.725014011113828], [-73.960218572562127, 40.724996001416109], [-73.960296614585559, 40.724947975555537], [-73.960338637213553, 40.724935969090396], [-73.960356646911265, 40.724977991718397], [-73.960440692167268, 40.724977991718397], [-73.960470708330135, 40.724935969090396], [-73.960506727725559, 40.724947975555537], [-73.96063279560957, 40.724863930299534], [-73.960644802074711, 40.724887943229824], [-73.960746857028425, 40.724941972322966], [-73.960806889354146, 40.724941972322966], [-73.960806889354146, 40.724971988485827], [-73.960860918447295, 40.724971988485827], [-73.960866921679866, 40.725014011113828], [-73.960836905517013, 40.72509205313726], [-73.960896937842719, 40.725140078997832], [-73.960914947540445, 40.725194108090982], [-73.960914947540445, 40.725248137184124], [-73.960956970168439, 40.725290159812126], [-73.960980983098736, 40.725332182440127], [-73.960974979866151, 40.725374205068128]].map((subArray) => [subArray[1], subArray[0]])

      const polygon2 = L.polygon(latlns, {color: 'red'}).addTo(map).bindPopup('A belligerent kingdom, long a thorn in the side of its neighbours, particularly its ancestral enemy- the Amaravati to the north');


      // Load GeoJSON data
      fetch('./app/ui/atlas/polygon.geojson')
        .then(response => response.json())
        .then(geoJsonData => {
          console.log("HERE")
          // Add GeoJSON data to the map
          L.geoJSON(geoJsonData, {
            style: {
              color: 'green',  // Change the color as needed
              weight: 2,
              opacity: 1,
            },
          }).addTo(map);
        })
        .catch(error => console.error('Error loading GeoJSON:', error));


      // Save the map instance to the ref
      mapRef.current = map;
    }
  }, []);

  return <div id="map" style={{ height: '100vh' }} />;
};

export default Map;
