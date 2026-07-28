import React from 'react';
import { Sliders, TrendingDown, Disc, Wind, Activity, Zap } from 'lucide-react';
import { categoriesData } from '../data/catalog';

const iconMap = {
  Sliders,
  TrendingDown,
  Disc,
  Wind,
  Activity,
  Zap
};

export default function CategoryGrid({ activeCategory, onSelectCategory }) {
  return (
    <div className="category-grid animate-fade-in">
      {categoriesData.map((cat) => {
        const IconComponent = iconMap[cat.icon] || Sliders;
        const isSelected = activeCategory === cat.id;

        return (
          <div 
            key={cat.id} 
            className={`category-card ${isSelected ? 'selected' : ''}`}
            onClick={() => onSelectCategory(cat.id)}
          >
            <div className="category-card-icon">
              <IconComponent size={24} />
            </div>
            <span className="category-card-name">{cat.name}</span>
          </div>
        );
      })}
    </div>
  );
}
export { iconMap };
