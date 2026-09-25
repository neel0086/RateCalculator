import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';
import Loading from './Loading';
import { readCompanyFile, writeCompanyFile } from '../utils/jsonFile';
import Whatsapp from '../assets/whatsapp.png';

const formatMoney = (value) => `₹${Number(value || 0).toFixed(2)}`;

const CorrugatedData = () => {
  const navigate = useNavigate();
  const [records, setRecords] = useState(null);
  const [search, setSearch] = useState('');
  const [selectedIds, setSelectedIds] = useState([]);
  const [showWhatsApp, setShowWhatsApp] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedSrno, setSelectedSrno] = useState('');
  const [whatsAppText, setWhatsAppText] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const filePath = process.env.REACT_APP_INPUTCORRUGATEDFILE;

  const refresh = async () => {
    try {
      const data = await readCompanyFile(filePath);
      setRecords(data.companyData);
      setError('');
    } catch (err) {
      console.error('Unable to read corrugated data:', err);
      setRecords([]);
      setError('Unable to read corrugated data. Check the JSON path in .env.');
    }
  };
  useEffect(() => { refresh(); }, []);

  const visibleRecords = useMemo(() => (records || [])
    .map((record, index) => [record, index])
    .filter(([record]) => Object.values(record).some((value) => String(value).toLowerCase().includes(search.toLowerCase())))
    .reverse(), [records, search]);

  const exportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(records || []);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Corrugated Data');
    XLSX.writeFile(workbook, 'corrugated-box-calculations.xlsx');
  };

  const importExcel = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (loadEvent) => {
      try {
        const workbook = XLSX.read(loadEvent.target.result, { type: 'array' });
        const rows = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);
        const normalized = rows.map((record, index) => ({ ...record, srno: index }));
        await writeCompanyFile(filePath, { companyData: normalized });
        setRecords(normalized);
        setSelectedIds([]);
        setError('');
      } catch (err) {
        console.error('Unable to import corrugated data:', err);
        setError('Unable to import this Excel file.');
      }
      event.target.value = '';
    };
    reader.readAsArrayBuffer(file);
  };

  const deleteSelected = async () => {
    if (!selectedIds.length || !window.confirm(`Delete ${selectedIds.length} selected corrugated record(s)?`)) return;
    setIsLoading(true);
    try {
      const data = await readCompanyFile(filePath);
      data.companyData = data.companyData
        .filter((record) => !selectedIds.includes(Number(record.srno)))
        .map((record, index) => ({ ...record, srno: index }));
      await writeCompanyFile(filePath, data);
      setRecords(data.companyData);
      setSelectedIds([]);
      setError('');
    } catch (err) {
      console.error('Unable to delete corrugated records:', err);
      setError('Unable to delete selected records.');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSelected = (srno) => {
    const id = Number(srno);
    setSelectedIds((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  };

  const changeWhatsAppRecord = (value) => {
    setSelectedSrno(value);
    const record = records.find((item, index) => String(Number(item.srno ?? index) + 1) === String(value));
    if (!record) {
      setWhatsAppText('Enter a valid record number to load its complete details.');
      return;
    }
    const details = [
      ['Company Name', record.company_name],
      ['Product Name', record.product_name],
      ['Ply', `${record.ply}-Ply`],
      ['Size', record.box_size || `${record.length} × ${record.width} × ${record.height} mm`],
      ['Quantity', record.quantity],
      ['Paper GSM', record.linerGsm],
      ['Flute GSM', record.mediumGsm],
      ['Rate / Box', formatMoney(record.sellingPrice)],
      ['Total Order Value', formatMoney(record.orderValue)],
      ['Date', record.date],
    ].map(([label, value]) => `${label}: ${value ?? ''}`).join('\n');
    setWhatsAppText(details);
  };

  const whatsappDigits = phoneNumber.replace(/\D/g, '');
  const whatsappNumber = whatsappDigits.length === 10
    ? `91${whatsappDigits}`
    : whatsappDigits.length === 12 && whatsappDigits.startsWith('91') ? whatsappDigits : '';
  const whatsappHref = whatsappNumber
    ? `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsAppText)}`
    : '';

  if (!records) return <Loading value="Loading corrugated data..." />;

  return (
    <div className="pt-8 pb-20 flex h-screen w-screen text-Roboto">
      <div className="mt-20 w-screen tracking-wide">
        <div className="flex flex-wrap items-start">
          <div className="relative mb-4 w-full px-4 md:w-5/12">
            <div className="pointer-events-none absolute inset-y-0 left-7 flex items-center">
              <svg aria-hidden="true" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </div>
            <input value={search} onChange={(event) => setSearch(event.target.value)} type="search" aria-label="Search corrugated data" className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-4 pl-10 text-base text-gray-900 focus:border-blue-500 focus:ring-blue-500" placeholder="Search company, product, ply..." />
          </div>
          <div className="flex w-full flex-wrap justify-start gap-2 px-4 md:w-7/12 md:justify-around">
            <button className="h-fit rounded-lg bg-zinc-700 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800">
              <label htmlFor="corrugated-upload" className="cursor-pointer">Import From Excel</label>
              <input id="corrugated-upload" type="file" accept=".xlsx,.xls" onChange={importExcel} className="hidden" />
            </button>
            <button onClick={exportExcel} className="h-fit rounded-lg bg-zinc-700 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800">Export To Excel</button>
            <button onClick={deleteSelected} disabled={!selectedIds.length || isLoading} className="h-fit rounded-lg bg-red-700 px-4 py-2 text-sm font-medium text-white hover:bg-red-800 disabled:cursor-not-allowed disabled:opacity-50">Delete Selected ({selectedIds.length})</button>
            <button onClick={() => setShowWhatsApp(true)} className="h-fit rounded-lg bg-zinc-700 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800" title="Send a saved record through WhatsApp"><img src={Whatsapp} alt="WhatsApp" className="h-6 w-6" /></button>
            <button onClick={refresh} disabled={isLoading} className="h-fit rounded-lg bg-zinc-700 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800">Refresh</button>
          </div>
        </div>

        {error && <p role="alert" className="mb-3 px-4 text-red-300">{error}</p>}
        <div className="relative w-screen overflow-auto shadow-md sm:rounded-lg">
          <table className="w-screen text-left text-sm text-gray-500 dark:text-gray-400">
            <thead className="bg-gray-50 text-lg uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-300">
              <tr>
                <th scope="col" className="px-3 py-3"><input type="checkbox" aria-label="Select all visible records" checked={visibleRecords.length > 0 && visibleRecords.every(([record]) => selectedIds.includes(Number(record.srno)))} onChange={(event) => setSelectedIds(event.target.checked ? visibleRecords.map(([record]) => Number(record.srno)) : [])} /></th>
                {['Sr no.', 'Company Name', 'Product Name', 'Ply', 'Size', 'Quantity', 'Paper GSM', 'Flute GSM', 'Rate / Box', 'Total Order Value', 'Date'].map((heading) => <th key={heading} scope="col" className="whitespace-nowrap px-5 py-3">{heading}</th>)}
              </tr>
            </thead>
            <tbody className="table_body bg-inherit">
              {visibleRecords.map(([record, index]) => (
                <tr key={`${record.srno}-${record.date}-${index}`} onClick={() => navigate('/corrugated_calculator', { state: { corrugatedRecord: record } })} className="cursor-pointer border-b border-opacity-5 bg-inherit hover:bg-zinc-900">
                  <td className="px-3 py-4" onClick={(event) => event.stopPropagation()}><input type="checkbox" aria-label={`Select record ${Number(record.srno) + 1}`} checked={selectedIds.includes(Number(record.srno))} onChange={() => toggleSelected(record.srno)} /></td>
                  <td className="whitespace-nowrap px-5 py-4 text-lg text-white">{Number(record.srno ?? index) + 1}</td>
                  <td className="whitespace-nowrap px-5 py-4 text-lg text-white">{record.company_name || ''}</td>
                  <td className="whitespace-nowrap px-5 py-4 text-lg text-white">{record.product_name || ''}</td>
                  <td className="whitespace-nowrap px-5 py-4 text-lg text-white">{record.ply}-Ply</td>
                  <td className="whitespace-nowrap px-5 py-4 text-lg text-white">{record.box_size || `${record.length} × ${record.width} × ${record.height} mm`}</td>
                  <td className="whitespace-nowrap px-5 py-4 text-lg text-white">{record.quantity}</td>
                  <td className="whitespace-nowrap px-5 py-4 text-lg text-white">{record.linerGsm}</td>
                  <td className="whitespace-nowrap px-5 py-4 text-lg text-white">{record.mediumGsm}</td>
                  <td className="whitespace-nowrap px-5 py-4 text-lg text-white">{formatMoney(record.sellingPrice)}</td>
                  <td className="whitespace-nowrap px-5 py-4 text-lg text-white">{formatMoney(record.orderValue)}</td>
                  <td className="whitespace-nowrap px-5 py-4 text-lg text-white">{record.date || ''}</td>
                </tr>
              ))}
              {visibleRecords.length === 0 && <tr><td colSpan="12" className="px-5 py-8 text-center text-white">No corrugated data found.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
      {showWhatsApp && <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/60 p-4">
        <div className="relative w-full max-w-xl rounded-lg bg-white p-6 text-gray-900 shadow-xl">
          <button type="button" onClick={() => setShowWhatsApp(false)} className="absolute right-3 top-2 rounded px-2 py-1 text-2xl text-gray-500 hover:bg-gray-100" aria-label="Close WhatsApp dialog">×</button>
          <h2 className="mb-4 text-xl font-semibold">Send Corrugated Data on WhatsApp</h2>
          <label className="mb-3 block text-sm font-medium">WhatsApp number
            <input value={phoneNumber} onChange={(event) => setPhoneNumber(event.target.value)} placeholder="10 digit mobile number" className="mt-1 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900" />
          </label>
          <label className="mb-3 block text-sm font-medium">Record number
            <select value={selectedSrno} onChange={(event) => changeWhatsAppRecord(event.target.value)} className="mt-1 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900">
              <option value="">Select a saved record</option>
              {records.map((record, index) => <option key={`${record.srno}-${index}`} value={Number(record.srno ?? index) + 1}>{Number(record.srno ?? index) + 1}. {record.company_name || 'Corrugated box'} — {record.product_name || `${record.ply}-Ply`}</option>)}
            </select>
          </label>
          <label className="mb-4 block text-sm font-medium">Message preview
            <textarea readOnly value={whatsAppText} className="mt-1 block h-56 w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900" />
          </label>
          <button type="button" disabled={!whatsappHref || !whatsAppText || whatsAppText.startsWith('Enter a valid')} onClick={() => window.open(whatsappHref, '_blank', 'noopener,noreferrer')} className="rounded-lg bg-green-700 px-5 py-2.5 font-medium text-white hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-50">Send via WhatsApp</button>
          {!whatsappHref && phoneNumber && <p className="mt-2 text-sm text-red-600">Enter a valid 10 digit mobile number.</p>}
        </div>
      </div>}
    </div>
  );
};

export default CorrugatedData;
