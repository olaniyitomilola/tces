import React from 'react';

const Tabs = ({ tabs, activeTab, onTabChange }) => {
  return (
    <div className="flex flex-col">
      <div className="flex flex-wrap border-b mb-4">
        {tabs.map((tab, index) => (
          <button
            key={index}
            onClick={() => onTabChange(index)}
            className={`px-4 py-2 focus:outline-none ${
              activeTab === index ? 'border-b-2 border-orange-600 text-orange-600 font-semibold' : 'text-gray-600'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="p-2">
        {tabs[activeTab]?.content}
      </div>
    </div>
  );
};

export default Tabs;
