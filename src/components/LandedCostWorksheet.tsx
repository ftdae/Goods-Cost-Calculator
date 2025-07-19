import React, { useState, useEffect } from 'react';
import { Download, FileText, Calculator, Plus } from 'lucide-react';

interface LandedCostItem {
  id: string;
  invoiceId: string;
  invoiceNumber: string;
  supplier: string;
  itemDescription: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  freightCost: number;
  dutyRate: number;
  dutyAmount: number;
  taxRate: number;
  taxAmount: number;
  otherCharges: number;
  totalLandedCost: number;
  unitLandedCost: number;
  currency: string;
  exchangeRate: number;
}

interface LandedCostWorksheetProps {
  invoices: any[];
  freightCosts: any[];
  landedCosts: LandedCostItem[];
  setLandedCosts: React.Dispatch<React.SetStateAction<LandedCostItem[]>>;
}

const LandedCostWorksheet: React.FC<LandedCostWorksheetProps> = ({
  invoices,
  freightCosts,
  landedCosts,
  setLandedCosts
}) => {
  const [selectedInvoice, setSelectedInvoice] = useState('');
  const [selectedFreight, setSelectedFreight] = useState('');
  const [dutyRates, setDutyRates] = useState<{[key: string]: number}>({});
  const [taxRate, setTaxRate] = useState(10); // Default 10% tax
  const [otherCharges, setOtherCharges] = useState(0);

  const generateLandedCostItems = () => {
    if (!selectedInvoice || !selectedFreight) return;

    const invoice = invoices.find(inv => inv.id === selectedInvoice);
    const freight = freightCosts.find(fc => fc.id === selectedFreight);

    if (!invoice || !freight) return;

    const totalInvoiceValue = invoice.totalValue;
    const totalFreightCost = freight.totalCost;
    
    const newLandedCostItems: LandedCostItem[] = invoice.items.map((item: any) => {
      // Allocate freight cost proportionally based on item value
      const itemValueRatio = item.totalPrice / totalInvoiceValue;
      const allocatedFreightCost = totalFreightCost * itemValueRatio;
      
      // Calculate duty
      const dutyRate = dutyRates[item.hsCode] || 0;
      const dutyBase = item.totalPrice + allocatedFreightCost;
      const dutyAmount = dutyBase * (dutyRate / 100);
      
      // Calculate tax (typically on goods value + freight + duty)
      const taxBase = item.totalPrice + allocatedFreightCost + dutyAmount;
      const taxAmount = taxBase * (taxRate / 100);
      
      // Allocate other charges proportionally
      const allocatedOtherCharges = otherCharges * itemValueRatio;
      
      // Calculate total landed cost
      const totalLandedCost = item.totalPrice + allocatedFreightCost + dutyAmount + taxAmount + allocatedOtherCharges;
      const unitLandedCost = totalLandedCost / item.quantity;

      return {
        id: `${invoice.id}-${Date.now()}-${Math.random()}`,
        invoiceId: invoice.id,
        invoiceNumber: invoice.invoiceNumber,
        supplier: invoice.supplier,
        itemDescription: item.description,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        totalPrice: item.totalPrice,
        freightCost: allocatedFreightCost,
        dutyRate,
        dutyAmount,
        taxRate,
        taxAmount,
        otherCharges: allocatedOtherCharges,
        totalLandedCost,
        unitLandedCost,
        currency: invoice.currency,
        exchangeRate: invoice.exchangeRate,
      };
    });

    setLandedCosts(prev => [...prev, ...newLandedCostItems]);
    
    // Reset form
    setSelectedInvoice('');
    setSelectedFreight('');
    setDutyRates({});
    setOtherCharges(0);
  };

  const exportToCSV = () => {
    const headers = [
      'Invoice Number',
      'Supplier',
      'Item Description',
      'Quantity',
      'Unit Price',
      'Total Price',
      'Freight Cost',
      'Duty Rate (%)',
      'Duty Amount',
      'Tax Rate (%)',
      'Tax Amount',
      'Other Charges',
      'Total Landed Cost',
      'Unit Landed Cost',
      'Currency',
      'Exchange Rate'
    ];

    const csvContent = [
      headers.join(','),
      ...landedCosts.map(item => [
        item.invoiceNumber,
        item.supplier,
        item.itemDescription,
        item.quantity,
        item.unitPrice.toFixed(2),
        item.totalPrice.toFixed(2),
        item.freightCost.toFixed(2),
        item.dutyRate.toFixed(2),
        item.dutyAmount.toFixed(2),
        item.taxRate.toFixed(2),
        item.taxAmount.toFixed(2),
        item.otherCharges.toFixed(2),
        item.totalLandedCost.toFixed(2),
        item.unitLandedCost.toFixed(2),
        item.currency,
        item.exchangeRate
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `landed-cost-worksheet-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const selectedInvoiceData = invoices.find(inv => inv.id === selectedInvoice);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Landed Cost Worksheet</h2>
          <p className="mt-2 text-gray-600">Generate comprehensive landed cost calculations</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={exportToCSV}
            disabled={landedCosts.length === 0}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Calculation Form */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">Generate Landed Cost Calculation</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Invoice</label>
            <select
              value={selectedInvoice}
              onChange={(e) => setSelectedInvoice(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Choose an invoice...</option>
              {invoices.map(invoice => (
                <option key={invoice.id} value={invoice.id}>
                  {invoice.invoiceNumber} - {invoice.supplier} (${invoice.totalValue.toLocaleString()})
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Freight Cost</label>
            <select
              value={selectedFreight}
              onChange={(e) => setSelectedFreight(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Choose freight calculation...</option>
              {freightCosts.map(freight => (
                <option key={freight.id} value={freight.id}>
                  {freight.origin} → {freight.destination} (${freight.totalCost.toLocaleString()})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tax Rate (%)</label>
            <input
              type="number"
              step="0.01"
              value={taxRate}
              onChange={(e) => setTaxRate(parseFloat(e.target.value))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="10.00"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Other Charges ($)</label>
            <input
              type="number"
              step="0.01"
              value={otherCharges}
              onChange={(e) => setOtherCharges(parseFloat(e.target.value))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="0.00"
            />
          </div>
        </div>

        {/* Duty Rates for Items */}
        {selectedInvoiceData && (
          <div className="mb-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Duty Rates by Item</h4>
            <div className="space-y-3">
              {selectedInvoiceData.items.map((item: any, index: number) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{item.description}</p>
                    <p className="text-sm text-gray-600">HS Code: {item.hsCode || 'Not specified'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Value: ${item.totalPrice.toFixed(2)}</p>
                    <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Duty Rate (%)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={dutyRates[item.hsCode] || 0}
                      onChange={(e) => setDutyRates(prev => ({
                        ...prev,
                        [item.hsCode]: parseFloat(e.target.value) || 0
                      }))}
                      className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="0.00"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-end">
          <button
            onClick={generateLandedCostItems}
            disabled={!selectedInvoice || !selectedFreight}
            className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            <Calculator className="h-4 w-4 mr-2" />
            Generate Landed Cost
          </button>
        </div>
      </div>

      {/* Landed Cost Items */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Landed Cost Items ({landedCosts.length})</h3>
        </div>
        <div className="overflow-x-auto">
          {landedCosts.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No landed cost calculations yet</p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Invoice</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Qty</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Unit Price</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total Price</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Freight</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Duty</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Tax</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Other</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Landed Cost</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Unit Landed</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {landedCosts.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{item.invoiceNumber}</div>
                        <div className="text-sm text-gray-500">{item.supplier}</div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-sm text-gray-900 max-w-xs truncate" title={item.itemDescription}>
                        {item.itemDescription}
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                      {item.quantity}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                      ${item.unitPrice.toFixed(2)}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                      ${item.totalPrice.toFixed(2)}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                      ${item.freightCost.toFixed(2)}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                      ${item.dutyAmount.toFixed(2)}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                      ${item.taxAmount.toFixed(2)}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                      ${item.otherCharges.toFixed(2)}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium text-blue-600">
                      ${item.totalLandedCost.toFixed(2)}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                      ${item.unitLandedCost.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-gray-50">
                <tr>
                  <td colSpan={9} className="px-4 py-4 text-right text-sm font-medium text-gray-900">
                    Total Landed Cost:
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-right text-lg font-bold text-blue-600">
                    ${landedCosts.reduce((sum, item) => sum + item.totalLandedCost, 0).toFixed(2)}
                  </td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          )}
        </div>
      </div>

      {/* Summary Statistics */}
      {landedCosts.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Cost Analysis Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">
                ${landedCosts.reduce((sum, item) => sum + item.totalPrice, 0).toFixed(0)}
              </p>
              <p className="text-sm text-gray-600">Total Goods Value</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-amber-600">
                ${landedCosts.reduce((sum, item) => sum + item.freightCost, 0).toFixed(0)}
              </p>
              <p className="text-sm text-gray-600">Total Freight</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-red-600">
                ${landedCosts.reduce((sum, item) => sum + item.dutyAmount + item.taxAmount, 0).toFixed(0)}
              </p>
              <p className="text-sm text-gray-600">Total Duties & Taxes</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">
                ${landedCosts.reduce((sum, item) => sum + item.totalLandedCost, 0).toFixed(0)}
              </p>
              <p className="text-sm text-gray-600">Total Landed Cost</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LandedCostWorksheet;