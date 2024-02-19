/**
 * @file Aberran globe map
 * @author Kris Amerman <krisamerman@gmail.com>
 * @version 0.0.1
 * 
 * @todo Open PR on DefinitelyTyped (type mismatch)
 *   - Example: mapboxgl.MapboxOptions.projection expects Projection, but should be string
 *   - types/mapbox-gl version -> v2.7.21
 *   - mapbox - gl version -> v3.1.2
 */

'use client'

// ======================== Imports ========================
import React, { useRef, useState, useEffect } from 'react';
import "mapbox-gl/dist/mapbox-gl.css";
import "@/app/ui/atlas/map.css"
import mapboxgl from 'mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax

//======================== Token init ========================

mapboxgl.accessToken = 'pk.eyJ1Ijoia3Jpc2FtZXJtYW4iLCJhIjoiY2xzaWRubWVlMmY1bTJscXU3Z2dyaXIydyJ9.Yo-Ih8j1RNGTnk7UJ4XpiQ';

// ======================== Type definitions ========================

type MyGeoJsonProperties = GeoJSON.GeoJsonProperties & { name: string }

// ======================== Map component ========================

export default function Map() {
  const mapContainer = useRef(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [lng, setLng] = useState(46.556);
  const [lat, setLat] = useState(53.358);
  const [zoom, setZoom] = useState(2);

  useEffect(() => {
    if (map.current) return; // initialize only once

    // Initialize map
    map.current = new mapboxgl.Map({
      container: mapContainer.current!,
      projection: 'globe' as any,
      // style: "mapbox://styles/krisamerman/clspe70h804dv01qs1m1ebovv/draft",
      style: {
        version: 8,
        sources: {},
        layers: [
          {
            id: 'background',
            type: 'background',
            paint: { 'background-color': '#d9c797' }
          }
        ]
      },
      center: [lng, lat],
      zoom: zoom,
      pitch: 90,
      bearing: 0,
      antialias: true,
    });

    // When map moves, update coords state
    map.current.on('move', () => {
      setLng(Number(map.current!.getCenter().lng.toFixed(4)));
      setLat(Number(map.current!.getCenter().lat.toFixed(4)));
      setZoom(Number(map.current!.getZoom().toFixed(2)));
    });

    // Add atmosphere
    map.current.on('style.load', () => {
      map.current!.setFog({
        color: 'rgb(186, 210, 235)',
        'high-color': 'rgb(36, 92, 223)',
        'horizon-blend': 0.02,
        'space-color': 'rgb(11, 11, 25)',
        'star-intensity': 0.6
      });
    });

    // Fetch GeoJSON and build polygons
    const buildMapLayers = async () => {
      let highlightId: number | null = null;

      try {
        // Fetch polygon data
        const response = await fetch('/mapped_ids.geojson');
        const geoJSONData: GeoJSON.FeatureCollection<
          GeoJSON.Geometry,
          MyGeoJsonProperties
        > = await response.json();

        // Add polygons source to map
        map.current!.addSource('custom-polygons', {
          type: 'geojson',
          data: geoJSONData,
        });

        // Add polygon borders
        map.current!.addLayer({
          id: 'custom-polygons-border',
          type: 'line',
          source: 'custom-polygons',
          paint: {
            'line-color': '#826439',
            'line-width': 1,
          },
        });

        // Add polygon fills
        map.current!.addLayer({
          id: 'custom-polygons-layer',
          type: 'fill',
          source: 'custom-polygons',
          paint: {
            'fill-color': '#a27d48',
            'fill-opacity': [
              'case',
              ['boolean', ['feature-state', 'hover'], false],
              0.95,
              0.7
            ],
          }
        });

        // ======================== Add mouse interactions ========================

        // MOUSE CLICK
        map.current!.on('click', 'custom-polygons-layer', (e) => {
          const feature = e.features![0];
          const { name } = feature.properties as MyGeoJsonProperties;
          const description = "placeholder";

          // Add popup to map at current lnglat
          new mapboxgl.Popup()
            .setLngLat(e.lngLat)
            .setHTML(`<div><h1>${name}</h1><p>${description}</p></div>`)
            .addTo(map.current!);
        });

        // MOUSE MOVE
        map.current!.on('mousemove', 'custom-polygons-layer', (e) => {

          // Update cursor (clickable)
          if (map.current!.getCanvas().style.cursor !== 'pointer') {
            map.current!.getCanvas().style.cursor = 'pointer';
          }

          if (e.features && e.features.length > 0) {
            if (e.features[0].id === highlightId) return; // ignore repeats

            // If a polygon is already highlighted, un-highlight it 
            if (highlightId !== null) {
              map.current!.setFeatureState(
                { source: 'custom-polygons', id: highlightId },
                { hover: false }
              );
            }
            // Highlight the current polygon
            highlightId = Number(e.features[0].id);
            map.current!.setFeatureState(
              { source: 'custom-polygons', id: e.features[0].id },
              { hover: true }
            );
          }
        });

        // MOUSE LEAVE
        map.current!.on('mouseleave', 'custom-polygons-layer', () => {

          // Update cursor (back to default)
          map.current!.getCanvas().style.cursor = '';

          // If polygon is highlighted, un-highlight it
          if (highlightId !== null) {
            map.current!.setFeatureState(
              { source: 'custom-polygons', id: highlightId },
              { hover: false }
            );
            highlightId = null;
          }
        });
      } catch (error) {
        console.error('Could not build map layers:', error);
      }
    }

    // Call buildMapLayers after the map has loaded
    map.current.on('load', buildMapLayers);
  });

  return (
    <div>
      <div className="sidebar">
        Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
      </div>
      <div ref={mapContainer} className="map-container" />
    </div>
  );
}