import * as React from "react";
import { LayerGroup, Marker, Popup } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-markercluster";
import { createDivIcon } from "./utilities";
import { MapEvent } from "./MapComponent";
import { LatLng, Point } from "react-leaflet";
import { LatLngExpression } from "leaflet";
require("react-leaflet-markercluster/dist/styles.min.css");

export enum AnimationType {
  BOUNCE = "bounce",
  FADE = "fade",
  PULSE = "pulse",
  JUMP = "jump",
  SPIN = "spin",
  WAGGLE = "waggle"
}
export interface MapMarkerAnimation {
  type: AnimationType;
  duration?: number;
  delay?: number;
  direction?: "nomal" | "reverse" | "alternate" | "alternate-reverse";
  iterationCount?: number | "infinite";
}

export interface MapMarker {
  animation?: MapMarkerAnimation;
  position: LatLng;
  divIcon?: L.DivIcon;
  icon: any;
  iconAnchor?: Point;
  id?: string;
  size?: Point;
  title?: string;
}

interface MapMarkersProps {
  mapMarkers: MapMarker[];
  onMapEvent: (mapEvent: MapEvent, mapMarkerId: string) => void;
  useMarkerClustering?: boolean;
}

export default class MapMarkers extends React.Component<MapMarkersProps> {
  render() {
    const { mapMarkers, onMapEvent, useMarkerClustering = true } = this.props;
    if (useMarkerClustering) {
      return (
        <LayerGroup>
          <MarkerClusterGroup>
            {mapMarkers.map((mapMarker: MapMarker) => {
              if (mapMarker.id !== "ownPositionMarker") {
                console.log({ mapMarker });
                return (
                  <Marker
                    key={mapMarker.id}
                    position={mapMarker.position as LatLngExpression}
                    icon={createDivIcon(mapMarker)}
                    onClick={() => {
                      onMapEvent(MapEvent.ON_MAP_MARKER_CLICKED, mapMarker.id);
                    }}
                  >
                    {mapMarker.title && <Popup>{mapMarker.title}</Popup>}
                  </Marker>
                );
              } else {
                return null;
              }
            })}
          </MarkerClusterGroup>
          {mapMarkers.map((mapMarker: MapMarker) => {
            if (mapMarker.id === "ownPositionMarker") {
              return (
                <Marker
                  key={mapMarker.id}
                  position={mapMarker.position as LatLngExpression}
                  icon={createDivIcon(mapMarker)}
                  onClick={() => {
                    onMapEvent(MapEvent.ON_MAP_MARKER_CLICKED, mapMarker.id);
                  }}
                >
                  {mapMarker.title && <Popup>{mapMarker.title}</Popup>}
                </Marker>
              );
            } else {
              return null;
            }
          })}
        </LayerGroup>
      );
    } else {
      return (
        <LayerGroup>
          {mapMarkers.map((marker: MapMarker) => {
            return (
              <Marker
                key={marker.id}
                position={marker.position as LatLngExpression}
                // @ts-ignore
                icon={marker.divIcon}
                onClick={() => {
                  onMapEvent(MapEvent.ON_MAP_MARKER_CLICKED, marker.id);
                }}
              >
                {marker.title && <Popup>{marker.title}</Popup>}
              </Marker>
            );
          })}
        </LayerGroup>
      );
    }
  }
}
