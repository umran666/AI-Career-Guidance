import React from 'react';
import useTilt from '../../hooks/useTilt';

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  maxTilt?: number;
}

export const TiltCard: React.FC<TiltCardProps> = ({ children, className = '', maxTilt = 12 }) => {
  const ref = useTilt({ maxTilt });

  return (
    <div ref={ref as any} className={`rounded-2xl ${className}`}>
      {children}
    </div>
  );
};

export default TiltCard;
