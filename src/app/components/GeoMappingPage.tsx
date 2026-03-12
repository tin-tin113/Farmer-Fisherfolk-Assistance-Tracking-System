import { useState, useEffect, useRef, useCallback } from 'react';
import { MapPin, Eye, X, User, Layers } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Municipality center coordinates (E.B. Magalona, Negros Occidental)
const MUNICIPALITY_CENTER: L.LatLngExpression = [10.3950, 122.8750];
const DEFAULT_ZOOM = 13;

const TILE_URLS = {
  roadmap: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  satellite: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
};

// Beneficiary locations with real coordinates within E.B. Magalona
const locations = [
  {
    id: 1, name: 'Juan Dela Cruz', type: 'Farmer', hectares: 2, crop: 'Rice',
    barangay: 'Brgy. Consing', contact: '09171234567',
    location: 'Brgy. Consing, Enrique B. Magalona',
    lat: 10.4020, lng: 122.8680,
    photoUrl: 'https://images.unsplash.com/photo-1710563849800-73af5bfc9f36?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200'
  },
  {
    id: 2, name: 'Maria Santos', type: 'Fisherfolk', hectares: 0, crop: '-',
    barangay: 'Brgy. Mambulac', contact: '09187654321',
    location: 'Brgy. Mambulac, Enrique B. Magalona',
    lat: 10.3780, lng: 122.8550,
    photoUrl: 'https://images.unsplash.com/photo-1714287297882-2feb2d99d9bc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200'
  },
  {
    id: 3, name: 'Pedro Gomez', type: 'Farmer', hectares: 1.5, crop: 'Corn',
    barangay: 'Brgy. Tolotolo', contact: '09209876543',
    location: 'Brgy. Tolotolo, Enrique B. Magalona',
    lat: 10.4130, lng: 122.8900,
    photoUrl: 'https://images.unsplash.com/photo-1729559149688-bee985e447ca?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200'
  },
  {
    id: 4, name: 'Ana Lopez', type: 'Fisherfolk', hectares: 0, crop: '-',
    barangay: 'Brgy. Poblacion', contact: '09281112233',
    location: 'Brgy. Poblacion, Enrique B. Magalona',
    lat: 10.3890, lng: 122.8820,
    photoUrl: 'https://images.unsplash.com/photo-1707735508321-9e19789c17e3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200'
  },
  {
    id: 5, name: 'Carlos Reyes', type: 'Farmer', hectares: 3, crop: 'Rice',
    barangay: 'Brgy. Consing', contact: '09334445566',
    location: 'Brgy. Consing, Enrique B. Magalona',
    lat: 10.3980, lng: 122.8720,
    photoUrl: 'https://images.unsplash.com/photo-1772535553085-af8695f69d93?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200'
  },
  {
    id: 6, name: 'Rosa Villanueva', type: 'Farmer', hectares: 1.8, crop: 'Sugarcane',
    barangay: 'Brgy. Canlusong', contact: '09451234567',
    location: 'Brgy. Canlusong, Enrique B. Magalona',
    lat: 10.4060, lng: 122.8580,
    photoUrl: ''
  },
  {
    id: 7, name: 'Roberto Tan', type: 'Fisherfolk', hectares: 0, crop: '-',
    barangay: 'Brgy. Damgo', contact: '09567891234',
    location: 'Brgy. Damgo, Enrique B. Magalona',
    lat: 10.3700, lng: 122.8750,
    photoUrl: ''
  },
  {
    id: 8, name: 'Elena Flores', type: 'Farmer', hectares: 2.5, crop: 'Rice',
    barangay: 'Brgy. Alacaygan', contact: '09678901234',
    location: 'Brgy. Alacaygan, Enrique B. Magalona',
    lat: 10.4180, lng: 122.8700,
    photoUrl: ''
  },
];

type LocationType = typeof locations[number];

function createMarkerIcon(color: string, isSelected: boolean) {
  const size = isSelected ? 38 : 30;
  return L.divIcon({
    className: '',
    html: `<div style="
      width: ${size}px; height: ${size}px; border-radius: 50%;
      background: ${color}; border: 3px solid white;
      box-shadow: 0 2px 8px rgba(0,0,0,${isSelected ? '0.5' : '0.3'});
      display: flex; align-items: center; justify-content: center;
      transition: all 0.2s;
    ">
      <svg xmlns="http://www.w3.org/2000/svg" width="${isSelected ? 18 : 14}" height="${isSelected ? 18 : 14}" viewBox="0 0 24 24" fill="white" stroke="white" stroke-width="2">
        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
        <circle cx="12" cy="10" r="3" fill="${color}" stroke="white"/>
      </svg>
    </div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size],
    popupAnchor: [0, -size],
  });
}

// Leaflet Map component using imperative API
function LeafletMap({
  filtered,
  selectedLocation,
  onSelectLocation,
  onViewProfile,
  mapType,
}: {
  filtered: LocationType[];
  selectedLocation: LocationType | null;
  onSelectLocation: (loc: LocationType) => void;
  onViewProfile: (loc: LocationType) => void;
  mapType: 'roadmap' | 'satellite';
}) {
  const mapRef = useRef<L.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const markersRef = useRef<Map<number, L.Marker>>(new Map());

  // Initialize map
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      center: MUNICIPALITY_CENTER,
      zoom: DEFAULT_ZOOM,
      zoomControl: false,
      scrollWheelZoom: true,
    });

    tileLayerRef.current = L.tileLayer(TILE_URLS.roadmap, {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    // Add zoom control to bottom-right
    L.control.zoom({ position: 'bottomright' }).addTo(map);

    mapRef.current = map;

    // Force size recalculation
    setTimeout(() => map.invalidateSize(), 200);

    return () => {
      map.remove();
      mapRef.current = null;
      tileLayerRef.current = null;
      markersRef.current.clear();
    };
  }, []);

  // Update tile layer when map type changes
  useEffect(() => {
    if (!mapRef.current || !tileLayerRef.current) return;
    tileLayerRef.current.setUrl(TILE_URLS[mapType]);
  }, [mapType]);

  // Update markers
  useEffect(() => {
    if (!mapRef.current) return;
    const map = mapRef.current;

    // Remove old markers
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current.clear();

    // Add new markers
    filtered.forEach((loc) => {
      const isSelected = selectedLocation?.id === loc.id;
      const color = loc.type === 'Farmer' ? '#ef4444' : '#3b82f6';
      const icon = createMarkerIcon(color, isSelected);

      const photoHtml = loc.photoUrl
        ? `<img src="${loc.photoUrl}" alt="${loc.name}" style="width:40px;height:40px;border-radius:50%;object-fit:cover;border:2px solid #bbf7d0;" />`
        : `<div style="width:40px;height:40px;border-radius:50%;background:#e5e7eb;display:flex;align-items:center;justify-content:center;"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" stroke-width="2"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg></div>`;

      const typeBadge = loc.type === 'Farmer'
        ? `<span style="font-size:11px;padding:1px 6px;border-radius:4px;background:#fee2e2;color:#b91c1c;">${loc.type}</span>`
        : `<span style="font-size:11px;padding:1px 6px;border-radius:4px;background:#dbeafe;color:#1d4ed8;">${loc.type}</span>`;

      const popupContent = `
        <div style="padding:8px;min-width:180px;">
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;">
            ${photoHtml}
            <div>
              <div style="font-size:13px;font-weight:500;">${loc.name}</div>
              ${typeBadge}
            </div>
          </div>
          <div style="font-size:11px;color:#6b7280;line-height:1.6;">
            <div>${loc.barangay}</div>
            ${loc.hectares > 0 ? `<div>${loc.hectares} Hectares</div>` : ''}
            ${loc.crop !== '-' ? `<div>Crop: ${loc.crop}</div>` : ''}
          </div>
          <button id="view-profile-${loc.id}" style="margin-top:8px;font-size:11px;color:#16a34a;background:none;border:none;cursor:pointer;padding:0;display:flex;align-items:center;gap:4px;">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
            View Full Profile
          </button>
        </div>
      `;

      const marker = L.marker([loc.lat, loc.lng], { icon })
        .addTo(map)
        .bindPopup(popupContent, { closeButton: true, className: 'custom-popup' });

      marker.on('click', () => {
        onSelectLocation(loc);
      });

      marker.on('popupopen', () => {
        setTimeout(() => {
          const btn = document.getElementById(`view-profile-${loc.id}`);
          if (btn) {
            btn.onclick = () => {
              onViewProfile(loc);
              marker.closePopup();
            };
          }
        }, 50);
      });

      markersRef.current.set(loc.id, marker);
    });
  }, [filtered, selectedLocation, onSelectLocation, onViewProfile]);

  // Fly to selected location
  useEffect(() => {
    if (!mapRef.current || !selectedLocation) return;
    mapRef.current.flyTo([selectedLocation.lat, selectedLocation.lng], mapRef.current.getZoom(), {
      duration: 0.8,
    });
  }, [selectedLocation]);

  return <div ref={containerRef} className="w-full h-full" />;
}

// Mini map for profile modal
function MiniMap({ lat, lng, type }: { lat: number; lng: number; type: string }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const map = L.map(containerRef.current, {
      center: [lat, lng],
      zoom: 15,
      zoomControl: false,
      scrollWheelZoom: false,
      dragging: false,
      attributionControl: false,
    });

    L.tileLayer(TILE_URLS.roadmap).addTo(map);

    const color = type === 'Farmer' ? '#ef4444' : '#3b82f6';
    const icon = createMarkerIcon(color, true);
    L.marker([lat, lng], { icon }).addTo(map);

    setTimeout(() => map.invalidateSize(), 100);

    return () => {
      map.remove();
    };
  }, [lat, lng, type]);

  return <div ref={containerRef} className="w-full h-full" />;
}

export function GeoMappingPage() {
  const [selectedLocation, setSelectedLocation] = useState<LocationType>(locations[0]);
  const [filter, setFilter] = useState('All');
  const [showProfile, setShowProfile] = useState<LocationType | null>(null);
  const [mapType, setMapType] = useState<'roadmap' | 'satellite'>('roadmap');

  const filtered = filter === 'All' ? locations : locations.filter(l => l.type === filter);

  const handleSelectLocation = useCallback((loc: LocationType) => {
    setSelectedLocation(loc);
  }, []);

  const handleViewProfile = useCallback((loc: LocationType) => {
    setShowProfile(loc);
  }, []);

  return (
    <div className="space-y-6">
      <style>{`
        .custom-popup .leaflet-popup-content-wrapper { border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.15); }
        .custom-popup .leaflet-popup-content { margin: 0; }
        .custom-popup .leaflet-popup-tip { box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
        .leaflet-container { font-family: inherit; }
      `}</style>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MapPin className="w-6 h-6 text-green-700" />
          <h1>Geo-Mapping</h1>
        </div>
        <div className="flex gap-2">
          {['All', 'Farmer', 'Fisherfolk'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${filter === f ? 'bg-green-700 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-green-600">
          <p className="text-xs text-gray-500">Total Mapped</p>
          <p className="text-2xl text-green-700">{locations.length}</p>
          <p className="text-xs text-gray-400 mt-1">Beneficiaries with GPS</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-red-500">
          <p className="text-xs text-gray-500">Farmers</p>
          <p className="text-2xl text-red-600">{locations.filter(l => l.type === 'Farmer').length}</p>
          <p className="text-xs text-gray-400 mt-1">Mapped locations</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-blue-500">
          <p className="text-xs text-gray-500">Fisherfolk</p>
          <p className="text-2xl text-blue-600">{locations.filter(l => l.type === 'Fisherfolk').length}</p>
          <p className="text-xs text-gray-400 mt-1">Mapped locations</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="relative h-[520px]">
            <LeafletMap
              filtered={filtered}
              selectedLocation={selectedLocation}
              onSelectLocation={handleSelectLocation}
              onViewProfile={handleViewProfile}
              mapType={mapType}
            />

            {/* Map Type Switcher */}
            <div className="absolute top-4 right-4 z-[1000] flex flex-col gap-2">
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <button
                  onClick={() => setMapType(mapType === 'roadmap' ? 'satellite' : 'roadmap')}
                  className="p-2.5 hover:bg-gray-100 flex items-center gap-2"
                  title="Change map type"
                >
                  <Layers className="w-4 h-4 text-gray-600" />
                  <span className="text-xs text-gray-600">{mapType === 'roadmap' ? 'Satellite' : 'Map'}</span>
                </button>
              </div>
            </div>

            {/* Legend */}
            <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm rounded-lg p-3 shadow-lg z-[1000]">
              <p className="text-xs text-gray-500 mb-2">Municipality of E.B. Magalona</p>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500 border border-white shadow" />
                  <span className="text-xs text-gray-600">Farmer</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-blue-500 border border-white shadow" />
                  <span className="text-xs text-gray-600">Fisherfolk</span>
                </div>
              </div>
            </div>

            {/* Selected Location Info Card */}
            {selectedLocation && (
              <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-xl max-w-60 z-[1000]">
                <div className="flex items-center gap-2 mb-2">
                  {selectedLocation.photoUrl ? (
                    <img src={selectedLocation.photoUrl} alt={selectedLocation.name} className="w-10 h-10 rounded-full object-cover border-2 border-green-200" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                      <User className="w-5 h-5 text-gray-400" />
                    </div>
                  )}
                  <div>
                    <h3 className="text-sm">{selectedLocation.name}</h3>
                    <span className={`text-xs px-1.5 py-0.5 rounded ${selectedLocation.type === 'Farmer' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
                      {selectedLocation.type}
                    </span>
                  </div>
                </div>
                <div className="text-xs text-gray-500 space-y-0.5">
                  <p>{selectedLocation.barangay}</p>
                  {selectedLocation.hectares > 0 && <p>{selectedLocation.hectares} Hectares</p>}
                  {selectedLocation.crop !== '-' && <p>Crop: {selectedLocation.crop}</p>}
                  <p className="text-gray-400">
                    {selectedLocation.lat.toFixed(4)}°N, {selectedLocation.lng.toFixed(4)}°E
                  </p>
                </div>
                <button
                  onClick={() => setShowProfile(selectedLocation)}
                  className="mt-2 text-xs text-green-600 hover:underline flex items-center gap-1"
                >
                  <Eye className="w-3 h-3" /> View Profile
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Location List */}
        <div className="bg-white rounded-xl shadow-sm p-5">
          <h3 className="mb-1">Beneficiary Locations</h3>
          <p className="text-xs text-gray-400 mb-4">{filtered.length} beneficiaries mapped</p>
          <div className="space-y-2 max-h-[440px] overflow-y-auto pr-1">
            {filtered.map((loc) => (
              <button
                key={loc.id}
                onClick={() => handleSelectLocation(loc)}
                className={`w-full text-left p-3 rounded-lg border transition-all ${selectedLocation?.id === loc.id ? 'border-green-500 bg-green-50 shadow-sm' : 'border-gray-100 hover:bg-gray-50'}`}
              >
                <div className="flex items-center gap-2">
                  {loc.photoUrl ? (
                    <img src={loc.photoUrl} alt={loc.name} className="w-8 h-8 rounded-full object-cover border border-gray-200" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                      <User className="w-4 h-4 text-gray-400" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <div className={`w-2 h-2 rounded-full shrink-0 ${loc.type === 'Farmer' ? 'bg-red-500' : 'bg-blue-500'}`} />
                      <span className="text-sm truncate">{loc.name}</span>
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5 truncate">{loc.barangay} | {loc.type}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Profile Modal */}
      {showProfile && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-lg shadow-xl">
            <div className="flex items-center justify-between p-5 border-b">
              <h3>Beneficiary Profile</h3>
              <button onClick={() => setShowProfile(null)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5">
              <div className="flex items-start gap-4">
                <div className="w-20 h-20 rounded-full overflow-hidden shrink-0 border-2 border-green-200">
                  {showProfile.photoUrl ? (
                    <ImageWithFallback src={showProfile.photoUrl} alt={showProfile.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <User className="w-8 h-8 text-gray-400" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h2>{showProfile.name}</h2>
                    <span className={`px-2 py-0.5 rounded text-xs ${showProfile.type === 'Farmer' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                      {showProfile.type}
                    </span>
                  </div>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p>Contact: {showProfile.contact}</p>
                    {showProfile.hectares > 0 && <p>Farm Size: {showProfile.hectares} ha</p>}
                    {showProfile.crop && showProfile.crop !== '-' && <p>Crop: {showProfile.crop}</p>}
                    <p className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-red-500" /> {showProfile.location}
                    </p>
                    <p className="text-xs text-gray-400">
                      GPS: {showProfile.lat.toFixed(4)}°N, {showProfile.lng.toFixed(4)}°E
                    </p>
                  </div>
                </div>
              </div>

              {/* Mini Map in Profile */}
              <div className="mt-4 rounded-lg overflow-hidden h-48 relative bg-gray-100">
                <MiniMap lat={showProfile.lat} lng={showProfile.lng} type={showProfile.type} />
                <div className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-sm rounded px-2 py-1 z-[1000]">
                  <p className="text-xs text-gray-600">{showProfile.barangay}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
