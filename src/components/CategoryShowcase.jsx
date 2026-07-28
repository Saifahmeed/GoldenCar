import React from 'react';
import { ArrowRight } from 'lucide-react';

import lightingImg from '../assets/brakes.jpg';
import screensImg from '../assets/intercooler.jpg';
import seatsImg from '../assets/springs.jpg';
import stylingImg from '../assets/exhaust.jpg';

const categoriesInfo = [
  {
    id: "lighting",
    name: "Premium Lighting",
    tag: "Visibility & Style",
    image: lightingImg,
    description: "Motorsport-grade road illumination. Dual-beam Laser LED projector lenses, Symphony app-controlled interior ambient lights, and error-free Canbus headlight bulbs designed for maximum safety."
  },
  {
    id: "screens",
    name: "Smart Android Screens",
    tag: "Navigation & Tech",
    image: screensImg,
    description: "Upgrade your dashboard to a premium digital cockpit. High-resolution IPS capacitive touch displays, wireless CarPlay and Android Auto, and complete steering wheel and AC integration."
  },
  {
    id: "seats",
    name: "Seats & Leather Covers",
    tag: "Comfort & Luxury",
    image: seatsImg,
    description: "Bespoke custom leather upholstery and custom-fit protective seat covers. Model-specific airbag safe designs, custom Alcantara sports steering wheel wrap upgrades, and memory foam padding."
  },
  {
    id: "exterior",
    name: "Exterior Styling Mods",
    tag: "Aerodynamics & Profile",
    image: stylingImg,
    description: "Aggressive visual styling accessories. Premium ABS gloss-black trunk spoilers, real 3K twill dry carbon fiber M-style side mirror replacement caps, and model-specific styling enhancements."
  }
];

export default function CategoryShowcase({ onSelectCategory }) {
  return (
    <div className="category-showcase-grid animate-fade-in">
      {categoriesInfo.map((cat) => (
        <div 
          key={cat.id} 
          className="showcase-card"
          onClick={() => onSelectCategory(cat.id)}
        >
          <div 
            className="showcase-bg" 
            style={{ backgroundImage: `url(${cat.image})` }}
          />
          <div className="showcase-overlay" />
          <div className="showcase-content">
            <span className="showcase-tag">{cat.tag}</span>
            <h3 className="showcase-title">{cat.name}</h3>
            <p className="showcase-desc">{cat.description}</p>
            <div className="showcase-btn">
              <span>Explore Category</span>
              <ArrowRight size={16} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
