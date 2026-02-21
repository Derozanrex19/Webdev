import React, { useEffect, useRef, useState } from 'react';
import { MapPin, Globe2, Building2 } from 'lucide-react';
import CountUp from './CountUp';

interface RevealOnScrollProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

const RevealOnScroll: React.FC<RevealOnScrollProps> = ({ children, className = '', delay = 0 }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.15, rootMargin: '0px 0px -10% 0px' }
    );

    const currentRef = ref.current;
    if (currentRef) observer.observe(currentRef);
    return () => {
      if (currentRef) observer.unobserve(currentRef);
      observer.disconnect();
    };
  }, []);

  return (
    <div
      ref={ref}
      className={`${className} transition-all duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

interface OfficeLocation {
  city: string;
  country: string;
  region: 'APAC' | 'EMEA' | 'Americas';
  coords: [number, number];
  description: string;
}

const officeLocations: OfficeLocation[] = [
  { city: 'Kuala Lumpur', country: 'Malaysia', region: 'APAC', coords: [3.139, 101.6869], description: 'Regional headquarters and operations' },
  { city: 'Singapore', country: 'Singapore', region: 'APAC', coords: [1.3521, 103.8198], description: 'Regional delivery coordination' },
  { city: 'Cebu', country: 'Philippines', region: 'APAC', coords: [10.3157, 123.8854], description: 'Data services and annotation center' },
  { city: 'Hanoi', country: 'Vietnam', region: 'APAC', coords: [21.0278, 105.8342], description: 'Language and data processing operations' },
  { city: 'Jakarta', country: 'Indonesia', region: 'APAC', coords: [-6.2088, 106.8456], description: 'Delivery and operational support' },
  { city: 'Dhaka', country: 'Bangladesh', region: 'APAC', coords: [23.8103, 90.4125], description: 'Online workforce operations' },
  { city: 'Kolkata', country: 'India', region: 'APAC', coords: [22.5726, 88.3639], description: 'AI data workflow operations' },
  { city: 'Hong Kong', country: 'China (SAR)', region: 'APAC', coords: [22.3193, 114.1694], description: 'Regional business presence' },
  { city: 'Shenzhen', country: 'China', region: 'APAC', coords: [22.5431, 114.0579], description: 'Operations and delivery center' },
  { city: 'Dongguan', country: 'China', region: 'APAC', coords: [23.0207, 113.7518], description: 'High-scale production center' },
  { city: 'Meizhou', country: 'China', region: 'APAC', coords: [24.2886, 116.1176], description: 'Regional operations' },
  { city: 'Dubai', country: 'UAE', region: 'EMEA', coords: [25.2048, 55.2708], description: 'Middle East partnerships' },
  { city: 'Lagos', country: 'Nigeria', region: 'EMEA', coords: [6.5244, 3.3792], description: 'West Africa operations' },
  { city: 'Cotonou', country: 'Benin', region: 'EMEA', coords: [6.3703, 2.3912], description: 'West Africa delivery support' },
  { city: 'Belgrade', country: 'Serbia', region: 'EMEA', coords: [44.7866, 20.4489], description: 'European operations support' },
  { city: 'Helsinki', country: 'Finland', region: 'EMEA', coords: [60.1699, 24.9384], description: 'Northern Europe presence' },
  { city: 'Hannover', country: 'Germany', region: 'EMEA', coords: [52.3759, 9.732], description: 'European business operations' },
  { city: 'London', country: 'United Kingdom', region: 'EMEA', coords: [51.5072, -0.1276], description: 'Sales and partnerships' },
  { city: 'Seattle', country: 'United States', region: 'Americas', coords: [47.6062, -122.3321], description: 'North America operations' },
  { city: 'San Jose', country: 'United States', region: 'Americas', coords: [37.3382, -121.8863], description: 'Client and partner engagement' },
  { city: 'Sao Paulo', country: 'Brazil', region: 'Americas', coords: [-23.5505, -46.6333], description: 'South America regional presence' },
];

const locationsByRegion = officeLocations.reduce<Record<string, OfficeLocation[]>>((acc, location) => {
  if (!acc[location.region]) acc[location.region] = [];
  acc[location.region].push(location);
  return acc;
}, {});

const Offices: React.FC = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const markerLayerRef = useRef<any>(null);

  useEffect(() => {
    let retries = 0;
    let retryTimer: number | undefined;

    const initMap = () => {
      if (typeof window === 'undefined' || !(window as any).L || !mapRef.current || mapInstance.current) {
        if (retries < 20 && !mapInstance.current) {
          retries += 1;
          retryTimer = window.setTimeout(initMap, 120);
        }
        return;
      }

      const L = (window as any).L;
      mapInstance.current = L.map(mapRef.current, { zoomControl: true, worldCopyJump: true }).setView([20, 15], 2);

      const osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      });
      osmLayer.addTo(mapInstance.current);

      let fallbackApplied = false;
      osmLayer.on('tileerror', () => {
        if (fallbackApplied || !mapInstance.current) return;
        fallbackApplied = true;
        mapInstance.current.removeLayer(osmLayer);
        L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; CARTO',
          maxZoom: 19,
        }).addTo(mapInstance.current);
      });

      const pinIcon = L.divIcon({
        className: 'lifewood-pin-icon',
        html: `<span style="display:block;width:14px;height:14px;border-radius:9999px;background:#ffb347;border:2px solid #133020;box-shadow:0 0 0 2px rgba(255,255,255,0.65);"></span>`,
        iconSize: [14, 14],
        iconAnchor: [7, 7],
      });

      markerLayerRef.current = L.layerGroup().addTo(mapInstance.current);

      officeLocations.forEach((location) => {
        L.marker(location.coords, { icon: pinIcon })
          .addTo(markerLayerRef.current)
          .bindPopup(
            `<b>${location.city}, ${location.country}</b><br>${location.description}<br><small>${location.region}</small>`
          );
      });

      const bounds = L.latLngBounds(officeLocations.map((location) => location.coords));
      mapInstance.current.fitBounds(bounds, { padding: [40, 40], maxZoom: 4 });

      window.setTimeout(() => {
        if (!mapInstance.current) return;
        mapInstance.current.invalidateSize();
        mapInstance.current.fitBounds(bounds, { padding: [40, 40], maxZoom: 4 });
      }, 260);
    };

    initMap();

    return () => {
      if (retryTimer) window.clearTimeout(retryTimer);
      // Cleanup map on unmount if needed
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
      markerLayerRef.current = null;
    };
  }, []);

  return (
    <div className="bg-lifewood-seasalt min-h-screen font-sans text-lifewood-darkSerpent">
      
      {/* SECTION A: HERO */}
      <section className="bg-lifewood-darkSerpent text-white py-20 relative overflow-hidden">
         <img
            src="https://picsum.photos/seed/lw-offices-hero/2000/1100"
            alt="Global city skyline"
            className="absolute inset-0 w-full h-full object-cover opacity-25"
         />
         <div className="absolute inset-0 bg-gradient-to-r from-lifewood-darkSerpent/90 via-lifewood-darkSerpent/75 to-lifewood-darkSerpent/50"></div>
         {/* Background Decoration */}
         <div className="absolute top-0 right-0 w-1/2 h-full bg-white/5 skew-x-12 transform translate-x-20"></div>
         <div className="absolute bottom-0 left-0 w-64 h-64 bg-lifewood-saffron/10 rounded-full blur-3xl"></div>

         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <RevealOnScroll>
              <h1 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight">
                Largest Global Data Collection Resources Distribution
              </h1>
            </RevealOnScroll>
            <RevealOnScroll delay={180}>
              <p className="text-xl text-lifewood-paper/80 max-w-2xl mx-auto font-light">
                Lifewood operates across APAC, EMEA, and the Americas, enabling scalable multilingual data operations with local expertise.
              </p>
            </RevealOnScroll>
         </div>
      </section>

      {/* STATS BAR */}
      <div className="bg-lifewood-castleton text-white py-8 shadow-lg relative z-20 -mt-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-white/20">
                <div className="p-4">
                    <div className="text-4xl font-bold text-lifewood-saffron mb-1">
                      <CountUp to={56788} from={55000} separator="," duration={0.55} />
                    </div>
                    <div className="text-sm uppercase tracking-widest opacity-80">Online Resources</div>
                </div>
                <div className="p-4">
                    <div className="text-4xl font-bold text-lifewood-saffron mb-1">
                      <CountUp to={30} duration={1.0} />+
                    </div>
                    <div className="text-sm uppercase tracking-widest opacity-80">Countries</div>
                </div>
                <div className="p-4">
                    <div className="text-4xl font-bold text-lifewood-saffron mb-1">
                      <CountUp to={40} duration={1.0} />+
                    </div>
                    <div className="text-sm uppercase tracking-widest opacity-80">Delivery Centers</div>
                </div>
            </div>
        </div>
      </div>

      {/* SECTION B: INTERACTIVE MAP */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <RevealOnScroll>
          <div className="bg-white rounded-3xl shadow-xl border border-lifewood-grey-light overflow-hidden p-2">
              <div 
                  ref={mapRef} 
                  id="map" 
                  className="w-full h-[500px] md:h-[600px] rounded-2xl z-0"
                  style={{ zIndex: 0 }}
              ></div>
          </div>
        </RevealOnScroll>
      </section>

      {/* SECTION C: OFFICE ADDRESSES */}
      <section className="pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <RevealOnScroll>
          <h2 className="text-3xl font-bold text-lifewood-darkSerpent mb-3 text-center">Global Office Locations</h2>
          <p className="mb-10 text-center text-lifewood-darkSerpent/70">
            All mapped locations are listed below by region.
          </p>
        </RevealOnScroll>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {Object.entries(locationsByRegion).map(([region, locations], regionIndex) => (
            <RevealOnScroll key={region} delay={regionIndex * 120}>
              <article className="h-full rounded-2xl border border-lifewood-darkSerpent/10 bg-white p-6 shadow-sm">
                <div className="mb-5 flex items-center gap-3">
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-lifewood-seasalt">
                    {region === 'APAC' ? (
                      <Building2 className="h-5 w-5 text-lifewood-castleton" />
                    ) : (
                      <Globe2 className="h-5 w-5 text-lifewood-castleton" />
                    )}
                  </div>
                  <h3 className="text-xl font-bold">{region}</h3>
                </div>
                <ul className="space-y-3">
                  {locations.map((location) => (
                    <li key={`${location.city}-${location.country}`} className="flex items-start gap-2 text-sm text-lifewood-darkSerpent/80">
                      <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-lifewood-saffron" />
                      <span>
                        <strong>{location.city}</strong>, {location.country}
                      </span>
                    </li>
                  ))}
                </ul>
              </article>
            </RevealOnScroll>
          ))}
        </div>
      </section>

    </div>
  );
};

export default Offices;
