import React from 'react';
import './Card.css';

interface CardProps {
  char: string;
}

const Card: React.FC<CardProps> = ({ char }) => {
  return (
    <div className="lingo-card">
      <div className="card-content">
        <span className="char">{char}</span>
      </div>
      <div className="card-shine"></div>
    </div>
  );
};

export default Card;
