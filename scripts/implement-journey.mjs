import fs from 'node:fs';
let p='src/components/three/CityScene.tsx';let s=fs.readFileSync(p,'utf8');
const start=s.indexOf('const random =');const end=s.indexOf('function Buildings()');
s=s.slice(0,start)+'import { buildings, cityRandom as random } from "./cityLayout";\nimport CameraRig from "./CameraRig";\nimport JourneyLabels from "./JourneyLabels";\n'+s.slice(end);
s=s.replace('const { camera, pointer, scene } = useThree();','const { scene } = useThree();');s=s.replace('  const target = useMemo(() => new THREE.Vector3(), []);\n','');
const cameraStart=s.indexOf('    const p = cityMotion.progress;');const cameraEnd=s.indexOf('    if (core.current)',cameraStart);
s=s.slice(0,cameraStart)+s.slice(cameraEnd);
s=s.replace('useFrame(({ clock }, delta) => {','useFrame(({ clock }) => {');
s=s.replace('  const pointPositions = useMemo(', '  const trafficCount = mobile ? 12 : 28;\n  const pointPositions = useMemo(');
s=s.replace('i < 28','i < trafficCount').replace('args={[undefined, undefined, 28]}','args={[undefined, undefined, trafficCount]}');
s=s.replace('fog.density = 0.019 + phase * 0.002;', 'fog.density = 0.019 + phase * 0.002 + THREE.MathUtils.smoothstep(cityMotion.progress, .86, 1) * .028;');
s=s.replace('      <ambientLight intensity={1.2} />', '      <CameraRig mobile={mobile} reduced={reduced} />\n      <JourneyLabels mobile={mobile} reduced={reduced} />\n      <ambientLight intensity={1.2} />');
s=s.replace('  const [mobile] = useState(', '  const [mobile, setMobile] = useState(').replace('(max-width: 768px)','(max-width: 767px)');
s=s.replace('    let intersecting = true;', '    const media = window.matchMedia("(max-width: 767px)");\n    const resize = () => setMobile(media.matches);\n    media.addEventListener("change", resize);\n    let intersecting = true;');
s=s.replace('      observer.disconnect();','      media.removeEventListener("change", resize);\n      observer.disconnect();');
s=s.replace('camera={{ position: [22, 21, 22], fov: 43, near: 0.1, far: 110 }}','camera={{ position: [22, 21, 26], fov: 48, near: 0.08, far: 180 }}');
// All four facades need windows now that the camera passes the tower.
s=s.replace('side < 2','side < 4');
s=s.replace('b.x + (side === 0 ? b.w / 2 + 0.006 : 0)', 'b.x + (side % 2 === 0 ? (side === 0 ? 1 : -1) * (b.w / 2 + 0.006) : 0)');
s=s.replace('b.z + (side === 1 ? b.d / 2 + 0.006 : 0)', 'b.z + (side % 2 === 1 ? (side === 1 ? 1 : -1) * (b.d / 2 + 0.006) : 0)');
s=s.replaceAll('side === 0 ? 0.014', 'side % 2 === 0 ? 0.014').replaceAll('side === 1 ? 0.014','side % 2 === 1 ? 0.014');
// District tint is an instance attribute, not additional materials or draw calls.
s=s.replace('matrices.body.forEach((m, i) => bodies.current?.setMatrixAt(i, m));', 'matrices.body.forEach((m, i) => { bodies.current?.setMatrixAt(i, m); bodies.current?.setColorAt(i, new THREE.Color(buildings[i].z < 0 ? "#7395ba" : buildings[i].x > 0 ? "#83bdb0" : "#9cc7d1")); });');
fs.writeFileSync(p,s);
p='src/components/sections/Hero.tsx';s=fs.readFileSync(p,'utf8').replace('ArrowDown, Radio, ScanLine, Orbit, MoveUpRight','ArrowDown, Radio, Orbit, MoveUpRight');
s=s.replace('<section id="overview" className="hero" aria-labelledby="hero-title">','<section id="overview" className="city-journey" aria-labelledby="hero-title">\n      <div className="hero journey-stage">');
s=s.replace('      </div>\n    </section>', '      </div>\n      <a className="journey-skip" href="#pulse" onClick={event=>{event.preventDefault();const target=document.getElementById("pulse");if(target){target.scrollIntoView({behavior:"instant",block:"start"});target.tabIndex=-1;target.focus({preventScroll:true});}}}>Skip city journey <ArrowDown size={13}/></a>\n      <div className="journey-outro" aria-hidden="true"><span className="eyebrow">NEXUS CORE / CONNECTION ESTABLISHED</span><p>Entering<br/><span>Urban Intelligence</span></p><small>ONE CITY. ONE INTELLIGENCE LAYER.</small></div>\n      <div className="journey-blend" aria-hidden="true"/>\n      </div>\n    </section>');
const labelStart=s.indexOf('        <div className="city-label core-label">');const labelEnd=s.indexOf('        <div className="city-axis">',labelStart);s=s.slice(0,labelStart)+s.slice(labelEnd);
s=s.replace('shifts from dawn through daytime and evening to night as you scroll.', 'shifts from dawn to night as the camera descends through a street corridor beside the central tower. A shorter rooftop route is used on mobile; reduced motion keeps a stable aerial view.');
fs.writeFileSync(p,s);
p='src/hooks/useCityMotion.ts';s=fs.readFileSync(p,'utf8');const a=s.indexOf('      gsap.to(cityMotion');const b=s.indexOf('      gsap.to(document.body',a);
s=s.slice(0,a)+`      const copy = document.querySelector<HTMLElement>(".hero-content");
      const stage = document.querySelector<HTMLElement>(".journey-stage");
      const phase = document.querySelector(".hero-mode");
      const timeline = gsap.timeline({scrollTrigger:{id:"city-journey",trigger:"#overview",start:"top top",end:"bottom bottom",scrub:.35,invalidateOnRefresh:true},onUpdate:()=>{
        if(copy) copy.inert=cityMotion.progress>.25;
        if(stage) stage.dataset.progress=cityMotion.progress.toFixed(3);
        if(phase) phase.textContent=["01 / DAWN","02 / ACTIVE DAYTIME","03 / HIGH-DEMAND EVENING","04 / INTELLIGENT NIGHT"][Math.min(3,Math.floor(cityMotion.phase+.2))];
      }});
      timeline.fromTo(cityMotion,{progress:0,phase:0},{progress:1,phase:3,duration:1,ease:"none"},0)
        .to(".hero-content",{autoAlpha:0,y:-45,duration:.15,ease:"power1.inOut"},.09)
        .to(".hero-coordinate, .hero-bottom, .city-axis",{autoAlpha:0,duration:.12},.12)
        .to(".city-vignette",{opacity:.2,duration:.2},.12)
        .fromTo(".journey-outro",{autoAlpha:0,y:20},{autoAlpha:1,y:0,duration:.1},.87)
        .to(".journey-blend",{opacity:1,duration:.14},.86);
`+s.slice(b);
s=s.replace('    if (reduced) return;', '    cityMotion.progress = 0;\n    cityMotion.phase = 0;\n    if (reduced) return;');
s=s.replace('    return () => context.revert();','    return () => { context.revert(); const copy=document.querySelector<HTMLElement>(".hero-content"); if(copy) copy.inert=false; cityMotion.progress=0; cityMotion.phase=0; };');
fs.writeFileSync(p,s);
