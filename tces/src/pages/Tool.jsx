// src/pages/Tool.jsx
import React, { useState } from 'react';
import Tabs from '../components/Tabs';
import toolsData from '../data/tools';

const Tool = () => {
  const [tools, setTools] = useState(toolsData);
  const [activeTab, setActiveTab] = useState(0);
  const [form, setForm] = useState({ name: '', category: 'surveying' });
  const [expandedToolId, setExpandedToolId] = useState(null);

const toggleExpand = (id) => {
  if (expandedToolId === id) {
    setExpandedToolId(null);
  } else {
    setExpandedToolId(id);
  }
};

const handleAssign = (id, assignedTo) => {
  const updatedTools = tools.map(tool => 
    tool.id === id ? { ...tool, assignedTo } : tool
  );
  setTools(updatedTools);
};


  const categories = {
    all: tools,
    surveying: tools.filter(tool => tool.category === 'surveying'),
    civils: tools.filter(tool => tool.category === 'civils'),
    electronics: tools.filter(tool => tool.category === 'electronics'),
    others: tools.filter(tool => tool.category === 'others'),
  };

  const renderTools = (toolList) => (
    <div className="space-y-0">
      {toolList.length > 0 ? (
        toolList.map(tool => (
          <div key={tool.id} className="border-b">
            <div
              className="py-3 cursor-pointer flex justify-between items-center"
              onClick={() => toggleExpand(tool.id)}
            >
              <span className="text-gray-800 text-sm md:text-base">{tool.name}</span>
              <span className="text-gray-400 text-xs">{expandedToolId === tool.id ? '▲' : '▼'}</span>
            </div>
  
            {expandedToolId === tool.id && (
  <div className="p-3 bg-gray-50 text-sm space-y-2">
    <p><strong>Serial Number:</strong> {tool.serialNumber}</p>
    <p><strong>Assigned To:</strong> {tool.assignedTo || 'Unassigned'}</p>
    <p>
        <strong>Ownership:</strong>{' '}
        {tool.ownership === 'hired' && tool.hireCompany
            ? `Hired from ${tool.hireCompany}`
            : 'Owned'}
    </p>

    <select
      onChange={(e) => handleAssign(tool.id, e.target.value)}
      className="border rounded px-2 py-1 text-sm mt-2 w-full"
      value={tool.assignedTo}
    >
      <option value="">Assign to Staff</option>
      <option value="Altin Staka">Altin Staka</option>
      <option value="George Milliken">George Milliken</option>
      <option value="Tomilola Olaniyi">Tomilola Olaniyi</option>
    </select>
  </div>
)}

          </div>
        ))
      ) : (
        <p className="text-gray-500 text-center py-4">No tools found in this category.</p>
      )}
    </div>
  );
  

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleAddTool = (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;

    const newTool = {
      id: Date.now(),
      name: form.name.trim(),
      category: form.category,
    };

    setTools(prev => [...prev, newTool]);
    setForm({ name: '', category: 'surveying' });
    setActiveTab(0); // Go back to All Tools after adding
  };

  const tabs = [
    { label: `All Tools (${categories.all.length})`, content: renderTools(categories.all) },
    { label: `Surveying (${categories.surveying.length})`, content: renderTools(categories.surveying) },
    { label: `Civils (${categories.civils.length})`, content: renderTools(categories.civils) },
    { label: `Electronics (${categories.electronics.length})`, content: renderTools(categories.electronics) },
    { label: `Others (${categories.others.length})`, content: renderTools(categories.others) },
    {
      label: 'Add New Tool',
      content: (
        <div className="max-w-md mx-auto p-4 bg-white rounded-lg shadow-md">
          <form onSubmit={handleAddTool} className="space-y-4">
            <div>
              <label className="block mb-1 text-sm font-semibold text-gray-700">Tool Name</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleFormChange}
                className="w-full border rounded px-3 py-2"
                placeholder="Enter tool name"
                required
              />
            </div>
            <div>
              <label className="block mb-1 text-sm font-semibold text-gray-700">Category</label>
              <select
                name="category"
                value={form.category}
                onChange={handleFormChange}
                className="w-full border rounded px-3 py-2"
              >
                <option value="surveying">Surveying</option>
                <option value="civils">Civils</option>
                <option value="electronics">Electronics</option>
                <option value="others">Others</option>
              </select>
            </div>
            <button
              type="submit"
              className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2 rounded"
            >
              Add Tool
            </button>
          </form>
        </div>
      )
    }
  ];

  return (
    <div className="p-4">
      <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

export default Tool;
