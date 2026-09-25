import React, { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';
import { readCompanyFile, writeCompanyFile } from '../utils/jsonFile';

const CorrugatedData = () => {
  const [records, setRecords] = useState([]);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');
  const filePath = process.env.REACT_APP_INPUTCORRUGATEDFILE;

  const refresh = async () => {
    try {
      const data = await readCompanyFile(filePath);
      setRecords(data.companyData);
      setError('');
    } catch (err) {
      console.error('Unable to read corrugated data:', err);
      setError('Unable to read corrugated data. Check the JSON path in .env.');
    }
  };
  useEffect(() => { refresh(); }, []);

  const remove = async (srno) => {
    const data = await readCompanyFile(filePath);
    data.companyData = data.companyData.filter((record) => record.srno !== srno).map((record, index) => ({ ...record, srno: index }));
    await writeCompanyFile(filePath, data);
    setRecords(data.companyData);
  };
  const exportExcel = () => {
    const sheet = XLSX.utils.json_to_sheet(records);
    const book = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(book, sheet, 'Corrugated Data');
    XLSX.writeFile(book, 'corrugated-box-calculations.xlsx');
  };
  const visible = records.filter((record) => Object.values(record).some((value) => String(value).toLowerCase().includes(search.toLowerCase()))).slice().reverse();

  return <main className="pt-24 pb-20 px-6 h-screen overflow-y-auto text-white">
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-5">
        <h1 className="text-3xl font-bold">Corrugated Data Storage</h1>
        <div className="flex gap-3"><input aria-label="Search corrugated records" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search saved calculations" className="rounded-md border border-gray-600 bg-gray-700 px-3 py-2 text-white" /><button onClick={exportExcel} className="rounded-md bg-zinc-700 px-4 py-2 hover:bg-zinc-600">Export to Excel</button></div>
      </div>
      {error && <p role="alert" className="mb-4 text-red-300">{error}</p>}
      <div className="overflow-auto rounded-lg shadow-md">
        <table className="min-w-full text-left text-sm text-gray-200">
          <thead className="bg-gray-700 text-gray-100"><tr>{['', 'Date', 'Ply', 'Box (L × W × H mm)', 'Quantity', 'Blank Area (m²)', 'Board Weight / Box (kg)', 'Manufacturing / Box', 'Selling / Box', 'Order Value'].map((heading) => <th key={heading} className="whitespace-nowrap px-4 py-3">{heading}</th>)}</tr></thead>
          <tbody>{visible.map((record) => <tr key={`${record.srno}-${record.date}`} className="border-b border-gray-700 hover:bg-gray-800">
            <td className="px-4 py-3"><button title="Delete record" onClick={() => remove(record.srno)} className="text-red-300 hover:text-red-100">×</button></td>
            <td className="px-4 py-3">{record.date}</td><td className="px-4 py-3">{record.ply}-Ply</td>
            <td className="whitespace-nowrap px-4 py-3">{record.length} × {record.width} × {record.height}</td><td className="px-4 py-3">{record.quantity}</td>
            <td className="px-4 py-3">{Number(record.area || 0).toFixed(3)}</td><td className="px-4 py-3">{Number(record.boardWeight || 0).toFixed(3)}</td>
            <td className="px-4 py-3">₹{Number(record.manufacturingCost || 0).toFixed(2)}</td><td className="px-4 py-3">₹{Number(record.sellingPrice || 0).toFixed(2)}</td><td className="px-4 py-3">₹{Number(record.orderValue || 0).toFixed(2)}</td>
          </tr>)}
          {visible.length === 0 && <tr><td colSpan="10" className="px-4 py-8 text-center text-gray-400">No saved calculations found.</td></tr>}</tbody>
        </table>
      </div>
    </div>
  </main>;
};

export default CorrugatedData;
