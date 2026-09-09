import fs from 'node:fs';
let p='src/components/three/CityScene.tsx';let s=fs.readFileSync(p,'utf8');
s=s.replace('floor += 0.29','floor += Math.hypot(b.x,b.z)>12 ? .58 : .29');
s=s.replace('const lane = ((i % 7) - 3) * 4.6;', 'const lane = [-9.2, -4.6, 2.3, 4.6, 9.2][i % 5];');
s=s.replace('      <Buildings />', `      <Buildings />
      <mesh rotation={[-Math.PI/2,0,0]} position={[2.3,.012,0]}><planeGeometry args={[.92,29]}/><meshStandardMaterial color="#102d38" roughness={.8}/></mesh>
      {[1.91,2.69].map(x=><mesh key={x} position={[x,.04,0]}><boxGeometry args={[.024,.025,29]}/><meshBasicMaterial color="#53aaa9"/></mesh>)}
      {Array.from({length:24},(_,i)=><mesh key={i} position={[2.3,.045,i*1.2-14]}><boxGeometry args={[.025,.02,.28]}/><meshBasicMaterial color="#90d6c5"/></mesh>)}
      <group position={[2.3,2.5,-2.3]}><mesh><octahedronGeometry args={[.16]}/><meshBasicMaterial color="#b5e2c2"/></mesh><mesh position={[0,-1.25,0]}><cylinderGeometry args={[.009,.009,2.5,4]}/><meshBasicMaterial color="#73ada5" transparent opacity={.35}/></mesh></group>
      <mesh position={[0,5,0]}><cylinderGeometry args={[.075,.24,8,12,1,true]}/><meshBasicMaterial color="#77ffe9" transparent opacity={.12} depthWrite={false}/></mesh>`);
fs.writeFileSync(p,s);
