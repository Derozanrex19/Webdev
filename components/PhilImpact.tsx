import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight, Globe2, HandHeart, Leaf, Users2 } from 'lucide-react';
import ScrollVelocity from './ScrollVelocity';
import { Page } from '../types';

type Loc = { name: string; coords: [number, number] };
type Row = { title: string; description: string; image: string; alt: string; reverse: boolean };
type Card = { icon: typeof Users2; title: string; copy: string };

const RevealOnScroll: React.FC<{ children: React.ReactNode; className?: string; delay?: number }> = ({
  children,
  className = '',
  delay = 0,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setIsVisible(entry.isIntersecting), {
      threshold: 0.15,
      rootMargin: '0px 0px -10% 0px',
    });
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
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

const countryRows = [
  'SOUTH AFRICA | NIGERIA | REPUBLIC OF THE CONGO | DEMOCRATIC REPUBLIC OF THE CONGO | GHANA | MADAGASCAR | BENIN | UGANDA | KENYA',
  'IVORY COAST | EGYPT | ETHIOPIA | NIGER | TANZANIA | NAMIBIA | ZAMBIA | ZIMBABWE | LIBERIA | SIERRA LEONE | BANGLADESH',
];

const impactLocations: Loc[] = [
  { name: 'South Africa', coords: [-26.2041, 28.0473] },
  { name: 'Nigeria', coords: [6.5244, 3.3792] },
  { name: 'Republic of the Congo', coords: [-4.2634, 15.2429] },
  { name: 'Democratic Republic of the Congo', coords: [-4.4419, 15.2663] },
  { name: 'Ghana', coords: [5.6037, -0.187] },
  { name: 'Madagascar', coords: [-18.8792, 47.5079] },
  { name: 'Benin', coords: [6.3703, 2.3912] },
  { name: 'Uganda', coords: [0.3476, 32.5825] },
  { name: 'Kenya', coords: [-1.2921, 36.8219] },
  { name: 'Ivory Coast', coords: [5.3599, -4.0083] },
  { name: 'Egypt', coords: [30.0444, 31.2357] },
  { name: 'Ethiopia', coords: [8.9806, 38.7578] },
  { name: 'Niger', coords: [13.5116, 2.1254] },
  { name: 'Tanzania', coords: [-6.7924, 39.2083] },
  { name: 'Namibia', coords: [-22.5609, 17.0658] },
  { name: 'Zambia', coords: [-15.3875, 28.3228] },
  { name: 'Zimbabwe', coords: [-17.8252, 31.0335] },
  { name: 'Liberia', coords: [6.3004, -10.7969] },
  { name: 'Sierra Leone', coords: [8.4657, -13.2317] },
  { name: 'Bangladesh', coords: [23.8103, 90.4125] },
];

const impactProgramRows: Row[] = [
  {
    title: 'Partnership',
    description:
      'In partnership with philanthropic organizations, Lifewood has expanded operations across South Africa, Nigeria, Republic of the Congo, Democratic Republic of the Congo, Ghana, Madagascar, Benin, Uganda, Kenya, Ivory Coast, Egypt, Ethiopia, Niger, Tanzania, Namibia, Zambia, Zimbabwe, Liberia, Sierra Leone, and Bangladesh.',
    image:
      'https://images.pexels.com/photos/3182812/pexels-photo-3182812.jpeg?auto=compress&cs=tinysrgb&w=1400&h=900&fit=crop&dpr=2',
    alt: 'Partnership program participants',
    reverse: false,
  },
  {
    title: 'Application',
    description:
      'This requires the application of our methods and experience for the development of people in under-resourced economies.',
    image:
      'https://images.pexels.com/photos/3182746/pexels-photo-3182746.jpeg?auto=compress&cs=tinysrgb&w=1400&h=900&fit=crop&dpr=2',
    alt: 'Application and training activity',
    reverse: true,
  },
  {
    title: 'Expanding',
    description:
      'We are expanding access to training, equitable wage structures, and career progression to create sustainable long-term benefit for everyone.',
    image:
      'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=1400&h=900&fit=crop&dpr=2',
    alt: 'Expanding community impact',
    reverse: false,
  },
];

const focusAreasImage =
  'https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=1400&h=1100&fit=crop&dpr=2';

const principleCards: Card[] = [
  { icon: Users2, title: 'Human-Centered', copy: 'We fund systems that create access to jobs, learning, and durable capability.' },
  { icon: HandHeart, title: 'Locally Anchored', copy: 'Partnerships work best when programs are shaped by regional realities and not imposed from distance.' },
  { icon: Leaf, title: 'Long-Term Benefit', copy: 'We prioritize interventions that compound over time instead of short-lived visibility.' },
];

interface PhilImpactProps { onNavigate: (page: Page) => void; }

const PhilImpact: React.FC<PhilImpactProps> = ({ onNavigate }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);

  useEffect(() => {
    let retries = 0;
    let retryTimer: number | undefined;
    const initMap = () => {
      if (typeof window === 'undefined' || !(window as any).L || !mapRef.current || mapInstance.current) {
        if (!mapInstance.current && retries < 20) {
          retries += 1;
          retryTimer = window.setTimeout(initMap, 120);
        }
        return;
      }
      const L = (window as any).L;
      mapInstance.current = L.map(mapRef.current, {
        zoomControl: true,
        worldCopyJump: false,
        minZoom: 2,
        maxBounds: [[-85, -180], [85, 180]],
        maxBoundsViscosity: 1.0,
      }).setView([4, 18], 3);
      const mapViewLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
        noWrap: true,
      });
      const satelliteLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Tiles &copy; Esri &mdash; Source: Esri, Maxar, Earthstar Geographics, and the GIS User Community',
        maxZoom: 19,
        noWrap: true,
      });
      const hybridLayer = L.layerGroup([
        L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
          attribution: 'Tiles &copy; Esri &mdash; Source: Esri, Maxar, Earthstar Geographics, and the GIS User Community',
          maxZoom: 19,
          noWrap: true,
        }),
        L.tileLayer('https://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}', {
          attribution: 'Labels &copy; Esri',
          maxZoom: 19,
          noWrap: true,
        }),
      ]);
      const lightGrayLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; CARTO',
        maxZoom: 19,
        noWrap: true,
      });
      satelliteLayer.addTo(mapInstance.current);
      L.control.layers(
        { 'Map View': mapViewLayer, 'Satellite View': satelliteLayer, 'Hybrid View': hybridLayer, 'Light Gray View': lightGrayLayer },
        undefined,
        { position: 'topright', collapsed: true }
      ).addTo(mapInstance.current);
      const markerIcon = L.divIcon({
        className: 'lifewood-impact-pin',
        html: `<span class="lifewood-impact-pin__body"><span class="lifewood-impact-pin__inner"></span></span>`,
        iconSize: [24, 34],
        iconAnchor: [12, 32],
        popupAnchor: [0, -28],
      });
      impactLocations.forEach((location) => {
        L.marker(location.coords, { icon: markerIcon }).addTo(mapInstance.current).bindPopup(`<b>${location.name}</b><br>Active impact region`);
      });
      const bounds = L.latLngBounds(impactLocations.map((location) => location.coords));
      const applyImpactViewport = () => mapInstance.current?.fitBounds(bounds, { padding: [55, 45], maxZoom: 4 });
      const refreshViewport = () => {
        if (!mapInstance.current) return;
        mapInstance.current.invalidateSize();
        applyImpactViewport();
      };
      applyImpactViewport();
      window.setTimeout(refreshViewport, 250);
      window.setTimeout(refreshViewport, 800);
      window.setTimeout(refreshViewport, 1400);
    };
    initMap();
    return () => {
      if (retryTimer) window.clearTimeout(retryTimer);
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, []);

  return (
    <div className="phil-impact-page bg-[#f2efe7] text-lifewood-darkSerpent">
      <section className="relative overflow-hidden px-4 pb-8 pt-14 sm:px-6 lg:px-8">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_10%_8%,rgba(255,179,71,0.12),transparent_26%),radial-gradient(circle_at_86%_0%,rgba(4,98,65,0.11),transparent_24%),linear-gradient(180deg,rgba(255,255,255,0.34),rgba(242,239,231,0.96))]" />
        <div className="relative mx-auto max-w-7xl">
          <div className="grid gap-6 lg:grid-cols-[1.12fr_0.88fr]">
            <RevealOnScroll>
              <div className="overflow-hidden rounded-[36px] border border-black/8 bg-white/82 p-7 shadow-[0_20px_46px_rgba(15,39,28,0.10)] backdrop-blur-sm md:p-9">
                <p className="text-xs font-bold uppercase tracking-[0.24em] text-lifewood-castleton">Philanthropy & Impact</p>
                <h1 className="mt-4 max-w-3xl text-[3rem] font-black leading-[0.92] tracking-[-0.04em] text-black sm:text-[4.2rem] lg:text-[5.2rem]">
                  We build impact the same way we build systems: intentionally, locally, and for the long term.
                </h1>
                <p className="mt-6 max-w-2xl text-lg leading-8 text-black/72 sm:text-[1.15rem]">
                  Lifewood directs investment into education, workforce readiness, and developmental infrastructure that can create durable benefit across Africa and the Indian sub-continent.
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <button onClick={() => onNavigate(Page.CONTACT)} className="inline-flex items-center gap-2 rounded-full bg-lifewood-saffron px-6 py-3 text-sm font-bold text-lifewood-darkSerpent transition hover:bg-lifewood-earth">
                    Partner With Us <ArrowRight className="h-4 w-4" />
                  </button>
                  <div className="inline-flex items-center rounded-full border border-lifewood-darkSerpent/14 bg-transparent px-5 py-3 text-sm font-semibold text-lifewood-darkSerpent">
                    Regional partnerships across 20 active locations
                  </div>
                </div>
              </div>
            </RevealOnScroll>
            <RevealOnScroll delay={90}>
              <div className="grid gap-4">
                <div className="overflow-hidden rounded-[32px] border border-black/8 bg-[#0d1d17] p-6 text-white shadow-[0_18px_38px_rgba(6,30,21,0.18)]">
                  <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-lifewood-saffron/90">
                    <Globe2 className="h-3.5 w-3.5" /> Vision
                  </p>
                  <p className="mt-4 text-[1.9rem] font-semibold leading-[1.06] md:text-[2.25rem]">
                    Investment should unlock social progress and environmental renewal, not temporary visibility.
                  </p>
                  <p className="mt-4 text-sm leading-7 text-white/72 md:text-[0.98rem]">
                    Our philanthropy model combines measurable impact, local partnerships, and long-term capability building.
                  </p>
                </div>
                <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
                  {principleCards.map(({ icon: Icon, title, copy }) => (
                    <div key={title} className="rounded-[28px] border border-black/8 bg-white/82 p-5 shadow-[0_14px_26px_rgba(15,39,28,0.08)]">
                      <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-lifewood-seasalt text-lifewood-castleton">
                        <Icon className="h-4 w-4" />
                      </span>
                      <p className="mt-4 text-base font-bold text-black/86">{title}</p>
                      <p className="mt-2 text-sm leading-7 text-black/64">{copy}</p>
                    </div>
                  ))}
                </div>
              </div>
            </RevealOnScroll>
          </div>
        </div>
      </section>

      <section className="relative mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid gap-5 lg:grid-cols-[0.88fr_1.12fr]">
          <RevealOnScroll>
            <div className="rounded-[34px] border border-black/8 bg-[#10231b] p-6 text-white shadow-[0_18px_34px_rgba(4,31,20,0.16)] md:p-7">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-lifewood-saffron">Impact Lens</p>
              <p className="mt-4 text-[1.8rem] font-semibold leading-[1.08] md:text-[2.35rem]">
                Sustainable impact needs systems, not isolated acts of support.
              </p>
              <p className="mt-4 text-sm leading-7 text-white/72 md:text-[0.98rem]">
                We combine enterprise capability with intentional social investment so communities can access employment, training, and long-term advancement opportunities.
              </p>
            </div>
          </RevealOnScroll>
          <RevealOnScroll delay={80}>
            <div className="overflow-hidden rounded-[34px] border border-black/8 bg-white/84 shadow-[0_18px_30px_rgba(15,39,28,0.08)]">
              <div className="grid gap-0 md:grid-cols-2">
                <img src={focusAreasImage} alt="Community learning and partnership" className="h-64 w-full object-cover md:h-full" />
                <div className="p-6 md:p-8">
                  <p className="text-[0.72rem] font-bold uppercase tracking-[0.2em] text-lifewood-castleton">Focus Areas</p>
                  <div className="mt-5 space-y-4">
                    <div><p className="text-lg font-semibold text-black/88">Workforce Access</p><p className="mt-1 text-sm leading-7 text-black/64">Creating viable entry points into meaningful paid work.</p></div>
                    <div><p className="text-lg font-semibold text-black/88">Training Infrastructure</p><p className="mt-1 text-sm leading-7 text-black/64">Building capability through structured learning and applied experience.</p></div>
                    <div><p className="text-lg font-semibold text-black/88">Community Progression</p><p className="mt-1 text-sm leading-7 text-black/64">Supporting wage growth, career movement, and broader long-term benefit.</p></div>
                  </div>
                </div>
              </div>
            </div>
          </RevealOnScroll>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <RevealOnScroll>
          <div className="overflow-hidden rounded-[36px] border border-lifewood-darkSerpent/10 bg-white shadow-sm lifewood-impact-map">
            <div className="flex flex-col gap-3 border-b border-lifewood-darkSerpent/10 px-6 py-5 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-[0.72rem] font-bold uppercase tracking-[0.22em] text-lifewood-castleton">Active Footprint</p>
                <h2 className="mt-2 text-2xl font-bold md:text-3xl">Impact regions currently in motion</h2>
              </div>
              <p className="max-w-xl text-sm leading-7 text-lifewood-darkSerpent/68">
                Explore the current partnership regions where Lifewood philanthropy and community programs are active.
              </p>
            </div>
            <div className="relative h-[460px] overflow-hidden rounded-b-[36px]"><div ref={mapRef} className="h-full w-full" style={{ zIndex: 0 }}></div></div>
          </div>
        </RevealOnScroll>
      </section>

      <section className="bg-white py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <RevealOnScroll>
            <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-[0.72rem] font-bold uppercase tracking-[0.22em] text-lifewood-castleton">How We Work</p>
                <h2 className="mt-2 text-3xl font-bold md:text-5xl">From partnership to long-term expansion</h2>
              </div>
              <p className="max-w-2xl text-base leading-relaxed text-lifewood-darkSerpent/70 md:text-lg">
                Hover each stage to reveal how Lifewood structures philanthropic activity from regional entry to durable community outcomes.
              </p>
            </div>
          </RevealOnScroll>
          <div className="overflow-hidden rounded-2xl border border-lifewood-darkSerpent/12">
            {impactProgramRows.map((row, index) => (
              <RevealOnScroll delay={80 + index * 80} key={row.title}>
                <article className={`group relative overflow-hidden bg-white px-5 py-6 transition-all duration-300 ease-out md:px-8 ${index > 0 ? 'border-t border-lifewood-darkSerpent/12' : ''}`}>
                  <div className="flex min-h-[118px] items-center justify-center transition-all duration-300 ease-out group-hover:min-h-[210px] md:min-h-[132px] md:group-hover:min-h-[220px]">
                    <h3 className="text-center text-2xl font-semibold leading-none transition-all duration-300 ease-out group-hover:opacity-0 group-hover:-translate-y-2">{row.title}</h3>
                  </div>
                  <div className="pointer-events-none absolute inset-x-5 top-1/2 z-10 -translate-y-1/2 opacity-0 transition-all duration-300 ease-out group-hover:pointer-events-auto group-hover:opacity-100 md:inset-x-8">
                    {row.reverse ? (
                      <div className="grid grid-cols-1 items-center gap-5 md:grid-cols-12 md:gap-7">
                        <div className="md:col-span-4"><div className="overflow-hidden rounded-md"><img src={row.image} alt={row.alt} className="h-36 w-full scale-[1.04] rounded-md object-cover opacity-0 transition-all duration-500 ease-out group-hover:scale-100 group-hover:opacity-100 md:h-40" /></div></div>
                        <div className="md:col-span-5"><p className="translate-y-1 text-sm leading-relaxed text-lifewood-darkSerpent/74 opacity-0 transition-all delay-75 duration-300 ease-out group-hover:translate-y-0 group-hover:opacity-100 md:text-[0.95rem]">{row.description}</p></div>
                        <div className="md:col-span-3 md:text-right"><h3 className="translate-y-1 text-2xl font-semibold leading-none opacity-0 transition-all delay-100 duration-300 ease-out group-hover:translate-y-0 group-hover:opacity-100">{row.title}</h3></div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 items-center gap-5 md:grid-cols-12 md:gap-7">
                        <div className="md:col-span-2"><h3 className="translate-y-1 text-2xl font-semibold leading-none opacity-0 transition-all delay-100 duration-300 ease-out group-hover:translate-y-0 group-hover:opacity-100">{row.title}</h3></div>
                        <div className="md:col-span-5"><p className="translate-y-1 text-sm leading-relaxed text-lifewood-darkSerpent/74 opacity-0 transition-all delay-75 duration-300 ease-out group-hover:translate-y-0 group-hover:opacity-100 md:text-[0.95rem]">{row.description}</p></div>
                        <div className="md:col-span-5"><div className="overflow-hidden rounded-md"><img src={row.image} alt={row.alt} className="h-36 w-full scale-[1.04] rounded-md object-cover opacity-0 transition-all duration-500 ease-out group-hover:scale-100 group-hover:opacity-100 md:h-40" /></div></div>
                      </div>
                    )}
                  </div>
                </article>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <RevealOnScroll>
          <div className="rounded-3xl border border-lifewood-darkSerpent/10 bg-white p-8 shadow-sm md:p-10">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <h2 className="text-2xl font-bold md:text-3xl">Partnership Regions</h2>
                <p className="mt-3 text-sm text-lifewood-darkSerpent/72 md:text-base">Active philanthropy and impact expansion currently includes:</p>
              </div>
              <p className="max-w-xl text-sm leading-7 text-lifewood-darkSerpent/65">
                Our footprint continues to grow through region-specific partnerships and long-term capability building.
              </p>
            </div>
            <div className="mt-6 overflow-hidden rounded-2xl border border-lifewood-darkSerpent/10 bg-lifewood-seasalt py-3">
              <ScrollVelocity texts={countryRows} velocity={24} className="px-2.5 uppercase text-lifewood-darkSerpent/88" damping={52} stiffness={360} numCopies={5} scrollerClassName="scroller scroller--compact" />
            </div>
          </div>
        </RevealOnScroll>
      </section>

      <section className="bg-lifewood-darkSerpent py-16 text-white">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-4 sm:px-6 lg:flex-row lg:items-end lg:px-8">
          <div>
            <p className="text-[0.72rem] font-bold uppercase tracking-[0.2em] text-lifewood-saffron">Shared Outcomes</p>
            <h2 className="mt-3 text-3xl font-bold md:text-4xl">Working with new intelligence for a better world.</h2>
            <p className="mt-3 max-w-2xl text-sm text-white/80 md:text-base">
              We provide global Data Engineering Services to enable AI solutions while investing in the human systems that make growth sustainable.
            </p>
          </div>
          <button onClick={() => onNavigate(Page.CONTACT)} className="inline-flex items-center gap-2 rounded-full bg-lifewood-saffron px-6 py-3 font-bold text-lifewood-darkSerpent transition hover:bg-lifewood-earth">
            Contact Us <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </section>
    </div>
  );
};

export default PhilImpact;
