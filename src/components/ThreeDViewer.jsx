import React, { useState, useEffect, useRef } from 'react';
import { Box, RotateCw, Palette, Eye, ShieldCheck, Sparkles, AlertCircle, ShoppingCart } from 'lucide-react';
import { productsData } from '../data/catalog';

// BMW OEM paint options mapped to Hex colors
const paintColors = [
  { name: 'Portimao Blue Metallic', hex: '#1970E6', rgb: [0.15, 0.44, 1.00, 1.00] },
  { name: 'Toronto Red Metallic', hex: '#D32F2F', rgb: [0.80, 0.05, 0.05, 1.00] },
  { name: 'Isle of Man Green', hex: '#0D5C3A', rgb: [0.03, 0.25, 0.15, 1.00] },
  { name: 'Brooklyn Grey Metallic', hex: '#A2AAB3', rgb: [0.60, 0.65, 0.70, 1.00] },
  { name: 'Sapphire Black Metallic', hex: '#111215', rgb: [0.03, 0.03, 0.04, 1.00] },
  { name: 'Alpine White', hex: '#F4F5F7', rgb: [0.95, 0.95, 0.97, 1.00] },
  { name: 'São Paulo Yellow', hex: '#D5E01E', rgb: [0.80, 0.85, 0.05, 1.00] }
];

// Camera angle presets using percentage distances for auto-scaling
const cameraAngles = [
  { name: 'Front', orbit: '0deg 75deg 150%', target: 'auto auto auto' },
  { name: 'Side Profile', orbit: '90deg 78deg 150%', target: 'auto auto auto' },
  { name: 'Rear Exhausts', orbit: '180deg 75deg 150%', target: 'auto auto auto' },
  { name: 'Wheel Detail', orbit: '135deg 82deg 90%', target: 'auto auto auto' },
  { name: 'Top Down', orbit: '45deg 20deg 180%', target: 'auto auto auto' }
];

// Hotspot definitions mapped to actual product IDs in catalog
const hotspots = [
  {
    id: 'hotspot-headlights',
    slot: 'hotspot-headlights',
    position: '0.65 0.65 1.95',
    normal: '0 0 1',
    productId: 'gd-lgt-laser-01',
    label: 'Laser LED Lenses Upgrade',
    desc: 'Motorsport-grade H7/H4 bi-laser projector headlights'
  },
  {
    id: 'hotspot-ambient',
    slot: 'hotspot-ambient',
    position: '0 1.05 0.1',
    normal: '0 1 0',
    productId: 'gd-lgt-ambient-02',
    label: 'Dynamic Ambient Lighting',
    desc: 'Symphony App-controlled 16M RGB cabin accent lighting'
  },
  {
    id: 'hotspot-spoiler',
    slot: 'hotspot-spoiler',
    position: '0 1.03 -2.15',
    normal: '0 0.5 -0.8',
    productId: 'gd-ext-spoiler-09',
    label: 'M-Performance Spoiler',
    desc: 'High-impact ABS trunk wing finished in piano gloss black'
  },
  {
    id: 'hotspot-mirrors',
    slot: 'hotspot-mirrors',
    position: '-1.05 0.9 0.4',
    normal: '-1 0 0.2',
    productId: 'gd-ext-mirror-10',
    label: 'Carbon Fiber Mirror Caps',
    desc: 'Aggressive M-horns replace standard side mirror covers'
  },
  {
    id: 'hotspot-steering',
    slot: 'hotspot-steering',
    position: '-0.38 0.95 0.45',
    normal: '0 0 1',
    productId: 'gd-sea-alcantara-07',
    label: 'Alcantara Steering Wrap',
    desc: 'Italian luxury hand-stitched steering wheel wrap with racing top stripe'
  }
];

export default function ThreeDViewer({ activeVehicle, onSelectVehicle, onProductClick }) {
  const isM3 = activeVehicle && 
               activeVehicle.make === 'BMW' && 
               activeVehicle.model === 'M3';

  const modelViewerRef = useRef(null);
  const [selectedColor, setSelectedColor] = useState(paintColors[0]);
  const [autoRotate, setAutoRotate] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [showForceBtn, setShowForceBtn] = useState(false);
  const [activeAngle, setActiveAngle] = useState('Front');
  const [hoveredHotspot, setHoveredHotspot] = useState(null);

  const applyColor = (colorObj) => {
    const modelViewer = modelViewerRef.current;
    if (modelViewer && modelViewer.model) {
      // Find Material.019 (identified as body paint color)
      const bodyMaterial = modelViewer.model.materials.find(
        (m) => m.name === 'Material.019'
      );
      if (bodyMaterial) {
        bodyMaterial.pbrMetallicRoughness.setBaseColorFactor(colorObj.rgb);
      }
    }
  };

  const handleColorChange = (colorObj) => {
    setSelectedColor(colorObj);
    applyColor(colorObj);
  };

  const handleCameraChange = (angleObj) => {
    const modelViewer = modelViewerRef.current;
    if (modelViewer) {
      modelViewer.cameraOrbit = angleObj.orbit;
      modelViewer.cameraTarget = angleObj.target;
      setActiveAngle(angleObj.name);
    }
  };

  const handleSelectM3 = () => {
    onSelectVehicle({
      make: 'BMW',
      model: 'M3',
      year: '2021',
      engine: '3.0L Competition Twin-Turbo I6 (503 HP)'
    });
  };

  const handleForceLoad = () => {
    setIsLoading(false);
    setShowForceBtn(false);
    // Apply color in next tick to allow DOM layout to settle
    setTimeout(() => applyColor(selectedColor), 50);
  };

  // Attach native model-viewer event listeners for load progress and completion
  useEffect(() => {
    const modelViewer = modelViewerRef.current;
    if (!modelViewer) return;

    let active = true;

    // Timer to display a Skip/Force loading button if WebGL loading takes too long
    const timer = setTimeout(() => {
      if (active && isLoading) {
        setShowForceBtn(true);
      }
    }, 4000);

    const onLoad = () => {
      if (!active) return;
      setIsLoading(false);
      setShowForceBtn(false);
      // Wait a tiny bit for material slots to be fully accessible
      setTimeout(() => applyColor(selectedColor), 50);
    };

    const onProgress = (event) => {
      if (!active) return;
      const progressPercent = Math.round((event.detail.totalProgress || 0) * 100);
      setProgress(progressPercent);
      if (progressPercent >= 100) {
        onLoad();
      }
    };

    const onError = (error) => {
      if (!active) return;
      console.error('Model-viewer loading error:', error);
      // Fallback: hide loading if there is an error so they can see any visual feedback
      setIsLoading(false);
    };

    const setupListeners = () => {
      modelViewer.addEventListener('load', onLoad);
      modelViewer.addEventListener('progress', onProgress);
      modelViewer.addEventListener('error', onError);

      // Check if model has already finished caching/loading
      if (modelViewer.loaded) {
        onLoad();
      }
    };

    // Ensure listeners are only attached after custom element is fully defined/upgraded
    if (customElements.get('model-viewer')) {
      setupListeners();
    } else {
      customElements.whenDefined('model-viewer').then(() => {
        if (active) setupListeners();
      });
    }

    return () => {
      active = false;
      clearTimeout(timer);
      modelViewer.removeEventListener('load', onLoad);
      modelViewer.removeEventListener('progress', onProgress);
      modelViewer.removeEventListener('error', onError);
    };
  }, [isM3, selectedColor]);



  if (!isM3) {
    return (
      <div className="section-wrapper" style={{ marginTop: '20px', marginBottom: '40px' }}>
        <div className="threed-teaser-card">
          <div className="threed-teaser-content">
            <div className="hero-subtitle">
              <Sparkles size={14} className="glow-text-gold" />
              <span>Interactive 3D Configurator</span>
            </div>
            <h3 className="threed-teaser-title">
              Experience the <span>Interactive 3D Garage</span>
            </h3>
            <p className="threed-teaser-desc">
              Unlock our cutting-edge WebGL customizer. Select the <strong>2021 BMW M3</strong> from your garage list (or click below) to view the car in immersive 3D, customize paint finishes, rotate, zoom, and explore styling accessories directly on the vehicle model.
            </p>
            <button className="checkout-btn" onClick={handleSelectM3}>
              <Box size={16} />
              <span>Load 2021 BMW M3 in 3D</span>
            </button>
          </div>
          <div className="threed-teaser-visual">
            <div className="threed-wireframe-grid"></div>
            <div className="threed-mock-car">
              <div className="spinning-loader-ring" style={{ width: '80px', height: '80px' }}></div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-grey)', textTransform: 'uppercase', letterSpacing: '2px', marginTop: '15px' }}>
                3D WebGL Engine Ready
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="section-wrapper" style={{ marginTop: '20px', marginBottom: '40px' }}>
      <div className="section-header">
        <div className="section-title-wrap">
          <span className="section-tagline">GOLDEN 3D Studio</span>
          <h2 className="section-title">BMW M3 <span>Interactive 3D Configurator</span></h2>
        </div>
      </div>

      <div className="threed-configurator-container">
        {/* Main 3D Canvas area */}
        <div className="threed-viewport-panel">
          {isLoading && (
            <div className="threed-loading-overlay">
              <div className="spinning-loader-ring"></div>
              <span className="loading-text">Loading 3D Car Model... {progress}%</span>
              <span className="loading-subtext">Caching WebGL Assets (~139MB)</span>
              {showForceBtn && (
                <button 
                  className="control-btn" 
                  style={{ marginTop: '20px', border: '1px solid var(--gold-primary)', background: 'rgba(230,185,48,0.1)', cursor: 'pointer' }}
                  onClick={handleForceLoad}
                >
                  تخطي والدخول للمجسم / Skip Loading
                </button>
              )}
            </div>
          )}
          
          <model-viewer
            ref={modelViewerRef}
            id="m3-viewer"
            src="/bmw_m3_competition_g80_opt.glb"
            ar
            ar-modes="webxr scene-viewer quick-look"
            camera-controls
            auto-rotate={autoRotate ? '' : null}
            auto-rotate-delay="4000"
            rotation-per-second="15deg"
            shadow-intensity="1.5"
            exposure="1.0"
            environment-image="neutral"
            interaction-prompt="none"
            camera-orbit="0deg 75deg 150%"
            camera-target="auto auto auto"
            min-camera-orbit="auto auto 50%"
            max-camera-orbit="auto auto 300%"
            style={{ 
              width: '100%', 
              height: '100%', 
              opacity: isLoading ? 0 : 1, 
              pointerEvents: isLoading ? 'none' : 'auto',
              transition: 'opacity 0.4s ease'
            }}
          >
            {/* Interactive Hotspots */}
            {hotspots.map((spot) => {
              const product = productsData.find((p) => p.id === spot.productId);
              return (
                <button
                  key={spot.id}
                  className="threed-hotspot"
                  slot={spot.slot}
                  data-position={spot.position}
                  data-normal={spot.normal}
                  onMouseEnter={() => setHoveredHotspot(spot)}
                  onMouseLeave={() => setHoveredHotspot(null)}
                  onClick={() => product && onProductClick(product)}
                >
                  <div className="threed-hotspot-pin"></div>
                  
                  {/* Tooltip Card */}
                  <div className={`threed-hotspot-tooltip ${hoveredHotspot?.id === spot.id ? 'visible' : ''}`}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                      <h6 className="tooltip-title">{spot.label}</h6>
                      {product && <span className="tooltip-price">${product.price}</span>}
                    </div>
                    <p className="tooltip-desc">{spot.desc}</p>
                    <div className="tooltip-action">
                      <span>Click to view details</span>
                      <ShoppingCart size={10} />
                    </div>
                  </div>
                </button>
              );
            })}
          </model-viewer>

          {/* Bottom Left: Controls overlay */}
          <div className="threed-controls-bar">
            <button 
              className={`control-btn ${autoRotate ? 'active' : ''}`} 
              onClick={() => setAutoRotate(!autoRotate)}
              title="Toggle Auto Rotation"
            >
              <RotateCw size={16} />
              <span>Auto Rotate</span>
            </button>
          </div>
        </div>

        {/* Customization controls panel */}
        <div className="threed-options-panel">
          <div className="panel-section">
            <h4 className="panel-section-title">
              <Palette size={16} className="glow-text-gold" />
              <span>OEM Paint Finish</span>
            </h4>
            <span className="selected-option-label">{selectedColor.name}</span>
            
            <div className="color-swatches-grid">
              {paintColors.map((color) => (
                <button
                  key={color.name}
                  className={`color-swatch-item ${selectedColor.name === color.name ? 'active' : ''}`}
                  style={{ backgroundColor: color.hex }}
                  onClick={() => handleColorChange(color)}
                  title={color.name}
                >
                  <div className="swatch-inner"></div>
                </button>
              ))}
            </div>
          </div>

          <div className="panel-section">
            <h4 className="panel-section-title">
              <Eye size={16} className="glow-text-red" />
              <span>Camera Angles</span>
            </h4>
            <div className="camera-angles-grid">
              {cameraAngles.map((angle) => (
                <button
                  key={angle.name}
                  className={`camera-angle-btn ${activeAngle === angle.name ? 'active' : ''}`}
                  onClick={() => handleCameraChange(angle)}
                >
                  <span>{angle.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Hotspots Quick Index */}
          <div className="panel-section" style={{ flexGrow: 1, borderBottom: 'none' }}>
            <h4 className="panel-section-title">
              <Sparkles size={16} className="glow-text-gold" />
              <span>Interactive Hotspots</span>
            </h4>
            <p style={{ color: 'var(--text-grey)', fontSize: '0.8rem', marginBottom: '14px', lineHeight: '1.4' }}>
              Hover over pins on the car model to inspect premium upgrades. Click a hotspot to view details.
            </p>
            <div className="hotspots-list">
              {hotspots.map((spot) => {
                const product = productsData.find((p) => p.id === spot.productId);
                return (
                  <div 
                    key={spot.id} 
                    className="hotspot-list-item"
                    onClick={() => product && onProductClick(product)}
                  >
                    <div className="hotspot-bullet"></div>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span className="hotspot-item-label">{spot.label}</span>
                      <span className="hotspot-item-product">{product?.name}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
