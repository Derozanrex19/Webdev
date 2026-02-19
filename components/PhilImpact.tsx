import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight, Globe2, Handshake, Rocket } from 'lucide-react';
import ScrollVelocity from './ScrollVelocity';

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
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

const countryRows = [
  'SOUTH AFRICA • NIGERIA • REPUBLIC OF THE CONGO • DEMOCRATIC REPUBLIC OF THE CONGO • GHANA • MADAGASCAR • BENIN • UGANDA • KENYA',
  'IVORY COAST • EGYPT • ETHIOPIA • NIGER • TANZANIA • NAMIBIA • ZAMBIA • ZIMBABWE • LIBERIA • SIERRA LEONE • BANGLADESH',
];

const impactLocations: { name: string; coords: [number, number] }[] = [
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

const PhilImpact: React.FC = () => {
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
      mapInstance.current = L.map(mapRef.current, { zoomControl: true, worldCopyJump: true }).setView([2, 22], 3);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(mapInstance.current);

      const markerIcon = L.divIcon({
        className: 'lifewood-impact-pin',
        html: `<span style="display:block;width:12px;height:12px;border-radius:9999px;background:#ffb347;border:2px solid #133020;box-shadow:0 0 0 2px rgba(255,255,255,0.65);"></span>`,
        iconSize: [12, 12],
        iconAnchor: [6, 6],
      });

      impactLocations.forEach((location) => {
        L.marker(location.coords, { icon: markerIcon })
          .addTo(mapInstance.current)
          .bindPopup(`<b>${location.name}</b><br>Active impact region`);
      });

      const bounds = L.latLngBounds(impactLocations.map((location) => location.coords));
      mapInstance.current.fitBounds(bounds, { padding: [35, 35], maxZoom: 4 });

      window.setTimeout(() => {
        if (!mapInstance.current) return;
        mapInstance.current.invalidateSize();
        mapInstance.current.fitBounds(bounds, { padding: [35, 35], maxZoom: 4 });
      }, 250);
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
    <div className="bg-lifewood-seasalt text-lifewood-darkSerpent">
      <section className="relative overflow-hidden bg-lifewood-darkSerpent text-white">
        <img
          src="https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=2200&h=1200&dpr=2"
          alt="Community workforce collaboration"
          className="absolute inset-0 h-full w-full object-cover opacity-14"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-lifewood-darkSerpent via-lifewood-darkSerpent/90 to-lifewood-darkSerpent/75"></div>

        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <RevealOnScroll>
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.22em] text-lifewood-saffron">Philanthropy & Impact</p>
            <h1 className="max-w-4xl text-4xl font-extrabold leading-tight md:text-5xl">Philanthropy and Impact</h1>
            <p className="mt-5 max-w-3xl text-base leading-relaxed text-white/82 md:text-lg">
              We direct resources into education and developmental projects that create lasting change. Our approach
              goes beyond giving: it builds sustainable growth and empowers communities for the future.
            </p>
          </RevealOnScroll>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <RevealOnScroll>
          <div className="mx-auto max-w-5xl rounded-3xl border border-lifewood-darkSerpent/10 bg-white p-8 text-center shadow-sm md:p-10">
            <p className="mx-auto max-w-4xl text-xl font-medium leading-relaxed text-lifewood-darkSerpent/80 md:text-2xl">
              Our vision is of a world where financial investment plays a central role in solving the social and
              environmental challenges facing the global community, specifically in Africa and the Indian sub-continent.
            </p>
          </div>
        </RevealOnScroll>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-14 sm:px-6 lg:px-8">
        <RevealOnScroll>
          <h2 className="text-center text-3xl font-bold md:text-4xl">Transforming Communities Worldwide</h2>
          <p className="mx-auto mt-4 max-w-4xl text-center text-base leading-relaxed text-lifewood-darkSerpent/72 md:text-xl">
            Through purposeful partnerships and sustainable investment, we empower communities across Africa and the
            Indian sub-continent to create lasting economic and social transformation.
          </p>
        </RevealOnScroll>

        <RevealOnScroll delay={120}>
          <div className="mt-6 mb-6 rounded-2xl border border-lifewood-darkSerpent/10 bg-white p-6 md:p-8">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-lifewood-castleton">Impact</p>
            <p className="mt-2 text-sm leading-relaxed text-lifewood-darkSerpent/75 md:text-base">
              We combine enterprise capability with intentional social investment so communities can access employment,
              training, and long-term advancement opportunities.
            </p>
          </div>
        </RevealOnScroll>

        <RevealOnScroll>
          <div className="overflow-hidden rounded-3xl border border-lifewood-darkSerpent/10 bg-white shadow-sm">
            <div className="relative h-[440px] overflow-hidden rounded-2xl">
              <div
                ref={mapRef}
                className="h-full w-full"
                style={{ zIndex: 0 }}
              ></div>
            </div>
          </div>
        </RevealOnScroll>
      </section>

      <section className="bg-white py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <RevealOnScroll delay={80}>
              <article className="h-full overflow-hidden rounded-2xl border border-lifewood-darkSerpent/10 bg-white shadow-sm transition-shadow duration-300 hover:shadow-lg">
                <img
                  src="https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=1400&h=900&dpr=2"
                  alt="Partnerships"
                  className="h-44 w-full object-cover"
                />
                <div className="p-7">
                  <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-full bg-lifewood-seasalt">
                    <Handshake className="h-5 w-5 text-lifewood-castleton" />
                  </div>
                  <h3 className="text-xl font-bold">Partnership Application</h3>
                  <p className="mt-3 text-sm leading-relaxed text-lifewood-darkSerpent/75">
                    In partnership with philanthropic organizations, Lifewood continues to expand operations across Africa
                    and the Indian sub-continent.
                  </p>
                </div>
              </article>
            </RevealOnScroll>

            <RevealOnScroll delay={160}>
              <article className="h-full overflow-hidden rounded-2xl border border-lifewood-darkSerpent/10 bg-white shadow-sm transition-shadow duration-300 hover:shadow-lg">
                <img
                  src="https://images.pexels.com/photos/3184328/pexels-photo-3184328.jpeg?auto=compress&cs=tinysrgb&w=1400&h=900&dpr=2"
                  alt="Application"
                  className="h-44 w-full object-cover"
                />
                <div className="p-7">
                  <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-full bg-lifewood-seasalt">
                    <Rocket className="h-5 w-5 text-lifewood-castleton" />
                  </div>
                  <h3 className="text-xl font-bold">Application</h3>
                  <p className="mt-3 text-sm leading-relaxed text-lifewood-darkSerpent/75">
                    This requires the application of our methods and operational experience for the development of people
                    in under-resourced economies.
                  </p>
                </div>
              </article>
            </RevealOnScroll>

            <RevealOnScroll delay={240}>
              <article className="h-full overflow-hidden rounded-2xl border border-lifewood-darkSerpent/10 bg-white shadow-sm transition-shadow duration-300 hover:shadow-lg">
                <img
                  src="https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=1400&h=900&dpr=2"
                  alt="Expanding"
                  className="h-44 w-full object-cover"
                />
                <div className="p-7">
                  <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-full bg-lifewood-seasalt">
                    <Globe2 className="h-5 w-5 text-lifewood-castleton" />
                  </div>
                  <h3 className="text-xl font-bold">Expanding</h3>
                  <p className="mt-3 text-sm leading-relaxed text-lifewood-darkSerpent/75">
                    We are expanding access to training, equitable wage structures, and career progression to create
                    sustainable change for long-term community benefit.
                  </p>
                </div>
              </article>
            </RevealOnScroll>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <RevealOnScroll>
          <div className="rounded-3xl border border-lifewood-darkSerpent/10 bg-white p-8 shadow-sm md:p-10">
            <h2 className="text-2xl font-bold md:text-3xl">Partnership Regions</h2>
            <p className="mt-3 text-sm text-lifewood-darkSerpent/72 md:text-base">
              Active philanthropy and impact expansion currently includes:
            </p>
            <div className="mt-6 overflow-hidden rounded-2xl border border-lifewood-darkSerpent/10 bg-lifewood-seasalt py-3">
              <ScrollVelocity
                texts={countryRows}
                velocity={24}
                className="px-2.5 uppercase text-lifewood-darkSerpent/88"
                damping={52}
                stiffness={360}
                numCopies={5}
                scrollerClassName="scroller scroller--compact"
              />
            </div>
          </div>
        </RevealOnScroll>
      </section>

      <section className="bg-lifewood-darkSerpent py-16 text-white">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-4 sm:px-6 lg:flex-row lg:items-center lg:px-8">
          <div>
            <h2 className="text-3xl font-bold md:text-4xl">Working with new intelligence for a better world.</h2>
            <p className="mt-3 text-sm text-white/80 md:text-base">We provide global Data Engineering Services to enable AI solutions.</p>
          </div>
          <button className="inline-flex items-center gap-2 rounded-full bg-lifewood-saffron px-6 py-3 font-bold text-lifewood-darkSerpent transition hover:bg-lifewood-earth">
            Contact Us <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </section>
    </div>
  );
};

export default PhilImpact;
