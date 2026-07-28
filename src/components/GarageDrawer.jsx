import React, { useState, useEffect } from 'react';
import { X, Trash2, CheckCircle, Plus, AlertCircle, Car } from 'lucide-react';
import { vehiclesData } from '../data/catalog';

export default function GarageDrawer({ 
  isOpen, 
  onClose, 
  garageList, 
  activeVehicle, 
  onSetActiveVehicle, 
  onAddVehicle, 
  onDeleteVehicle 
}) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');
  const [engine, setEngine] = useState('');

  // Reset dropdowns
  useEffect(() => {
    setModel('');
    setEngine('');
  }, [make]);

  useEffect(() => {
    setEngine('');
  }, [model]);

  const availableModels = make ? vehiclesData.models[make] : [];
  const engineKey = `${make}-${model}`;
  const availableEngines = (make && model) ? vehiclesData.engines[engineKey] : [];

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (make && model && year && engine) {
      onAddVehicle({ make, model, year, engine });
      setMake('');
      setModel('');
      setYear('');
      setEngine('');
      setShowAddForm(false);
    }
  };

  const isFormValid = make && model && year && engine;

  return (
    <div className={`drawer-backdrop ${isOpen ? 'open' : ''}`} onClick={onClose}>
      <div className="drawer-panel" onClick={(e) => e.stopPropagation()}>
        {/* Drawer Header */}
        <div className="drawer-header">
          <h3 className="drawer-title">
            <Car size={20} className="glow-text-red" />
            <span>My Garage</span>
          </h3>
          <button className="drawer-close" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        {/* Drawer Scrollable Content */}
        <div className="drawer-content">
          {/* Active Saved Vehicles List */}
          <div className="garage-list">
            <h4 className="garage-add-title">Saved Vehicles</h4>
            {garageList.length === 0 ? (
              <p className="garage-empty-text">Your garage is currently empty. Add a vehicle to filter compatible spare parts.</p>
            ) : (
              garageList.map((veh, index) => {
                const isActive = activeVehicle && 
                  activeVehicle.make === veh.make && 
                  activeVehicle.model === veh.model && 
                  activeVehicle.year === veh.year && 
                  activeVehicle.engine === veh.engine;

                return (
                  <div 
                    key={index} 
                    className={`garage-card-item ${isActive ? 'active' : ''}`}
                    onClick={() => onSetActiveVehicle(veh)}
                  >
                    <div className="garage-card-info">
                      {isActive && <span className="garage-card-meta">Active Filter</span>}
                      <h5 className="garage-card-title">{veh.year} {veh.make} {veh.model}</h5>
                      <span className="garage-card-engine">{veh.engine}</span>
                    </div>

                    <div className="garage-card-actions" onClick={(e) => e.stopPropagation()}>
                      {!isActive && (
                        <button 
                          className="garage-action-icon select"
                          onClick={() => onSetActiveVehicle(veh)}
                          title="Set Active"
                        >
                          <CheckCircle size={18} />
                        </button>
                      )}
                      <button 
                        className="garage-action-icon delete"
                        onClick={() => onDeleteVehicle(veh)}
                        title="Delete Vehicle"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Add Vehicle Button / Form Toggle */}
          {!showAddForm ? (
            <button 
              className="checkout-btn" 
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px dashed var(--border-light)', boxShadow: 'none' }}
              onClick={() => setShowAddForm(true)}
            >
              <Plus size={16} />
              <span>Add Another Vehicle</span>
            </button>
          ) : (
            <div style={{ marginTop: '10px', background: 'rgba(0,0,0,0.15)', padding: '20px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h5 className="garage-add-title" style={{ margin: 0 }}>Add Vehicle Details</h5>
                <button style={{ color: 'var(--text-grey)', fontSize: '0.8rem', cursor: 'pointer' }} onClick={() => setShowAddForm(false)}>Cancel</button>
              </div>

              <form onSubmit={handleAddSubmit} className="garage-form">
                <select 
                  className="garage-select-input"
                  value={make}
                  onChange={(e) => setMake(e.target.value)}
                >
                  <option value="">Select Make</option>
                  {vehiclesData.makes.map(m => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>

                <select 
                  className="garage-select-input"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  disabled={!make}
                >
                  <option value="">Select Model</option>
                  {availableModels.map(m => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>

                <select 
                  className="garage-select-input"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  disabled={!model}
                >
                  <option value="">Select Year</option>
                  {vehiclesData.years.map(y => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>

                <select 
                  className="garage-select-input"
                  value={engine}
                  onChange={(e) => setEngine(e.target.value)}
                  disabled={!model}
                >
                  <option value="">Select Engine</option>
                  {availableEngines.map(eg => (
                    <option key={eg} value={eg}>{eg}</option>
                  ))}
                </select>

                <button 
                  type="submit" 
                  className="checkout-btn" 
                  style={{ marginTop: '8px' }}
                  disabled={!isFormValid}
                >
                  Save Vehicle
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
