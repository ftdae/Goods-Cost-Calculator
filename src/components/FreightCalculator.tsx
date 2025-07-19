import React, { useState } from 'react';
import { Truck, Plane, Ship, Plus, Calculator } from 'lucide-react';

interface FreightCost {
  id: string;
  shipmentType: string;
  origin: string;
  destination: string;
  weight: number;
  volume: number;
  freightRate: number;
  fuelSurcharge: number;
  insurance: number;
  handling: number;
  documentation: number;
  totalCost: number;
  createdDate: string;
}

interface FreightCalculatorProps {
  freightCosts: FreightCost[];
  setFreightCosts: React.Dispatch<React.SetStateAction<FreightCost[]>>;
}

const FreightCalculator: React.FC<FreightCalculatorProps> = ({ freightCosts, setFreightCosts }) => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<Partial<FreightCost>>({
    shipmentType: 'sea',
    origin: '',
    destination: '',
    weight: 0,
    volume: 0,
    freightRate: 0,
    fuelSurcharge: 0,
    insurance: 0,
    handling: 0,
    documentation: 0,
  });

  const shipmentTypes = [
    { value: 'sea', label: 'Sea Freight', icon: Ship, color: 'text-blue-600' },
    { value: 'air', label: 'Air Freight', icon: Plane, color: 'text-sky-600' },
    { value: 'road', label: 'Road Freight', icon: Truck, color: 'text-green-600' },
  ];

  const calculateTotalCost = (data: Partial<FreightCost>) => {
    const baseFreight = (data.freightRate || 0) * (data.weight || 0);
    const totalCost = baseFreight + 
                     (data.fuelSurcharge || 0) + 
                     (data.insurance || 0) + 
                     (data.handling || 0) + 
                     (data.documentation || 0);
    return totalCost;
  };

  const saveFreightCost = () => {
    const totalCost = calculateTotalCost(formData);
    const freightCost: FreightCost = {
      id: Date.now().toString(),
      ...formData as Omit<FreightCost, 'id' | 'totalCost' | 'createdDate'>,
      totalCost,
      createdDate: new Date().toISOString(),
    };

    setFreightCosts(prev => [...prev, freightCost]);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      shipmentType: 'sea',
      origin: '',
      destination: '',
      weight: 0,
      volume: 0,
      freightRate: 0,
      fuelSurcharge: 0,
      insurance: 0,
      handling: 0,
      documentation: 0,
    });
    setShowForm(false);
  };

  const deleteFreightCost = (id: string) => {
    setFreightCosts(prev => prev.filter(fc => fc.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Freight Calculator</h2>
          <p className="mt-2 text-gray-600">Calculate shipping costs for different freight methods</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Freight Calculation
        </button>
      </div>

      {/* Freight Form */}
      {showForm && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Calculate Freight Costs</h3>
          
          {/* Shipment Type Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">Shipment Type</label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {shipmentTypes.map((type) => {
                const Icon = type.icon;
                return (
                  <button
                    key={type.value}
                    onClick={() => setFormData(prev => ({ ...prev, shipmentType: type.value }))}
                    className={`flex items-center justify-center p-4 border-2 rounded-lg transition-colors ${
                      formData.shipmentType === type.value
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <Icon className={`h-6 w-6 mr-3 ${type.color}`} />
                    <span className="font-medium">{type.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Route Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Origin</label>
              <input
                type="text"
                value={formData.origin}
                onChange={(e) => setFormData(prev => ({ ...prev, origin: e.target.value }))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Port/Airport of Origin"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Destination</label>
              <input
                type="text"
                value={formData.destination}
                onChange={(e) => setFormData(prev => ({ ...prev, destination: e.target.value }))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Port/Airport of Destination"
              />
            </div>
          </div>

          {/* Shipment Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Weight (kg)</label>
              <input
                type="number"
                step="0.01"
                value={formData.weight}
                onChange={(e) => setFormData(prev => ({ ...prev, weight: parseFloat(e.target.value) }))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0.00"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Volume (m³)</label>
              <input
                type="number"
                step="0.01"
                value={formData.volume}
                onChange={(e) => setFormData(prev => ({ ...prev, volume: parseFloat(e.target.value) }))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0.00"
              />
            </div>
          </div>

          {/* Cost Components */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Freight Rate ($/kg)</label>
              <input
                type="number"
                step="0.01"
                value={formData.freightRate}
                onChange={(e) => setFormData(prev => ({ ...prev, freightRate: parseFloat(e.target.value) }))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0.00"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Fuel Surcharge ($)</label>
              <input
                type="number"
                step="0.01"
                value={formData.fuelSurcharge}
                onChange={(e) => setFormData(prev => ({ ...prev, fuelSurcharge: parseFloat(e.target.value) }))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0.00"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Insurance ($)</label>
              <input
                type="number"
                step="0.01"
                value={formData.insurance}
                onChange={(e) => setFormData(prev => ({ ...prev, insurance: parseFloat(e.target.value) }))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0.00"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Handling ($)</label>
              <input
                type="number"
                step="0.01"
                value={formData.handling}
                onChange={(e) => setFormData(prev => ({ ...prev, handling: parseFloat(e.target.value) }))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0.00"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Documentation ($)</label>
              <input
                type="number"
                step="0.01"
                value={formData.documentation}
                onChange={(e) => setFormData(prev => ({ ...prev, documentation: parseFloat(e.target.value) }))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0.00"
              />
            </div>
          </div>

          {/* Cost Breakdown */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-3">Cost Breakdown</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-600">Base Freight</p>
                <p className="text-lg font-semibold text-gray-900">
                  ${((formData.freightRate || 0) * (formData.weight || 0)).toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Additional Charges</p>
                <p className="text-lg font-semibold text-gray-900">
                  ${((formData.fuelSurcharge || 0) + (formData.insurance || 0) + (formData.handling || 0) + (formData.documentation || 0)).toFixed(2)}
                </p>
              </div>
              <div className="md:col-span-1 col-span-2">
                <p className="text-sm text-gray-600">Total Cost</p>
                <p className="text-2xl font-bold text-blue-600">
                  ${calculateTotalCost(formData).toFixed(2)}
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              onClick={resetForm}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={saveFreightCost}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Save Calculation
            </button>
          </div>
        </div>
      )}

      {/* Freight Costs List */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Freight Calculations ({freightCosts.length})</h3>
        </div>
        <div className="overflow-x-auto">
          {freightCosts.length === 0 ? (
            <div className="text-center py-12">
              <Calculator className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No freight calculations yet</p>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Route</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Weight</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Volume</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Cost</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {freightCosts.map((cost) => {
                  const type = shipmentTypes.find(t => t.value === cost.shipmentType);
                  const Icon = type?.icon || Truck;
                  return (
                    <tr key={cost.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Icon className={`h-5 w-5 mr-2 ${type?.color || 'text-gray-600'}`} />
                          <span className="text-sm font-medium text-gray-900">{type?.label}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {cost.origin} → {cost.destination}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {cost.weight} kg
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {cost.volume} m³
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        ${cost.totalCost.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(cost.createdDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => deleteFreightCost(cost.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default FreightCalculator;