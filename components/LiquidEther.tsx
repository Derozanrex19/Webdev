import { useEffect, useRef, type CSSProperties } from 'react';
import * as THREE from 'three';
import './LiquidEther.css';

type LiquidEtherProps = {
  mouseForce?: number;
  cursorSize?: number;
  isViscous?: boolean;
  viscous?: number;
  iterationsViscous?: number;
  iterationsPoisson?: number;
  dt?: number;
  BFECC?: boolean;
  resolution?: number;
  isBounce?: boolean;
  colors?: string[];
  style?: CSSProperties;
  className?: string;
  autoDemo?: boolean;
  autoSpeed?: number;
  autoIntensity?: number;
  takeoverDuration?: number;
  autoResumeDelay?: number;
  autoRampDuration?: number;
};

export default function LiquidEther({
  mouseForce = 20,
  cursorSize = 100,
  isViscous = false,
  viscous = 30,
  iterationsViscous = 24,
  iterationsPoisson = 24,
  dt = 0.014,
  BFECC = true,
  resolution = 0.45,
  isBounce = false,
  colors = ['#046241', '#F4A933', '#133020'],
  style = {},
  className = '',
  autoDemo = true,
  autoSpeed = 0.5,
  autoIntensity = 2.2,
  takeoverDuration = 0.25,
  autoResumeDelay = 1000,
  autoRampDuration = 0.6
}: LiquidEtherProps) {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const webglRef = useRef<any>(null);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);
  const rafRef = useRef<number | null>(null);
  const intersectionObserverRef = useRef<IntersectionObserver | null>(null);
  const isVisibleRef = useRef(true);
  const resizeRafRef = useRef<number | null>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    function makePaletteTexture(stops: string[]) {
      const arr = Array.isArray(stops) && stops.length > 0 ? (stops.length === 1 ? [stops[0], stops[0]] : stops) : ['#ffffff', '#ffffff'];
      const w = arr.length;
      const data = new Uint8Array(w * 4);

      for (let i = 0; i < w; i++) {
        const c = new THREE.Color(arr[i]);
        data[i * 4 + 0] = Math.round(c.r * 255);
        data[i * 4 + 1] = Math.round(c.g * 255);
        data[i * 4 + 2] = Math.round(c.b * 255);
        data[i * 4 + 3] = 255;
      }

      const tex = new THREE.DataTexture(data, w, 1, THREE.RGBAFormat);
      tex.magFilter = THREE.LinearFilter;
      tex.minFilter = THREE.LinearFilter;
      tex.wrapS = THREE.ClampToEdgeWrapping;
      tex.wrapT = THREE.ClampToEdgeWrapping;
      tex.generateMipmaps = false;
      tex.needsUpdate = true;
      return tex;
    }

    const paletteTex = makePaletteTexture(colors);
    const bgVec4 = new THREE.Vector4(0, 0, 0, 0);

    class CommonClass {
      width = 0;
      height = 0;
      aspect = 1;
      pixelRatio = 1;
      renderer: THREE.WebGLRenderer | null = null;
      clock: THREE.Clock | null = null;
      time = 0;
      delta = 0;
      container: HTMLDivElement | null = null;

      init(container: HTMLDivElement) {
        this.container = container;
        this.pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
        this.resize();
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.renderer.autoClear = false;
        this.renderer.setClearColor(new THREE.Color(0x000000), 0);
        this.renderer.setPixelRatio(this.pixelRatio);
        this.renderer.setSize(this.width, this.height);
        this.renderer.domElement.style.width = '100%';
        this.renderer.domElement.style.height = '100%';
        this.renderer.domElement.style.display = 'block';
        this.clock = new THREE.Clock();
        this.clock.start();
      }

      resize() {
        if (!this.container) return;
        const rect = this.container.getBoundingClientRect();
        this.width = Math.max(1, Math.floor(rect.width));
        this.height = Math.max(1, Math.floor(rect.height));
        this.aspect = this.width / this.height;
        if (this.renderer) this.renderer.setSize(this.width, this.height, false);
      }

      update() {
        if (!this.clock) return;
        this.delta = this.clock.getDelta();
        this.time += this.delta;
      }
    }

    const Common = new CommonClass();

    class MouseClass {
      mouseMoved = false;
      coords = new THREE.Vector2();
      coordsOld = new THREE.Vector2();
      diff = new THREE.Vector2();
      timer: number | null = null;
      container: HTMLDivElement | null = null;
      listenerTarget: Window | null = null;
      docTarget: Document | null = null;
      isHoverInside = false;
      hasUserControl = false;
      isAutoActive = false;
      autoIntensity = 2;
      takeoverActive = false;
      takeoverStartTime = 0;
      takeoverDuration = 0.25;
      takeoverFrom = new THREE.Vector2();
      takeoverTo = new THREE.Vector2();
      onInteract: (() => void) | null = null;

      _onMouseMove = (event: MouseEvent) => this.onDocumentMouseMove(event);
      _onTouchStart = (event: TouchEvent) => this.onDocumentTouchStart(event);
      _onTouchMove = (event: TouchEvent) => this.onDocumentTouchMove(event);
      _onTouchEnd = () => this.onTouchEnd();
      _onDocumentLeave = () => this.onDocumentLeave();

      init(container: HTMLDivElement) {
        this.container = container;
        this.docTarget = container.ownerDocument || null;
        const defaultView = this.docTarget?.defaultView || window;
        if (!defaultView) return;

        this.listenerTarget = defaultView;
        this.listenerTarget.addEventListener('mousemove', this._onMouseMove);
        this.listenerTarget.addEventListener('touchstart', this._onTouchStart, { passive: true });
        this.listenerTarget.addEventListener('touchmove', this._onTouchMove, { passive: true });
        this.listenerTarget.addEventListener('touchend', this._onTouchEnd);
        this.docTarget?.addEventListener('mouseleave', this._onDocumentLeave);
      }

      dispose() {
        this.listenerTarget?.removeEventListener('mousemove', this._onMouseMove);
        this.listenerTarget?.removeEventListener('touchstart', this._onTouchStart);
        this.listenerTarget?.removeEventListener('touchmove', this._onTouchMove);
        this.listenerTarget?.removeEventListener('touchend', this._onTouchEnd);
        this.docTarget?.removeEventListener('mouseleave', this._onDocumentLeave);
      }

      isPointInside(clientX: number, clientY: number) {
        if (!this.container) return false;
        const rect = this.container.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) return false;
        return clientX >= rect.left && clientX <= rect.right && clientY >= rect.top && clientY <= rect.bottom;
      }

      updateHoverState(clientX: number, clientY: number) {
        this.isHoverInside = this.isPointInside(clientX, clientY);
        return this.isHoverInside;
      }

      setCoords(x: number, y: number) {
        if (!this.container) return;
        if (this.timer) window.clearTimeout(this.timer);
        const rect = this.container.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) return;
        const nx = (x - rect.left) / rect.width;
        const ny = (y - rect.top) / rect.height;
        this.coords.set(nx * 2 - 1, -(ny * 2 - 1));
        this.mouseMoved = true;
        this.timer = window.setTimeout(() => {
          this.mouseMoved = false;
        }, 100);
      }

      setNormalized(nx: number, ny: number) {
        this.coords.set(nx, ny);
        this.mouseMoved = true;
      }

      onDocumentMouseMove(event: MouseEvent) {
        if (!this.updateHoverState(event.clientX, event.clientY)) return;
        this.onInteract?.();
        if (this.isAutoActive && !this.hasUserControl && !this.takeoverActive) {
          if (!this.container) return;
          const rect = this.container.getBoundingClientRect();
          if (rect.width === 0 || rect.height === 0) return;
          const nx = (event.clientX - rect.left) / rect.width;
          const ny = (event.clientY - rect.top) / rect.height;
          this.takeoverFrom.copy(this.coords);
          this.takeoverTo.set(nx * 2 - 1, -(ny * 2 - 1));
          this.takeoverStartTime = performance.now();
          this.takeoverActive = true;
          this.hasUserControl = true;
          this.isAutoActive = false;
          return;
        }
        this.setCoords(event.clientX, event.clientY);
        this.hasUserControl = true;
      }

      onDocumentTouchStart(event: TouchEvent) {
        if (event.touches.length !== 1) return;
        const t = event.touches[0];
        if (!this.updateHoverState(t.clientX, t.clientY)) return;
        this.onInteract?.();
        this.setCoords(t.clientX, t.clientY);
        this.hasUserControl = true;
      }

      onDocumentTouchMove(event: TouchEvent) {
        if (event.touches.length !== 1) return;
        const t = event.touches[0];
        if (!this.updateHoverState(t.clientX, t.clientY)) return;
        this.onInteract?.();
        this.setCoords(t.clientX, t.clientY);
      }

      onTouchEnd() {
        this.isHoverInside = false;
      }

      onDocumentLeave() {
        this.isHoverInside = false;
      }

      update() {
        if (this.takeoverActive) {
          const t = (performance.now() - this.takeoverStartTime) / (this.takeoverDuration * 1000);
          if (t >= 1) {
            this.takeoverActive = false;
            this.coords.copy(this.takeoverTo);
            this.coordsOld.copy(this.coords);
            this.diff.set(0, 0);
          } else {
            const k = t * t * (3 - 2 * t);
            this.coords.copy(this.takeoverFrom).lerp(this.takeoverTo, k);
          }
        }
        this.diff.subVectors(this.coords, this.coordsOld);
        this.coordsOld.copy(this.coords);
        if (this.coordsOld.x === 0 && this.coordsOld.y === 0) this.diff.set(0, 0);
        if (this.isAutoActive && !this.takeoverActive) this.diff.multiplyScalar(this.autoIntensity);
      }
    }

    const Mouse = new MouseClass();

    class AutoDriver {
      mouse: MouseClass;
      manager: any;
      enabled: boolean;
      speed: number;
      resumeDelay: number;
      rampDurationMs: number;
      active = false;
      current = new THREE.Vector2(0, 0);
      target = new THREE.Vector2();
      lastTime = performance.now();
      activationTime = 0;
      margin = 0.2;
      tmpDir = new THREE.Vector2();

      constructor(mouse: MouseClass, manager: any, opts: any) {
        this.mouse = mouse;
        this.manager = manager;
        this.enabled = opts.enabled;
        this.speed = opts.speed;
        this.resumeDelay = opts.resumeDelay || 3000;
        this.rampDurationMs = (opts.rampDuration || 0) * 1000;
        this.pickNewTarget();
      }

      pickNewTarget() {
        const r = Math.random;
        this.target.set((r() * 2 - 1) * (1 - this.margin), (r() * 2 - 1) * (1 - this.margin));
      }

      forceStop() {
        this.active = false;
        this.mouse.isAutoActive = false;
      }

      update() {
        if (!this.enabled) return;
        const now = performance.now();
        const idle = now - this.manager.lastUserInteraction;
        if (idle < this.resumeDelay || this.mouse.isHoverInside) {
          if (this.active) this.forceStop();
          return;
        }
        if (!this.active) {
          this.active = true;
          this.current.copy(this.mouse.coords);
          this.lastTime = now;
          this.activationTime = now;
        }
        this.mouse.isAutoActive = true;
        let dtSec = (now - this.lastTime) / 1000;
        this.lastTime = now;
        if (dtSec > 0.2) dtSec = 0.016;
        const dir = this.tmpDir.subVectors(this.target, this.current);
        const dist = dir.length();
        if (dist < 0.01) {
          this.pickNewTarget();
          return;
        }
        dir.normalize();
        let ramp = 1;
        if (this.rampDurationMs > 0) {
          const t = Math.min(1, (now - this.activationTime) / this.rampDurationMs);
          ramp = t * t * (3 - 2 * t);
        }
        const step = this.speed * dtSec * ramp;
        const move = Math.min(step, dist);
        this.current.addScaledVector(dir, move);
        this.mouse.setNormalized(this.current.x, this.current.y);
      }
    }

    const faceVert = `
attribute vec3 position;
uniform vec2 boundarySpace;
varying vec2 uv;
void main() {
  vec3 pos = position;
  vec2 scale = 1.0 - boundarySpace * 2.0;
  pos.xy = pos.xy * scale;
  uv = vec2(0.5) + (pos.xy) * 0.5;
  gl_Position = vec4(pos, 1.0);
}`;

    const lineVert = `
attribute vec3 position;
uniform vec2 px;
varying vec2 uv;
void main() {
  vec3 pos = position;
  uv = 0.5 + pos.xy * 0.5;
  vec2 n = sign(pos.xy);
  pos.xy = abs(pos.xy) - px;
  pos.xy *= n;
  gl_Position = vec4(pos, 1.0);
}`;

    const mouseVert = `
precision highp float;
attribute vec3 position;
attribute vec2 uv;
uniform vec2 center;
uniform vec2 scale;
uniform vec2 px;
varying vec2 vUv;
void main(){
  vec2 pos = position.xy * scale * 2.0 * px + center;
  vUv = uv;
  gl_Position = vec4(pos, 0.0, 1.0);
}`;

    const advectionFrag = `
precision highp float;
uniform sampler2D velocity;
uniform float dt;
uniform bool isBFECC;
uniform vec2 fboSize;
varying vec2 uv;
void main(){
  vec2 ratio = max(fboSize.x, fboSize.y) / fboSize;
  if(!isBFECC){
    vec2 vel = texture2D(velocity, uv).xy;
    vec2 uv2 = uv - vel * dt * ratio;
    vec2 newVel = texture2D(velocity, uv2).xy;
    gl_FragColor = vec4(newVel, 0.0, 0.0);
  } else {
    vec2 spotNew = uv;
    vec2 velOld = texture2D(velocity, uv).xy;
    vec2 spotOld = spotNew - velOld * dt * ratio;
    vec2 velNew1 = texture2D(velocity, spotOld).xy;
    vec2 spotNew2 = spotOld + velNew1 * dt * ratio;
    vec2 error = spotNew2 - spotNew;
    vec2 spotNew3 = spotNew - error / 2.0;
    vec2 vel2 = texture2D(velocity, spotNew3).xy;
    vec2 spotOld2 = spotNew3 - vel2 * dt * ratio;
    vec2 newVel2 = texture2D(velocity, spotOld2).xy;
    gl_FragColor = vec4(newVel2, 0.0, 0.0);
  }
}`;

    const colorFrag = `
precision highp float;
uniform sampler2D velocity;
uniform sampler2D palette;
uniform vec4 bgColor;
varying vec2 uv;
void main(){
  vec2 vel = texture2D(velocity, uv).xy;
  float lenv = clamp(length(vel), 0.0, 1.0);
  vec3 c = texture2D(palette, vec2(lenv, 0.5)).rgb;
  vec3 outRGB = mix(bgColor.rgb, c, lenv);
  float outA = mix(bgColor.a, 1.0, lenv);
  gl_FragColor = vec4(outRGB, outA);
}`;

    const divergenceFrag = `
precision highp float;
uniform sampler2D velocity;
uniform float dt;
uniform vec2 px;
varying vec2 uv;
void main(){
  float x0 = texture2D(velocity, uv-vec2(px.x, 0.0)).x;
  float x1 = texture2D(velocity, uv+vec2(px.x, 0.0)).x;
  float y0 = texture2D(velocity, uv-vec2(0.0, px.y)).y;
  float y1 = texture2D(velocity, uv+vec2(0.0, px.y)).y;
  float divergence = (x1 - x0 + y1 - y0) / 2.0;
  gl_FragColor = vec4(divergence / dt);
}`;

    const externalForceFrag = `
precision highp float;
uniform vec2 force;
varying vec2 vUv;
void main(){
  vec2 circle = (vUv - 0.5) * 2.0;
  float d = 1.0 - min(length(circle), 1.0);
  d *= d;
  gl_FragColor = vec4(force * d, 0.0, 1.0);
}`;

    const poissonFrag = `
precision highp float;
uniform sampler2D pressure;
uniform sampler2D divergence;
uniform vec2 px;
varying vec2 uv;
void main(){
  float p0 = texture2D(pressure, uv + vec2(px.x * 2.0, 0.0)).r;
  float p1 = texture2D(pressure, uv - vec2(px.x * 2.0, 0.0)).r;
  float p2 = texture2D(pressure, uv + vec2(0.0, px.y * 2.0)).r;
  float p3 = texture2D(pressure, uv - vec2(0.0, px.y * 2.0)).r;
  float div = texture2D(divergence, uv).r;
  float newP = (p0 + p1 + p2 + p3) / 4.0 - div;
  gl_FragColor = vec4(newP);
}`;

    const pressureFrag = `
precision highp float;
uniform sampler2D pressure;
uniform sampler2D velocity;
uniform vec2 px;
uniform float dt;
varying vec2 uv;
void main(){
  float p0 = texture2D(pressure, uv + vec2(px.x, 0.0)).r;
  float p1 = texture2D(pressure, uv - vec2(px.x, 0.0)).r;
  float p2 = texture2D(pressure, uv + vec2(0.0, px.y)).r;
  float p3 = texture2D(pressure, uv - vec2(0.0, px.y)).r;
  vec2 v = texture2D(velocity, uv).xy;
  vec2 gradP = vec2(p0 - p1, p2 - p3) * 0.5;
  v = v - gradP * dt;
  gl_FragColor = vec4(v, 0.0, 1.0);
}`;

    const viscousFrag = `
precision highp float;
uniform sampler2D velocity;
uniform sampler2D velocity_new;
uniform float v;
uniform vec2 px;
uniform float dt;
varying vec2 uv;
void main(){
  vec2 old = texture2D(velocity, uv).xy;
  vec2 new0 = texture2D(velocity_new, uv + vec2(px.x * 2.0, 0.0)).xy;
  vec2 new1 = texture2D(velocity_new, uv - vec2(px.x * 2.0, 0.0)).xy;
  vec2 new2 = texture2D(velocity_new, uv + vec2(0.0, px.y * 2.0)).xy;
  vec2 new3 = texture2D(velocity_new, uv - vec2(0.0, px.y * 2.0)).xy;
  vec2 newv = 4.0 * old + v * dt * (new0 + new1 + new2 + new3);
  newv /= 4.0 * (1.0 + v * dt);
  gl_FragColor = vec4(newv, 0.0, 0.0);
}`;

    class ShaderPass {
      props: any;
      scene: THREE.Scene;
      camera: THREE.Camera;
      uniforms: any;
      material: THREE.RawShaderMaterial | null = null;

      constructor(props: any) {
        this.props = props || {};
        this.uniforms = this.props.material?.uniforms;
        this.scene = new THREE.Scene();
        this.camera = new THREE.Camera();
        if (this.uniforms) {
          this.material = new THREE.RawShaderMaterial(this.props.material);
          const plane = new THREE.Mesh(new THREE.PlaneGeometry(2.0, 2.0), this.material);
          this.scene.add(plane);
        }
      }

      update() {
        if (!Common.renderer) return;
        Common.renderer.setRenderTarget(this.props.output || null);
        Common.renderer.render(this.scene, this.camera);
        Common.renderer.setRenderTarget(null);
      }
    }

    class Advection extends ShaderPass {
      line: THREE.LineSegments | null = null;
      constructor(simProps: any) {
        super({
          material: {
            vertexShader: faceVert,
            fragmentShader: advectionFrag,
            uniforms: {
              boundarySpace: { value: simProps.cellScale },
              px: { value: simProps.cellScale },
              fboSize: { value: simProps.fboSize },
              velocity: { value: simProps.src.texture },
              dt: { value: simProps.dt },
              isBFECC: { value: true }
            }
          },
          output: simProps.dst
        });
        this.createBoundary();
      }
      createBoundary() {
        const boundaryG = new THREE.BufferGeometry();
        boundaryG.setAttribute(
          'position',
          new THREE.BufferAttribute(
            new Float32Array([-1, -1, 0, -1, 1, 0, -1, 1, 0, 1, 1, 0, 1, 1, 0, 1, -1, 0, 1, -1, 0, -1, -1, 0]),
            3
          )
        );
        const boundaryM = new THREE.RawShaderMaterial({
          vertexShader: lineVert,
          fragmentShader: advectionFrag,
          uniforms: this.uniforms
        });
        this.line = new THREE.LineSegments(boundaryG, boundaryM);
        this.scene.add(this.line);
      }
      update({ dt, isBounce, BFECC }: any) {
        this.uniforms.dt.value = dt;
        this.uniforms.isBFECC.value = BFECC;
        if (this.line) this.line.visible = isBounce;
        super.update();
      }
    }

    class ExternalForce extends ShaderPass {
      mouse: THREE.Mesh;
      constructor(simProps: any) {
        super({ output: simProps.dst });
        const mouseG = new THREE.PlaneGeometry(1, 1);
        const mouseM = new THREE.RawShaderMaterial({
          vertexShader: mouseVert,
          fragmentShader: externalForceFrag,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
          uniforms: {
            px: { value: simProps.cellScale },
            force: { value: new THREE.Vector2(0.0, 0.0) },
            center: { value: new THREE.Vector2(0.0, 0.0) },
            scale: { value: new THREE.Vector2(simProps.cursor_size, simProps.cursor_size) }
          }
        });
        this.mouse = new THREE.Mesh(mouseG, mouseM);
        this.scene.add(this.mouse);
      }
      update(props: any) {
        const forceX = (Mouse.diff.x / 2) * props.mouse_force;
        const forceY = (Mouse.diff.y / 2) * props.mouse_force;
        const cursorSizeX = props.cursor_size * props.cellScale.x;
        const cursorSizeY = props.cursor_size * props.cellScale.y;
        const centerX = Math.min(Math.max(Mouse.coords.x, -1 + cursorSizeX + props.cellScale.x * 2), 1 - cursorSizeX - props.cellScale.x * 2);
        const centerY = Math.min(Math.max(Mouse.coords.y, -1 + cursorSizeY + props.cellScale.y * 2), 1 - cursorSizeY - props.cellScale.y * 2);
        const uniforms = (this.mouse.material as THREE.RawShaderMaterial).uniforms;
        uniforms.force.value.set(forceX, forceY);
        uniforms.center.value.set(centerX, centerY);
        uniforms.scale.value.set(props.cursor_size, props.cursor_size);
        super.update();
      }
    }

    class Viscous extends ShaderPass {
      constructor(simProps: any) {
        super({
          material: {
            vertexShader: faceVert,
            fragmentShader: viscousFrag,
            uniforms: {
              boundarySpace: { value: simProps.boundarySpace },
              velocity: { value: simProps.src.texture },
              velocity_new: { value: simProps.dst_.texture },
              v: { value: simProps.viscous },
              px: { value: simProps.cellScale },
              dt: { value: simProps.dt }
            }
          },
          output: simProps.dst,
          output0: simProps.dst_,
          output1: simProps.dst
        });
      }
      update({ viscous, iterations, dt }: any) {
        let fboIn;
        let fboOut = this.props.output1;
        this.uniforms.v.value = viscous;
        for (let i = 0; i < iterations; i++) {
          if (i % 2 === 0) {
            fboIn = this.props.output0;
            fboOut = this.props.output1;
          } else {
            fboIn = this.props.output1;
            fboOut = this.props.output0;
          }
          this.uniforms.velocity_new.value = fboIn.texture;
          this.props.output = fboOut;
          this.uniforms.dt.value = dt;
          super.update();
        }
        return fboOut;
      }
    }

    class Divergence extends ShaderPass {
      constructor(simProps: any) {
        super({
          material: {
            vertexShader: faceVert,
            fragmentShader: divergenceFrag,
            uniforms: {
              boundarySpace: { value: simProps.boundarySpace },
              velocity: { value: simProps.src.texture },
              px: { value: simProps.cellScale },
              dt: { value: simProps.dt }
            }
          },
          output: simProps.dst
        });
      }
      update({ vel }: any) {
        this.uniforms.velocity.value = vel.texture;
        super.update();
      }
    }

    class Poisson extends ShaderPass {
      constructor(simProps: any) {
        super({
          material: {
            vertexShader: faceVert,
            fragmentShader: poissonFrag,
            uniforms: {
              boundarySpace: { value: simProps.boundarySpace },
              pressure: { value: simProps.dst_.texture },
              divergence: { value: simProps.src.texture },
              px: { value: simProps.cellScale }
            }
          },
          output: simProps.dst,
          output0: simProps.dst_,
          output1: simProps.dst
        });
      }
      update({ iterations }: any) {
        let pIn;
        let pOut = this.props.output1;
        for (let i = 0; i < iterations; i++) {
          if (i % 2 === 0) {
            pIn = this.props.output0;
            pOut = this.props.output1;
          } else {
            pIn = this.props.output1;
            pOut = this.props.output0;
          }
          this.uniforms.pressure.value = pIn.texture;
          this.props.output = pOut;
          super.update();
        }
        return pOut;
      }
    }

    class Pressure extends ShaderPass {
      constructor(simProps: any) {
        super({
          material: {
            vertexShader: faceVert,
            fragmentShader: pressureFrag,
            uniforms: {
              boundarySpace: { value: simProps.boundarySpace },
              pressure: { value: simProps.src_p.texture },
              velocity: { value: simProps.src_v.texture },
              px: { value: simProps.cellScale },
              dt: { value: simProps.dt }
            }
          },
          output: simProps.dst
        });
      }
      update({ vel, pressure }: any) {
        this.uniforms.velocity.value = vel.texture;
        this.uniforms.pressure.value = pressure.texture;
        super.update();
      }
    }

    class Simulation {
      options: any;
      fbos: Record<string, THREE.WebGLRenderTarget>;
      fboSize: THREE.Vector2;
      cellScale: THREE.Vector2;
      boundarySpace: THREE.Vector2;
      advection: Advection;
      externalForce: ExternalForce;
      viscousPass: Viscous;
      divergence: Divergence;
      poisson: Poisson;
      pressure: Pressure;

      constructor(options: any) {
        this.options = {
          iterations_poisson: 24,
          iterations_viscous: 24,
          mouse_force: 20,
          resolution: 0.45,
          cursor_size: 100,
          viscous: 30,
          isBounce: false,
          dt: 0.014,
          isViscous: false,
          BFECC: true,
          ...options
        };
        this.fbos = {
          vel_0: null as unknown as THREE.WebGLRenderTarget,
          vel_1: null as unknown as THREE.WebGLRenderTarget,
          vel_viscous0: null as unknown as THREE.WebGLRenderTarget,
          vel_viscous1: null as unknown as THREE.WebGLRenderTarget,
          div: null as unknown as THREE.WebGLRenderTarget,
          pressure_0: null as unknown as THREE.WebGLRenderTarget,
          pressure_1: null as unknown as THREE.WebGLRenderTarget
        };
        this.fboSize = new THREE.Vector2();
        this.cellScale = new THREE.Vector2();
        this.boundarySpace = new THREE.Vector2();
        this.calcSize();
        this.createAllFBO();
        this.advection = new Advection({
          cellScale: this.cellScale,
          fboSize: this.fboSize,
          dt: this.options.dt,
          src: this.fbos.vel_0,
          dst: this.fbos.vel_1
        });
        this.externalForce = new ExternalForce({
          cellScale: this.cellScale,
          cursor_size: this.options.cursor_size,
          dst: this.fbos.vel_1
        });
        this.viscousPass = new Viscous({
          cellScale: this.cellScale,
          boundarySpace: this.boundarySpace,
          viscous: this.options.viscous,
          src: this.fbos.vel_1,
          dst: this.fbos.vel_viscous1,
          dst_: this.fbos.vel_viscous0,
          dt: this.options.dt
        });
        this.divergence = new Divergence({
          cellScale: this.cellScale,
          boundarySpace: this.boundarySpace,
          src: this.fbos.vel_viscous0,
          dst: this.fbos.div,
          dt: this.options.dt
        });
        this.poisson = new Poisson({
          cellScale: this.cellScale,
          boundarySpace: this.boundarySpace,
          src: this.fbos.div,
          dst: this.fbos.pressure_1,
          dst_: this.fbos.pressure_0
        });
        this.pressure = new Pressure({
          cellScale: this.cellScale,
          boundarySpace: this.boundarySpace,
          src_p: this.fbos.pressure_0,
          src_v: this.fbos.vel_viscous0,
          dst: this.fbos.vel_0,
          dt: this.options.dt
        });
      }

      getFloatType() {
        return /(iPad|iPhone|iPod)/i.test(navigator.userAgent) ? THREE.HalfFloatType : THREE.FloatType;
      }

      createAllFBO() {
        const type = this.getFloatType();
        const opts: any = {
          type,
          depthBuffer: false,
          stencilBuffer: false,
          minFilter: THREE.LinearFilter,
          magFilter: THREE.LinearFilter,
          wrapS: THREE.ClampToEdgeWrapping,
          wrapT: THREE.ClampToEdgeWrapping
        };
        Object.keys(this.fbos).forEach(key => {
          this.fbos[key] = new THREE.WebGLRenderTarget(this.fboSize.x, this.fboSize.y, opts);
        });
      }

      calcSize() {
        const width = Math.max(1, Math.round(this.options.resolution * Common.width));
        const height = Math.max(1, Math.round(this.options.resolution * Common.height));
        this.cellScale.set(1 / width, 1 / height);
        this.fboSize.set(width, height);
      }

      resize() {
        this.calcSize();
        Object.values(this.fbos).forEach(fbo => fbo.setSize(this.fboSize.x, this.fboSize.y));
      }

      update() {
        this.boundarySpace.copy(this.options.isBounce ? new THREE.Vector2(0, 0) : this.cellScale);
        this.advection.update({ dt: this.options.dt, isBounce: this.options.isBounce, BFECC: this.options.BFECC });
        this.externalForce.update({
          cursor_size: this.options.cursor_size,
          mouse_force: this.options.mouse_force,
          cellScale: this.cellScale
        });
        let vel = this.fbos.vel_1;
        if (this.options.isViscous) {
          vel = this.viscousPass.update({
            viscous: this.options.viscous,
            iterations: this.options.iterations_viscous,
            dt: this.options.dt
          });
        }
        this.divergence.update({ vel });
        const pressure = this.poisson.update({ iterations: this.options.iterations_poisson });
        this.pressure.update({ vel, pressure });
      }
    }

    class Output {
      simulation: Simulation;
      scene: THREE.Scene;
      camera: THREE.Camera;
      constructor() {
        this.simulation = new Simulation({});
        this.scene = new THREE.Scene();
        this.camera = new THREE.Camera();
        const mesh = new THREE.Mesh(
          new THREE.PlaneGeometry(2, 2),
          new THREE.RawShaderMaterial({
            vertexShader: faceVert,
            fragmentShader: colorFrag,
            transparent: true,
            depthWrite: false,
            uniforms: {
              velocity: { value: this.simulation.fbos.vel_0.texture },
              boundarySpace: { value: new THREE.Vector2() },
              palette: { value: paletteTex },
              bgColor: { value: bgVec4 }
            }
          })
        );
        this.scene.add(mesh);
      }
      resize() {
        this.simulation.resize();
      }
      update() {
        this.simulation.update();
        if (!Common.renderer) return;
        Common.renderer.setRenderTarget(null);
        Common.renderer.render(this.scene, this.camera);
      }
    }

    class WebGLManager {
      props: any;
      output: Output;
      autoDriver: AutoDriver;
      running = false;
      lastUserInteraction = performance.now();
      _resize: () => void;
      _loop: () => void;
      _onVisibility: () => void;

      constructor(props: any) {
        this.props = props;
        Common.init(props.$wrapper);
        Mouse.init(props.$wrapper);
        Mouse.autoIntensity = props.autoIntensity;
        Mouse.takeoverDuration = props.takeoverDuration;
        Mouse.onInteract = () => {
          this.lastUserInteraction = performance.now();
          this.autoDriver.forceStop();
        };
        this.output = new Output();
        this.autoDriver = new AutoDriver(Mouse, this, {
          enabled: props.autoDemo,
          speed: props.autoSpeed,
          resumeDelay: props.autoResumeDelay,
          rampDuration: props.autoRampDuration
        });
        props.$wrapper.prepend((Common.renderer as THREE.WebGLRenderer).domElement);
        this._resize = () => this.resize();
        this._loop = () => this.loop();
        this._onVisibility = () => {
          if (document.hidden) this.pause();
          else if (isVisibleRef.current) this.start();
        };
        window.addEventListener('resize', this._resize);
        document.addEventListener('visibilitychange', this._onVisibility);
      }

      resize() {
        Common.resize();
        this.output.resize();
      }

      render() {
        this.autoDriver.update();
        Mouse.update();
        Common.update();
        this.output.update();
      }

      loop() {
        if (!this.running) return;
        this.render();
        rafRef.current = requestAnimationFrame(this._loop);
      }

      start() {
        if (this.running) return;
        this.running = true;
        this._loop();
      }

      pause() {
        this.running = false;
        if (rafRef.current) {
          cancelAnimationFrame(rafRef.current);
          rafRef.current = null;
        }
      }

      dispose() {
        window.removeEventListener('resize', this._resize);
        document.removeEventListener('visibilitychange', this._onVisibility);
        Mouse.dispose();
        if (Common.renderer) {
          const canvas = Common.renderer.domElement;
          if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
          Common.renderer.dispose();
        }
      }
    }

    const container = mountRef.current;
    container.style.position = container.style.position || 'relative';
    container.style.overflow = container.style.overflow || 'hidden';

    const webgl = new WebGLManager({
      $wrapper: container,
      autoDemo,
      autoSpeed,
      autoIntensity,
      takeoverDuration,
      autoResumeDelay,
      autoRampDuration
    });
    webglRef.current = webgl;

    const applyOptionsFromProps = () => {
      if (!webglRef.current?.output?.simulation) return;
      const sim = webglRef.current.output.simulation;
      const prevRes = sim.options.resolution;
      Object.assign(sim.options, {
        mouse_force: mouseForce,
        cursor_size: cursorSize,
        isViscous,
        viscous,
        iterations_viscous: iterationsViscous,
        iterations_poisson: iterationsPoisson,
        dt,
        BFECC,
        resolution,
        isBounce
      });
      if (resolution !== prevRes) sim.resize();
    };

    applyOptionsFromProps();
    webgl.start();

    const io = new IntersectionObserver(
      entries => {
        const entry = entries[0];
        const isVisible = entry.isIntersecting && entry.intersectionRatio > 0;
        isVisibleRef.current = isVisible;
        if (!webglRef.current) return;
        if (isVisible && !document.hidden) webglRef.current.start();
        else webglRef.current.pause();
      },
      { threshold: [0, 0.01, 0.1] }
    );
    io.observe(container);
    intersectionObserverRef.current = io;

    const ro = new ResizeObserver(() => {
      if (!webglRef.current) return;
      if (resizeRafRef.current) cancelAnimationFrame(resizeRafRef.current);
      resizeRafRef.current = requestAnimationFrame(() => {
        webglRef.current?.resize();
      });
    });
    ro.observe(container);
    resizeObserverRef.current = ro;

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      resizeObserverRef.current?.disconnect();
      intersectionObserverRef.current?.disconnect();
      webglRef.current?.dispose();
      webglRef.current = null;
    };
  }, [
    BFECC,
    cursorSize,
    dt,
    isBounce,
    isViscous,
    iterationsPoisson,
    iterationsViscous,
    mouseForce,
    resolution,
    viscous,
    colors,
    autoDemo,
    autoSpeed,
    autoIntensity,
    takeoverDuration,
    autoResumeDelay,
    autoRampDuration
  ]);

  return <div ref={mountRef} className={`liquid-ether-container ${className}`} style={style} />;
}
