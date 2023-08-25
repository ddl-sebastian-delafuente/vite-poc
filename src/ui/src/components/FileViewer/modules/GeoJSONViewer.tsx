import * as React from 'react';
import * as R from 'ramda';
import styled from 'styled-components';
import L, { LatLng, Layer, Map } from 'leaflet';
import { Feature, GeoJSON } from 'geojson';
import 'leaflet/dist/leaflet.css';
const icon = require('leaflet/dist/images/marker-icon.png');
const iconRetina = require('leaflet/dist/images/marker-icon-2x.png');
const iconShadow = require('leaflet/dist/images/marker-shadow.png');

import { useRemoteData } from '../../../utils/useRemoteData';
import { 
  FileViewerFileRendererProps,
  FileViewerModule 
} from '../FileViewer.types';

const Wrapper = styled.div`
  width: 100%;
  height: calc(100% - 43px);
  .leaflet-container {
    width: 100%;
    height: 100%;
  }
`;

interface Props {
  content: string;
}

const GeoJSONViewer = (props: Props) => {
  const leafletMap = React.useRef<Map>();
  const mapDivId = 'map';

  React.useEffect(() => {
    let features: GeoJSON | undefined = undefined;
    try {
      features = !(R.isNil(props.content) || R.isEmpty(props.content)) && JSON.parse(props.content);
    } catch (e) {
      console.error(e);
    }
    if (leafletMap.current) {
        leafletMap.current.off();
        leafletMap.current.remove();
        const inner = '<div id=\'' + mapDivId + '\'></div>';
        document.getElementsByClassName('map-container')[0].innerHTML = inner;
    }

    if (features) {
      const map = L.map(mapDivId);

      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);

      const layer = L.geoJSON(features, {
        style(feature: Feature) {
          return feature.properties && feature.properties.style;
        },
        pointToLayer(feature: Feature, latlng: LatLng) {
          if (feature.properties && feature.properties.style) {
            return L.circleMarker(latlng, feature.properties && feature.properties.style);
          } else if (feature.properties && feature.properties.icon) {
            return L.marker(latlng, {
              icon: L.icon(feature.properties && feature.properties.icon),
            });
          }
          return L.marker(latlng, {
            icon: L.icon({
              iconRetinaUrl: iconRetina,
              iconUrl: icon,
              shadowUrl: iconShadow,
              iconSize: [24, 36],
              iconAnchor: [12, 36],
            }),
          });
        },
        onEachFeature(feature: Feature, layer: Layer) {
          if (feature.properties && feature.properties.popupContent) {
            const { popupContent } = feature.properties;
            layer.bindPopup(popupContent);
          }
        }
      }).addTo(map);
      map.fitBounds(layer.getBounds());
      leafletMap.current = map;
    }
  }, [props.content]);

  return (
    <Wrapper className="map-container">
      <div id={mapDivId}></div>
    </Wrapper>
  );
};

const GeoJSONViewerRenderer = ({ metadata }: FileViewerFileRendererProps) => {
  const {
    data,
    loading,
    hasLoaded,
  } = useRemoteData({
    canFetch: Boolean(metadata?.uri),
    fetcher: async () => {
      const response = await fetch(metadata.uri as string);
      return await response.text();
    },
    initialValue: '{}'
  });

  if (!hasLoaded || !metadata?.uri || (loading && !hasLoaded)) {
    return null;
  }

  return (
    <GeoJSONViewer content={data}/>
  )
}

export const GeoJSONViewerModule: FileViewerModule = {
  id: 'geojson',
  Renderer: GeoJSONViewerRenderer,
  supportedExtensions: ['geojson'],
  supportedTypes: ['application/geo+json'],
}

export default GeoJSONViewer;
