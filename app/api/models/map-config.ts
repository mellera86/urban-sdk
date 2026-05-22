export type MapConfig = {
  version: string;
  config: {
    mapState: {
      bearing: number;
      dragRotate: boolean;
      latitude: number;
      longitude: number;
      pitch: number;
      zoom: number;
      isSplit?: boolean;
    };
    mapStyle: {
      styleType: string;
      topLayerGroups?: Record<string, boolean>;
      visibleLayerGroups?: Record<string, boolean>;
    };
  };
};

const TILE_URL_BY_STYLE: Record<string, string> = {
  dark: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
  light: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
  streets: "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
  satellite:
    "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
};

function getTileLayerUrl(styleType?: string) {
  if (!styleType) return TILE_URL_BY_STYLE.light;
  return TILE_URL_BY_STYLE[styleType] ?? TILE_URL_BY_STYLE.light;
}

export { getTileLayerUrl, TILE_URL_BY_STYLE };
