// src/pages/Card.jsx
import React, { useState, useEffect } from 'react';
import CardTemplate from '../components/CardTemplate';
import Tabs from '../components/Tabs';
import cardsData from '../data/cards';

const ConfirmDeleteModal = ({ onConfirm, onCancel, animate }) => (
  <div className={`fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 transition-opacity duration-300 ${animate === 'out' ? 'animate-fadeOut' : 'animate-fadeIn'}`}>
    <div className="bg-white p-6 rounded shadow-md text-center space-y-4">
      <h2 className="text-lg font-semibold">Confirm Deletion</h2>
      <p>Are you sure you want to delete this card?</p>
      <div className="flex justify-center gap-4">
        <button onClick={onCancel} className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400">Cancel</button>
        <button onClick={onConfirm} className="px-4 py-2 rounded bg-red-500 hover:bg-red-600 text-white">Delete</button>
      </div>
    </div>
  </div>
);

const Card = () => {
  const [cards, setCards] = useState(cardsData);
  const [form, setForm] = useState({ number: '', alias: '', expiry: '' });
  const [activeTab, setActiveTab] = useState(0);
  const [notification, setNotification] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);

  const formatCardNumber = (num) => num.toString().replace(/(\d{4})(?=\d)/g, '$1 ');

  const renderCardsContent = () => (
    <div className="flex flex-col gap-6">
      {cards.map((card, index) => (
        <div key={index} className="flex flex-wrap items-start gap-6 p-4 border rounded-lg">
          <div className="flex-1 min-w-[250px]">
            <CardTemplate
              vendor={card.vendor}
              number={formatCardNumber(card.number.toString())}
              alias={card.alias}
              expiry={card.expiry}
              company={card.company}
            />
          </div>
          <div className="flex flex-col gap-2 min-w-[200px]">
            <div className="text-sm text-gray-700">Assigned To: {card.assignedTo || 'Unassigned'}</div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleDeleteClick(index)}
                className="bg-red-500 hover:bg-red-600 text-white text-xs font-semibold px-3 py-1 rounded"
              >
                Delete
              </button>
              <select
                onChange={(e) => handleAssign(index, 'van', e.target.value)}
                className="border rounded px-2 py-1 text-xs"
              >
                <option value="">Assign to Van</option>
                <option value="NV19VJK">NV19VJK</option>
                <option value="SA15CZR">SA15CZR</option>
                <option value="XIG3089">XIG3089</option>
                <option value="WP18LVW">WP18LVW</option>
                <option value="SD07FVX">SD07FVX</option>
                <option value="NA16RWF">NA16RWF</option>
              </select>
              <select
                onChange={(e) => handleAssign(index, 'person', e.target.value)}
                className="border rounded px-2 py-1 text-xs"
              >
                <option value="">Assign to Staff</option>
                <option value="Tomilola Olaniyi">Tomilola Olaniyi</option>
                <option value="Altin Staka">Altin Staka</option>
                <option value="George Milliken">George Milliken</option>
              </select>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderAddCardForm = () => (
    <div>
      <h3 className="text-lg font-semibold mb-4">New Card Form</h3>
      {notification && (
        <div className="mb-4 p-2 bg-green-100 text-green-700 rounded">
          {notification}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
        <div>
          <label className="block text-sm font-medium mb-1">Card Number</label>
          <input
            type="number"
            name="number"
            value={form.number}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Card Alias Number</label>
          <input
            type="number"
            name="alias"
            value={form.alias}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Expiry Date (MM/YY)</label>
          <input
            type="text"
            name="expiry"
            value={form.expiry}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>
        <button type="submit" className="bg-orange-600 hover:bg-orange-700 text-white font-semibold px-4 py-2 rounded">
          Add Card
        </button>
      </form>
    </div>
  );

  const [tabs, setTabs] = useState([
    {
      label: `All Cards (${cardsData.length})`,
      content: <div>Loading...</div>
    },
    {
      label: 'Add New Card',
      content: <div>Loading...</div>
    }
  ]);

  useEffect(() => {
    setTabs([
      {
        label: `All Cards (${cards.length})`,
        content: renderCardsContent()
      },
      {
        label: 'Add New Card',
        content: renderAddCardForm()
      }
    ]);
  }, [cards, notification]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.number || !form.alias || !form.expiry) return;

    const numericNumber = parseInt(form.number, 10);

    const newCard = {
      vendor: 'FLEETMAXX SOLUTIONS',
      number: numericNumber,
      alias: `Track Civil Card ${form.alias}`,
      expiry: form.expiry,
      company: 'Track Civil Engineering Solutions',
      type: 'unassigned',
      assignedTo: ''
    };

    setCards((prev) => [...prev, newCard]);
    setForm({ number: '', alias: '', expiry: '' });
    setNotification('Card successfully added!');
    setActiveTab(0);
    setTimeout(() => setNotification(''), 3000);
  };

  const handleDeleteClick = (index) => {
    setDeleteIndex(index);
    setShowConfirm(true);
  };

  const handleConfirmDelete = () => {
    const updatedCards = [...cards];
    updatedCards.splice(deleteIndex, 1);
    setCards(updatedCards);
    setShowConfirm(false);
  };

  const handleCancelDelete = () => {
    setShowConfirm(false);
  };

  const handleAssign = (index, type, assignedTo) => {
    const updatedCards = [...cards];
    updatedCards[index].type = type;
    updatedCards[index].assignedTo = assignedTo;
    setCards(updatedCards);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };
  

  return (
    <div className="p-4">
      {showConfirm && (
        <ConfirmDeleteModal
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
          animate={showConfirm ? 'in' : 'out'}
        />
      )}
      <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

export default Card;
