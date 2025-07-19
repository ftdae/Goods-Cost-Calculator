import React from 'react';
import { TrendingUp, DollarSign, Package, Truck } from 'lucide-react';

interface DashboardProps {
  invoices: any[];
  freightCosts: any[];
  landedCosts: any[];
  onQuickAction: (action: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ invoices, freightCosts, landedCosts, onQuickAction }) => {
  const totalInvoiceValue = invoices.reduce((sum, inv) => sum + (inv.totalValue || 0), 0);
  const totalFreightCosts = freightCosts.reduce((sum, freight) => sum + (freight.totalCost || 0), 0);
  const totalLandedCost = landedCosts.reduce((sum, cost) => sum + (cost.totalLandedCost || 0), 0);

  const stats = [
    {
      title: 'Total Invoice Value',
      value: `$${totalInvoiceValue.toLocaleString()}`,
      icon: DollarSign,
      color: 'text-blue-600 bg-blue-100',
    },
    {
      title: 'Total Freight Costs',
      value: `$${totalFreightCosts.toLocaleString()}`,
      icon: Truck,
      color: 'text-amber-600 bg-amber-100',
    },
    {
      title: 'Active Invoices',
      value: invoices.length.toString(),
      icon: Package,
      color: 'text-green-600 bg-green-100',
    },
    {
      title: 'Total Landed Cost',
      value: `$${totalLandedCost.toLocaleString()}`,
      icon: TrendingUp,
      color: 'text-purple-600 bg-purple-100',
    },
  ];

  return (
    <div className="space-y-8">

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <Icon className="h-6 w-6" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
        </div>
        <div className="p-6">
          {invoices.length === 0 && freightCosts.length === 0 && landedCosts.length === 0 ? (
            <div className="text-center py-8">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No activity yet. Start by adding invoices or freight costs.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {invoices.slice(-3).map((invoice, index) => (
                <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100">
                  <div>
                    <p className="font-medium text-gray-900">Invoice {invoice.invoiceNumber}</p>
                    <p className="text-sm text-gray-500">Supplier: {invoice.supplier}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">${invoice.totalValue?.toLocaleString()}</p>
                    <p className="text-sm text-gray-500">{invoice.currency}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Quick Actions</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button 
              onClick={() => onQuickAction('invoice')}
              className="flex items-center justify-center px-4 py-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <Package className="h-5 w-5 mr-2" />
              Add New Invoice
            </button>
            <button 
              onClick={() => onQuickAction('freight')}
              className="flex items-center justify-center px-4 py-3 bg-amber-50 text-amber-700 rounded-lg hover:bg-amber-100 transition-colors"
            >
              <Truck className="h-5 w-5 mr-2" />
              Calculate Freight
            </button>
            <button 
              onClick={() => onQuickAction('worksheet')}
              className="flex items-center justify-center px-4 py-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors"
            >
              <TrendingUp className="h-5 w-5 mr-2" />
              Generate Worksheet
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;