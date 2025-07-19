import React, { useState } from 'react';
import { Calculator, FileText, TrendingUp, Download, Plus, Upload, User, Settings, LogOut, Menu } from 'lucide-react';
import InvoiceManager from './components/InvoiceManager';
import FreightCalculator from './components/FreightCalculator';
import LandedCostWorksheet from './components/LandedCostWorksheet';
import Dashboard from './components/Dashboard';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [invoices, setInvoices] = useState([]);
  const [freightCosts, setFreightCosts] = useState([]);
  const [landedCosts, setLandedCosts] = useState([]);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: TrendingUp },
    { id: 'invoices', label: 'Invoice Manager', icon: FileText },
    { id: 'freight', label: 'Freight Calculator', icon: Calculator },
    { id: 'worksheet', label: 'Landed Cost Worksheet', icon: Download },
  ];

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'invoice':
        setActiveTab('invoices');
        break;
      case 'freight':
        setActiveTab('freight');
        break;
      case 'worksheet':
        setActiveTab('worksheet');
        break;
    }
  };
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className={`bg-white shadow-lg transition-all duration-300 ${sidebarCollapsed ? 'w-16' : 'w-64'} flex flex-col`}>
        {/* Sidebar Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            {!sidebarCollapsed && (
              <div className="flex items-center">
                <Calculator className="h-8 w-8 text-blue-600" />
                <h1 className="ml-3 text-xl font-bold text-gray-900">Landed Cost</h1>
              </div>
            )}
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Menu className="h-5 w-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <div className="space-y-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-500'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  {!sidebarCollapsed && <span className="ml-3">{tab.label}</span>}
                </button>
              );
            })}
          </div>
        </nav>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="px-6 py-4">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {tabs.find(tab => tab.id === activeTab)?.label}
                </h2>
                <p className="text-sm text-gray-500">
                  Professional Import Cost Analysis Tool
                </p>
              </div>
              
              {/* User Profile */}
              <div className="relative">
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">John Smith</p>
                    <p className="text-xs text-gray-500">Import Manager</p>
                  </div>
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="h-6 w-6 text-blue-600" />
                  </div>
                </button>
                
                {/* Profile Dropdown */}
                {showProfileMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                    <button className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                      <User className="h-4 w-4 mr-3" />
                      Profile
                    </button>
                    <button className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                      <Settings className="h-4 w-4 mr-3" />
                      Settings
                    </button>
                    <hr className="my-1" />
                    <button className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                      <LogOut className="h-4 w-4 mr-3" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>
        {/* Main Content */}
        <main className="flex-1 p-6 overflow-auto">
          {activeTab === 'dashboard' && (
            <Dashboard 
              invoices={invoices} 
              freightCosts={freightCosts} 
              landedCosts={landedCosts}
              onQuickAction={handleQuickAction}
            />
          )}
          {activeTab === 'invoices' && (
            <InvoiceManager 
              invoices={invoices} 
              setInvoices={setInvoices} 
            />
          )}
          {activeTab === 'freight' && (
            <FreightCalculator 
              freightCosts={freightCosts} 
              setFreightCosts={setFreightCosts} 
            />
          )}
          {activeTab === 'worksheet' && (
            <LandedCostWorksheet 
              invoices={invoices}
              freightCosts={freightCosts}
              landedCosts={landedCosts}
              setLandedCosts={setLandedCosts}
            />
          )}
        </main>
      </div>
    </div>
  );
}

export default App;