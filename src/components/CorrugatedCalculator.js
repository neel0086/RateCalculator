import React, { useMemo, useState } from 'react';
import { readCompanyFile, writeCompanyFile } from '../utils/jsonFile';

const initial = { length: 0, width: 0, height: 0, quantity: 0, linerGsm: 0, mediumGsm: 0, fluteFactor: 0, jointFlap: 0, wastage: 0, linerRate: 0, mediumRate: 0, conversionRate: 0, printingCost: 0, otherCost: 0, markup: 0 };
const fields = [
  ['length', 'Box Length (mm)'], ['width', 'Box Width (mm)'], ['height', 'Box Height (mm)'], ['quantity', 'Quantity (pcs)'],
  ['linerGsm', 'Liner GSM'], ['mediumGsm', 'Medium GSM'], ['fluteFactor', 'Flute Factor'], ['jointFlap', 'Joint Flap (mm)'], ['wastage', 'Wastage %'],
  ['linerRate', 'Liner Rate (₹/kg)'], ['mediumRate', 'Medium Rate (₹/kg)'], ['conversionRate', 'Conversion (₹/kg board)'], ['printingCost', 'Printing/Stitching/Pasting (₹/box)'], ['otherCost', 'Other Cost (₹/box)'], ['markup', 'Profit / Markup %'],
];
const plyChoices = [3, 5, 7, 9];
const money = (n) => `₹${Number(n || 0).toFixed(2)}`;

export const calculateCorrugated = (input, ply) => {
  const liners = (ply + 1) / 2;
  const mediums = (ply - 1) / 2;
  // The workbook hard-codes 3 liner and 2 medium layers in its cost formulas
  // on the 3, 5 and 7 ply sheets. The added 9 ply tab uses its actual layers.
  const costLiners = ply === 9 ? liners : 3;
  const costMediums = ply === 9 ? mediums : 2;
  const blankLength = 2 * (Number(input.length) + Number(input.width)) + Number(input.jointFlap);
  const blankWidth = Number(input.width) + Number(input.height);
  const area = blankLength * blankWidth / 1000000;
  const boardGsm = liners * Number(input.linerGsm) + mediums * Number(input.mediumGsm) * Number(input.fluteFactor);
  const boardWeight = area * boardGsm / 1000;
  const adjustedWeight = boardWeight * (1 + Number(input.wastage) / 100);
  const linerCost = area * costLiners * Number(input.linerGsm) / 1000 * Number(input.linerRate) * (1 + Number(input.wastage) / 100);
  const mediumCost = area * costMediums * Number(input.mediumGsm) * Number(input.fluteFactor) / 1000 * Number(input.mediumRate) * (1 + Number(input.wastage) / 100);
  const conversionCost = adjustedWeight * Number(input.conversionRate);
  const manufacturingCost = linerCost + mediumCost + conversionCost + Number(input.printingCost) + Number(input.otherCost);
  const profit = manufacturingCost * Number(input.markup) / 100;
  const sellingPrice = manufacturingCost + profit;
  return { blankLength, blankWidth, area, boardGsm, boardWeight, adjustedWeight, totalBoardWeight: adjustedWeight * Number(input.quantity), linerCost, mediumCost, conversionCost, manufacturingCost, profit, sellingPrice, orderValue: sellingPrice * Number(input.quantity) };
};

const CorrugatedCalculator = () => {
  const [ply, setPly] = useState(5);
  const [input, setInput] = useState(initial);
  const [message, setMessage] = useState('');
  const results = useMemo(() => calculateCorrugated(input, ply), [input, ply]);
  const update = (key, value) => setInput((current) => ({ ...current, [key]: value === '' ? '' : Number(value) }));
  const save = async () => {
    try {
      const filePath = process.env.REACT_APP_INPUTCORRUGATEDFILE;
      const data = await readCompanyFile(filePath);
      const record = { ...input, ply, ...results, date: new Date().toLocaleDateString('en-IN'), srno: data.companyData.length };
      data.companyData.push(record);
      await writeCompanyFile(filePath, data);
      setMessage('Calculation saved to Corrugated Data.');
    } catch (error) {
      console.error('Unable to save corrugated calculation:', error);
      setMessage('Unable to save. Check the corrugated JSON path in .env.');
    }
  };
  const clear = () => {
    setInput({ ...initial });
    setPly(5);
    setMessage('');
  };
  const output = [
    ['Blank Length (mm)', results.blankLength, 'number'], ['Blank Width (mm)', results.blankWidth, 'number'], ['Blank Area (m²)', results.area, 'number'],
    [`${ply}-Ply Board GSM`, results.boardGsm, 'number'], ['Board Weight / Box (kg)', results.boardWeight, 'number'], ['Wastage-Adjusted Board kg/box', results.adjustedWeight, 'number'],
    ['Total Board Weight (kg)', results.totalBoardWeight, 'number'], ['Liner Cost / Box', results.linerCost, 'money'], ['Medium Cost / Box', results.mediumCost, 'money'],
    ['Conversion Cost / Box', results.conversionCost, 'money'], ['Manufacturing Cost / Box', results.manufacturingCost, 'money'], ['Profit / Box', results.profit, 'money'],
    ['Selling Price / Box', results.sellingPrice, 'money'], ['Total Order Value', results.orderValue, 'money'],
  ];
  return <main className="pt-24 pb-20 px-3 sm:px-4 h-screen overflow-y-auto text-white">
    <div className="w-full">
      <div className="flex gap-3 mb-5" role="tablist" aria-label="Ply selection">
        {plyChoices.map((choice) => <button key={choice} role="tab" aria-selected={ply === choice} onClick={() => setPly(choice)} className={`px-6 py-2 rounded-md font-bold ${ply === choice ? 'bg-pink-600' : 'bg-gray-700 hover:bg-gray-600'}`}>{choice} Ply</button>)}
      </div>
      <div className="grid lg:grid-cols-2 gap-4 items-start">
        <section className="p-4 rounded-lg bg-gray-800 shadow-md">
          <h2 className="text-xl font-semibold mb-4">Inputs</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {fields.map(([key, label]) => <label key={key} className="text-gray-200">{label}<input aria-label={label} type="number" min="0" step="any" value={input[key]} onChange={(event) => update(key, event.target.value)} className="smart-rate-input mt-1 block w-full rounded-md border bg-white px-3 py-2 text-gray-700 focus:outline-none" /></label>)}
          </div>
          <div className="mt-5 flex gap-3">
            <button onClick={save} className="px-6 py-2 rounded-md bg-pink-600 hover:bg-pink-700 font-semibold">Save</button>
            <button onClick={clear} className="px-6 py-2 rounded-md bg-zinc-600 hover:bg-zinc-700 font-semibold">Clear</button>
          </div>
          {message && <p role="status" className="mt-3 text-green-300">{message}</p>}
        </section>
        <section className="p-4 rounded-lg bg-gray-800 shadow-md">
          <h2 className="text-xl font-semibold mb-4">Calculations</h2>
          <div className="space-y-2">{output.map(([label, value, type]) => <div key={label} className="flex justify-between gap-4 border-b border-gray-700 py-2"><span className="text-gray-300">{label}</span><strong className={label.includes('Selling Price') || label.includes('Order Value') ? 'text-amber-300' : ''}>{type === 'money' ? money(value) : Number(value || 0).toFixed(3)}</strong></div>)}</div>
        </section>
      </div>
    </div>
  </main>;
};

export default CorrugatedCalculator;
