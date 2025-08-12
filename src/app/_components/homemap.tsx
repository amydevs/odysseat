"use client";
import Map from 'react-map-gl/maplibre';

export default function HomeMap() {
    return <Map
            initialViewState={{
              longitude: -100,
              latitude: 40,
              zoom: 3.5
            }}
            mapStyle="https://api.maptiler.com/maps/streets/style.json?key=Y1LHHXeWTC4l0lTXoIC4"
          />;;
}