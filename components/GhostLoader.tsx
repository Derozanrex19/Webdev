import React from 'react';
import './GhostLoader.css';

interface GhostLoaderProps {
  label?: string;
  inline?: boolean;
  scale?: number;
  className?: string;
}

const solidSegments = ['top0', 'top1', 'top2', 'top3', 'top4', 'st0', 'st1', 'st2', 'st3', 'st4', 'st5'];
const flickerA = new Set(['an1', 'an6', 'an7', 'an8', 'an12', 'an13', 'an18']);

const GhostLoader: React.FC<GhostLoaderProps> = ({
  label,
  inline = false,
  scale = 0.26,
  className = '',
}) => {
  return (
    <div className={`ghost-loader ${inline ? 'ghost-loader--inline' : ''} ${className}`.trim()}>
      <div className="ghost-loader__art" style={{ ['--ghost-scale' as string]: scale }}>
        <div className="ghost-loader__body" aria-hidden="true">
          <div className="ghost-loader__pupil" />
          <div className="ghost-loader__pupil-right" />
          <div className="ghost-loader__eye" />
          <div className="ghost-loader__eye-right" />
          {solidSegments.map((segment) => (
            <div key={segment} className={`ghost-loader__solid ghost-loader__solid--${segment}`} />
          ))}
          {Array.from({ length: 18 }, (_, index) => {
            const segment = `an${index + 1}`;
            return (
              <div
                key={segment}
                className={`ghost-loader__wave ghost-loader__wave--${segment} ${flickerA.has(segment) ? 'ghost-loader__wave--a' : 'ghost-loader__wave--b'}`}
              />
            );
          })}
        </div>
        <div className="ghost-loader__shadow" aria-hidden="true" />
      </div>
      {label ? <span className="ghost-loader__label">{label}</span> : null}
    </div>
  );
};

export default GhostLoader;
