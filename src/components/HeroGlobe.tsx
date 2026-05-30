import { useEffect, useRef } from "react";
import createGlobe from "cobe";

/**
 * HeroGlobe — the USDX signature, built on cobe v2 (5KB WebGL globe).
 * A light, white-and-cyan dotted Earth telling USDX's story: value moving along
 * SOUTH–SOUTH corridors between emerging-market cities (Jakarta, Lagos, Mumbai,
 * Nairobi, São Paulo, Mexico City…). City labels make the identity legible;
 * "money" dots stream along the routes. Drag to spin (mouse + touch).
 *
 * Label projection uses cobe's own focus convention (locationToAngles):
 * a marker at (lat,lng) is front-centre when phi = 3π/2 − lngRad, theta = latRad.
 *
 * Respects prefers-reduced-motion and downgrades on low-power / mobile devices.
 */

const CYAN: [number, number, number] = [0.118, 0.682, 0.835]; // #1eaed5
const GLOW: [number, number, number] = [0.82, 0.92, 1];

// Emerging-market cities (lat, lng).
const CITIES: [number, number][] = [
  [-6.2, 106.8], // 0 Jakarta
  [6.5, 3.4], // 1 Lagos
  [19.0, 72.8], // 2 Mumbai
  [-1.3, 36.8], // 3 Nairobi
  [-23.5, -46.6], // 4 São Paulo
  [19.4, -99.1], // 5 Mexico City
  [14.6, 121.0], // 6 Manila
  [41.0, 28.9], // 7 Istanbul
];
const NAMES = ["Jakarta", "Lagos", "Mumbai", "Nairobi", "São Paulo", "Mexico City", "Manila", "Istanbul"];

// South–south corridors (emerging market ↔ emerging market) [from, to].
const FLOWS: [number, number][] = [
  [0, 1], // Jakarta ↔ Lagos
  [2, 3], // Mumbai ↔ Nairobi
  [1, 4], // Lagos ↔ São Paulo
  [0, 2], // Jakarta ↔ Mumbai
  [3, 7], // Nairobi ↔ Istanbul
  [4, 5], // São Paulo ↔ Mexico City
  [6, 0], // Manila ↔ Jakarta
];

/** Great-circle interpolation between two [lat,lng] points. */
function interp(a: [number, number], b: [number, number], t: number): [number, number] {
  const toXYZ = ([lat, lng]: [number, number]) => {
    const la = (lat * Math.PI) / 180;
    const lo = (lng * Math.PI) / 180;
    return [Math.cos(la) * Math.cos(lo), Math.cos(la) * Math.sin(lo), Math.sin(la)];
  };
  const A = toXYZ(a);
  const B = toXYZ(b);
  const dot = Math.max(-1, Math.min(1, A[0] * B[0] + A[1] * B[1] + A[2] * B[2]));
  const omega = Math.acos(dot);
  if (omega < 1e-6) return a;
  const s = Math.sin(omega);
  const s1 = Math.sin((1 - t) * omega) / s;
  const s2 = Math.sin(t * omega) / s;
  const x = s1 * A[0] + s2 * B[0];
  const y = s1 * A[1] + s2 * B[1];
  const z = s1 * A[2] + s2 * B[2];
  return [
    (Math.atan2(z, Math.hypot(x, y)) * 180) / Math.PI,
    (Math.atan2(y, x) * 180) / Math.PI,
  ];
}

/** Project a [lat,lng] to canvas-fraction coords given cobe's phi/theta. */
function project(lat: number, lng: number, phi: number, theta: number, scale: number) {
  const latR = (lat * Math.PI) / 180;
  const lam = (lng * Math.PI) / 180 + phi + Math.PI / 2;
  const x = Math.cos(latR) * Math.sin(lam);
  const y = Math.sin(latR);
  const z = Math.cos(latR) * Math.cos(lam);
  const yT = y * Math.cos(theta) - z * Math.sin(theta);
  const zT = y * Math.sin(theta) + z * Math.cos(theta);
  return { x: 0.5 + x * 0.5 * scale, y: 0.5 - yT * 0.5 * scale, z: zT };
}

export default function HeroGlobe() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const labelEls = useRef<(HTMLSpanElement | null)[]>([]);
  const coinEls = useRef<(HTMLImageElement | null)[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const lowPower =
      (typeof navigator !== "undefined" && (navigator.hardwareConcurrency || 8) <= 4) ||
      window.matchMedia("(max-width: 768px)").matches;

    const dpr = Math.min(window.devicePixelRatio || 1, lowPower ? 1.5 : 2);
    const size = canvas.clientWidth || 480;
    const LABEL_SCALE = 0.9; // globe radius as fraction of canvas (calibrated to cobe)

    let phi = 3.6; // start facing the Indian Ocean → Africa/Asia (Global South)
    let theta = 0.15;
    let frame = 0;
    let interacting = false;
    let lastX = 0;
    let lastY = 0;
    let velPhi = 0;

    const travellers = FLOWS.map(([a, b], i) => ({
      a: CITIES[a],
      b: CITIES[b],
      t: i / FLOWS.length,
      speed: 0.004 + (i % 3) * 0.001,
    }));

    const buildMarkers = () => {
      // city anchors only — the moving "money" is rendered as USDX coin icons (DOM)
      return CITIES.map((c, i) => {
        const pulse = (Math.sin(frame * 0.05 + i * 1.3) * 0.5 + 0.5) * 0.02;
        return { location: c, size: 0.045 + pulse };
      });
    };

    const positionCoins = () => {
      const w = canvas.clientWidth;
      for (let i = 0; i < travellers.length; i++) {
        const el = coinEls.current[i];
        if (!el) continue;
        const tr = travellers[i];
        const loc = interp(tr.a, tr.b, tr.t);
        const p = project(loc[0], loc[1], phi, theta, LABEL_SCALE);
        if (p.z <= 0.12) {
          el.style.opacity = "0";
          continue;
        }
        const sc = 0.72 + p.z * 0.32; // smaller near the limb, larger when facing us
        el.style.opacity = String(Math.min(1, (p.z - 0.12) / 0.4));
        el.style.left = `${p.x * w}px`;
        el.style.top = `${p.y * w}px`;
        el.style.transform = `translate(-50%, -50%) scale(${sc})`;
      }
    };

    const positionLabels = () => {
      const w = canvas.clientWidth;
      for (let i = 0; i < CITIES.length; i++) {
        const el = labelEls.current[i];
        if (!el) continue;
        const p = project(CITIES[i][0], CITIES[i][1], phi, theta, LABEL_SCALE);
        if (p.z <= 0.18) {
          el.style.opacity = "0";
          continue;
        }
        el.style.opacity = String(Math.min(1, (p.z - 0.18) / 0.45));
        el.style.left = `${p.x * w}px`;
        el.style.top = `${p.y * w}px`;
      }
    };

    const globe = createGlobe(canvas, {
      devicePixelRatio: dpr,
      width: size * dpr,
      height: size * dpr,
      phi,
      theta,
      dark: 0,
      diffuse: 1.2,
      mapSamples: lowPower ? 9000 : 16000,
      mapBrightness: 5.2,
      mapBaseBrightness: 0.04,
      baseColor: [1, 1, 1],
      markerColor: CYAN,
      glowColor: GLOW,
      arcColor: CYAN,
      arcWidth: 0.45,
      arcHeight: 0.4,
      markerElevation: 0,
      arcs: FLOWS.map(([a, b]) => ({ from: CITIES[a], to: CITIES[b] })),
      markers: buildMarkers(),
      opacity: 0.95,
    });

    // drag to rotate (mouse + touch)
    const onDown = (e: PointerEvent) => {
      interacting = true;
      lastX = e.clientX;
      lastY = e.clientY;
      canvas.style.cursor = "grabbing";
    };
    const onUp = () => {
      interacting = false;
      canvas.style.cursor = "grab";
    };
    const onMove = (e: PointerEvent) => {
      if (!interacting) return;
      const dx = e.clientX - lastX;
      phi += dx / 150;
      theta = Math.max(-0.7, Math.min(0.7, theta + (e.clientY - lastY) / 200));
      velPhi = dx / 150;
      lastX = e.clientX;
      lastY = e.clientY;
      if (reduced) {
        globe.update({ phi, theta, markers: buildMarkers() });
        positionLabels();
        positionCoins();
      }
    };
    canvas.addEventListener("pointerdown", onDown);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);

    positionLabels();
    positionCoins();

    let raf = 0;
    if (!reduced) {
      const loop = () => {
        if (!interacting) {
          phi += 0.0016 + velPhi;
          velPhi *= 0.92;
        }
        frame++;
        travellers.forEach((tr) => {
          tr.t += tr.speed;
          if (tr.t > 1) tr.t -= 1;
        });
        globe.update({ phi, theta, markers: buildMarkers() });
        positionLabels();
        positionCoins();
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);
    }

    let resizeTimer: ReturnType<typeof setTimeout> | null = null;
    const ro = new ResizeObserver(() => {
      if (resizeTimer) clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        const s = canvas.clientWidth;
        if (s) {
          globe.update({ width: s * dpr, height: s * dpr });
          positionLabels();
          positionCoins();
        }
      }, 150);
    });
    ro.observe(canvas);

    return () => {
      if (raf) cancelAnimationFrame(raf);
      if (resizeTimer) clearTimeout(resizeTimer);
      ro.disconnect();
      canvas.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      globe.destroy();
    };
  }, []);

  return (
    <div className="absolute inset-0">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full"
        style={{ aspectRatio: "1", cursor: "grab", touchAction: "none" }}
        aria-hidden="true"
      />
      {/* travelling USDX coins (money in motion) */}
      <div className="absolute inset-0 pointer-events-none">
        {FLOWS.map((_, i) => (
          <img
            key={i}
            src="/image/Logo.svg"
            alt=""
            ref={(el) => {
              coinEls.current[i] = el;
            }}
            className="absolute left-0 top-0 h-[22px] w-[22px] rounded-full bg-white ring-1 ring-primary/30 shadow-md shadow-primary/30 will-change-transform"
            style={{ opacity: 0, transform: "translate(-50%, -50%)" }}
          />
        ))}
      </div>

      {/* city labels */}
      <div className="absolute inset-0 pointer-events-none">
        {NAMES.map((name, i) => (
          <span
            key={name}
            ref={(el) => {
              labelEls.current[i] = el;
            }}
            className="absolute left-0 top-0 -translate-x-1/2 -translate-y-[170%] whitespace-nowrap rounded-full bg-primary px-2 py-[3px] text-[10px] font-semibold leading-none text-white shadow-sm transition-opacity duration-200 will-change-transform"
            style={{ opacity: 0 }}
          >
            {name}
          </span>
        ))}
      </div>
    </div>
  );
}
