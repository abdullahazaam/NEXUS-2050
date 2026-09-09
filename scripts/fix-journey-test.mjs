import fs from 'node:fs';
const p='src/components/three/cameraPath.test.ts';let s=fs.readFileSync(p,'utf8');s=s.replace('expect(collision,`Building at ${b.x},${b.z}; camera ${position.toArray()}; progress ${i/5000}`).toBe(false);','if(collision) throw new Error(`Building at ${b.x},${b.z}; camera ${position.toArray()}; progress ${i/5000}`);');fs.writeFileSync(p,s);
