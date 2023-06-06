import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { InstancedMesh, Matrix4, Quaternion, Vector3 } from 'three';
import { gsap } from 'gsap';

const Dummy = () => {
  const id = useRef(0);
  const matrix = useRef(null);
  const position = useRef(null);
  const quaternion = useRef(null);
  const scale = useRef(null);

  return { id, matrix, position, quaternion, scale };
};

const Tween = () => {
  const vector = useRef(0);
  return { vector };
};

const TreeInstancedMesh = ({ geometry, material, count, height }) => {
  const meshRef = useRef();
  const pool = useRef([]);
  const tween = useRef([]);

  useFrame((_, delta) => {
    for (let i = 0; i < tween.current.length; i++) {
      const target = tween.current[i];
      target.vector += delta * 0.5;
      const dummy = pool.current[i];
      const targetScale = dummy.scale.clone();
      const multipl = targetScale.multiplyScalar(target.vector).clone();
      const mat = new Matrix4();
      mat.compose(dummy.position, dummy.quaternion, multipl);
      meshRef.current.setMatrixAt(dummy.id, mat);
      meshRef.current.instanceMatrix.needsUpdate = true;
    }
  });

  const setNextMesh = (position, quaternion, scale, delay) => {
    const dummy = Dummy();
    dummy.id.current = pool.current.length;
    dummy.position.current = position;
    dummy.quaternion.current = quaternion;
    dummy.scale.current = scale;
    dummy.matrix.current = new Matrix4();
    dummy.matrix.current.compose(position, quaternion, new Vector3(0, 0, 0));

    const tweenObj = Tween();

    meshRef.current.setMatrixAt(dummy.id.current, dummy.matrix.current);
    pool.current[dummy.id.current] = dummy;
    tween.current[dummy.id.current] = tweenObj;

    gsap.to(tweenObj, {
      duration: 0.5,
      delay: delay,
      vector: 1.02,
      onComplete: (_this, target) => {},
      onCompleteParams: [meshRef.current, dummy],
      onUpdate: (_this, dummy, tween) => {
        const targetScale = dummy.scale.current.clone();
        const multipl = targetScale.multiplyScalar(tween.vector.current).clone();
        const mat = new Matrix4();
        mat.compose(dummy.position.current, dummy.quaternion.current, multipl);
        _this.setMatrixAt(dummy.id.current, mat);
        _this.instanceMatrix.needsUpdate = true;
      },
      onUpdateParams: [meshRef.current, dummy, tweenObj],
    });
  };

  const setPool = (newPool) => {
    pool.current = newPool;
    for (const p of pool.current) {
      p.matrix.current = new Matrix4();
      p.matrix.current.compose(
        new Vector3(p.position.x, p.position.y, p.position.z),
        new Quaternion(p.quaternion._x, p.quaternion._y, p.quaternion._z, p.quaternion._w),
        new Vector3(p.scale.x, p.scale.y, p.scale.z)
      );
      meshRef.current.setMatrixAt(p.id, p.matrix.current);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  };

  return (
    <instancedMesh
      ref={meshRef}
      args={[geometry, material, count]}
      onCreated={(instancedMesh) => {
        meshRef.current = instancedMesh;
      }}
    />
  ); };
export default TreeInstancedMesh;
