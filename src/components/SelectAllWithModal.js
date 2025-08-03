import React, { useState } from 'react';
import { Dialog } from '@headlessui/react';

const SelectAllWithModal = ({ onApplySelection }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectAllChecked, setSelectAllChecked] = useState(false);

  const [selectAllMode, setSelectAllMode] = useState('all'); // 'all' | 'range' | 'comma'
  const [rangeInput, setRangeInput] = useState('');
  const [commaInput, setCommaInput] = useState('');

  const handleSelectAllChange = (e) => {
    setSelectAllChecked(e.target.checked);
    if (e.target.checked) {
      setIsModalOpen(true); // Open modal
    } else {
      // Uncheck all
      onApplySelection([]);
    }
  };

  const applySelection = () => {
    let selectedIds = [];

    if (selectAllMode === 'all') {
      selectedIds = 'ALL';
    } else if (selectAllMode === 'range') {
      const [start, end] = rangeInput.split('-').map(Number);
      if (!isNaN(start) && !isNaN(end) && start <= end) {
        selectedIds = Array.from({ length: end - start + 1 }, (_, i) => start + i - 1);
      }
    } else if (selectAllMode === 'comma') {
      selectedIds = commaInput
        .split(',')
        .map((id) => parseInt(id.trim())-1)
        .filter((id) => !isNaN(id));
    }

    onApplySelection(selectedIds);
    setIsModalOpen(false);
  };

  return (
    <>
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={selectAllChecked}
          onChange={handleSelectAllChange}
        />
        Select All
      </label>

      <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/40" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-md bg-white rounded-lg p-6 space-y-4 shadow-xl">
            <Dialog.Title className="text-lg font-bold">Select Options</Dialog.Title>

            <div>
              <label className="block mb-1 font-medium">Mode:</label>
              <select
                className="w-full border px-3 py-2 rounded"
                value={selectAllMode}
                onChange={(e) => setSelectAllMode(e.target.value)}
              >
                <option value="all">Select All</option>
                <option value="range">Range (e.g., 101-150)</option>
                <option value="comma">Comma-separated IDs</option>
              </select>
            </div>

            {selectAllMode === 'range' && (
              <input
                type="text"
                className="w-full border px-3 py-2 rounded"
                placeholder="Enter range (e.g. 101-150)"
                value={rangeInput}
                onChange={(e) => setRangeInput(e.target.value)}
              />
            )}

            {selectAllMode === 'comma' && (
              <input
                type="text"
                className="w-full border px-3 py-2 rounded"
                placeholder="Enter comma-separated IDs (e.g. 101,105,110)"
                value={commaInput}
                onChange={(e) => setCommaInput(e.target.value)}
              />
            )}

            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                onClick={applySelection}
              >
                Apply
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </>
  );
};

export default SelectAllWithModal;
