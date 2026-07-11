import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Loading from './Loading';
import DropArrow from '../assets/droparrow.png';
import GsmIcon from '../assets/gsm.png';
import DescendingIcon from '../assets/descending.png';
import AscendingIcon from '../assets/ascending.png';
import { readCompanyFile, writeCompanyFile } from '../utils/jsonFile';

const inputClass = 'block text-xl w-40 px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring';
const labelClass = 'text-white text-lg dark:text-gray-200';
const buttonClass = 'px-6 py-2 w-44 leading-5 text-white text-lg transition-colors duration-200 transform bg-pink-500 rounded-md hover:bg-pink-700 focus:outline-none';
const sectionClass = 'w-100 mx-4 p-6 mx-auto rounded-md shadow-md dark:bg-gray-800';

const defaultForm = {
  company_name: '',
  product_name: '',
  box_size: '',
  remarks: '',
  colors: '',
  size_l: 0,
  size_b: 0,
  gsm: 0,
  sheet_in_gross: 0,
  textConfirmation: 1555000,
  rate_kg: 0,
  gross: 0,
  quantity: 0,
  qty: 0,
  ups: 0,
  board: 0,
  rate: 0,
  qty1: 0,
  ups1: 0,
  board1: 0,
  rate1: 0,
  qty2: 0,
  ups2: 0,
  board2: 0,
  rate2: 0,
  printing: 0,
  ink: 0,
  pasting: 0,
  punching: 0,
  profit: 0,
  varnish: 0,
  plate: 0,
  binding: 0,
};

const defaultExtras = {
  lamSize1: 0,
  lamSize2: 0,
  lamNum: 0,
  lamQty: 0,
  pNum1: 0,
  pNum2: 0,
  pNum3: 0,
  pmNum1: 0,
  pmNum2: 0,
  pmNum3: 0,
  pasteNum1: 0,
  pasteNum2: 0,
  punchNum1: 0,
  punchNum2: 0,
  bindNum1: 0,
  bindNum2: 0,
};

const defaultDrops = {
  company: false,
  product: false,
  size: false,
  remark: false,
  color: false,
  printing: false,
  pasting: false,
  punching: false,
  lamination: false,
  binding: false,
};

const editableFormKeys = Object.keys(defaultForm);

const numberValue = (value) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const inputValue = (value) => (value === '' ? '' : numberValue(value));

const fixed = (value, digits = 4) => numberValue(value).toFixed(digits);

const divide = (value, divisor) => (numberValue(divisor) ? numberValue(value) / numberValue(divisor) : 0);

const getKolkataDate = () => {
  const options = { timeZone: 'Asia/Kolkata', day: 'numeric', month: 'numeric', year: 'numeric' };
  return new Date().toLocaleString('en-US', options);
};

const calculateValues = (form) => {
  const denominator = numberValue(form.textConfirmation) || 1555000;
  const kg = (numberValue(form.size_l) * numberValue(form.size_b) * numberValue(form.gsm) * numberValue(form.sheet_in_gross)) / denominator;
  const gross_rate = kg * numberValue(form.rate_kg);
  const rate_per_sheet = divide(gross_rate, form.gross);

  const board_amt = numberValue(form.board) * numberValue(form.rate)
    + numberValue(form.board1) * numberValue(form.rate1)
    + numberValue(form.board2) * numberValue(form.rate2);

  const total1 = board_amt + numberValue(form.printing) + numberValue(form.ink) + numberValue(form.pasting) + numberValue(form.punching);
  const total2 = total1 + (total1 * numberValue(form.profit)) / 100;
  const grand_total = total2 + numberValue(form.varnish) + numberValue(form.plate) + numberValue(form.binding);
  const rate_per_piece = divide(grand_total, form.quantity);

  return {
    kg: fixed(kg),
    gross_rate: fixed(gross_rate),
    rate_per_sheet: fixed(rate_per_sheet),
    board_amt,
    total1,
    total2,
    grand_total: fixed(grand_total),
    rate_per_piece: fixed(rate_per_piece),
  };
};

const boardGroups = [
  { qtyKey: 'qty', upsKey: 'ups', boardKey: 'board' },
  { qtyKey: 'qty1', upsKey: 'ups1', boardKey: 'board1' },
  { qtyKey: 'qty2', upsKey: 'ups2', boardKey: 'board2' },
];

const getBoardGroup = (key) => boardGroups.find((group) => (
  group.qtyKey === key || group.upsKey === key || group.boardKey === key
));

const syncBoardGroup = (current, key, value) => {
  const group = getBoardGroup(key);
  if (!group) return {};

  if (key === group.boardKey) {
    return {
      [group.qtyKey]: numberValue(value) * numberValue(current[group.upsKey]),
    };
  }

  if (key === group.upsKey && numberValue(current[group.boardKey]) && !numberValue(current[group.qtyKey])) {
    return {
      [group.qtyKey]: numberValue(current[group.boardKey]) * numberValue(value),
    };
  }

  const nextQty = key === group.qtyKey ? value : current[group.qtyKey];
  const nextUps = key === group.upsKey ? value : current[group.upsKey];

  return {
    [group.boardKey]: divide(nextQty, nextUps),
  };
};

const normalizeLoadedForm = (data) => {
  const normalized = { ...defaultForm };

  editableFormKeys.forEach((key) => {
    if (data && data[key] !== undefined && data[key] !== null) {
      normalized[key] = data[key];
    }
  });

  boardGroups.forEach(({ qtyKey, upsKey, boardKey }) => {
    if (data && (data[boardKey] === undefined || data[boardKey] === null)) {
      normalized[boardKey] = divide(normalized[qtyKey], normalized[upsKey]);
    }
  });

  return normalized;
};

const NumberField = ({ id, label, value, onChange, readOnly = false, className = inputClass }) => (
  <div>
    <label className={labelClass} htmlFor={id}>{label}</label>
    <input
      id={id}
      type="number"
      readOnly={readOnly}
      value={value}
      onChange={(event) => onChange?.(event.target.value)}
      className={className}
    />
  </div>
);

const TextField = ({ id, label, value, onChange, onKeyDown, width = 'w-10/12' }) => (
  <div className="relative">
    <label className={labelClass} htmlFor={id}>{label}</label>
    <input
      id={id}
      type="text"
      value={value}
      onKeyDown={onKeyDown}
      onChange={(event) => onChange(event.target.value)}
      className={`block text-xl ${width} px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring`}
    />
  </div>
);

const SuggestionList = ({ open, suggestions, activeIndex, onSelect }) => (
  <div className={`z-50 bg-white ${open ? 'block' : 'hidden'} absolute divide-y divide-gray-100 rounded-lg shadow w-100 dark:bg-gray-700`}>
    <ul className="h-auto max-h-48 py-2 overflow-y-auto text-gray-700 dark:text-gray-200">
      {suggestions.map((suggestion, index) => (
        <li
          key={`${suggestion}-${index}`}
          onMouseDown={() => onSelect(suggestion)}
          className={`flex ${activeIndex === index ? 'bg-gray-100' : ''} items-center px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white cursor-pointer`}
        >
          {String(suggestion)}
        </li>
      ))}
    </ul>
  </div>
);

const DropButton = ({ open, onClick }) => (
  <img
    src={DropArrow}
    onClick={onClick}
    style={{ position: 'absolute', top: '2.9rem', left: '8rem' }}
    className="border-2 border-solid rounded-lg p-1 bg-gray-200 cursor-pointer"
    alt=""
  />
);

const PopupNumber = ({ id, label, value, onChange }) => (
  <div className="m-2">
    <span>{label}</span>
    <input
      type="number"
      id={id}
      className="block w-36 px-1 py-2 border-blue-500 border-2 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring"
      value={value}
      onChange={(event) => onChange(event.target.value)}
    />
  </div>
);

const Calculator = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const editData = Array.isArray(location.state) ? location.state[0] : null;
  const editIndex = Array.isArray(location.state) ? location.state[1] : null;

  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState(defaultForm);
  const [extras, setExtras] = useState(defaultExtras);
  const [drops, setDrops] = useState(defaultDrops);
  const [dataValues, setDataValues] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [activeSuggestion, setActiveSuggestion] = useState(-1);
  const [preGsm, setPreGsm] = useState([]);
  const [multiColor, setMultiColor] = useState(false);
  const [gsmModal, setGsmModal] = useState(false);

  const calculated = useMemo(() => calculateValues(form), [form]);
  const values = { ...form, ...calculated };

  useEffect(() => {
    if (editData) {
      setForm(normalizeLoadedForm(editData));
    }
  }, [editData]);

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      const data = await readCompanyFile(process.env.REACT_APP_INPUTFILE);
      if (!isMounted) return;

      setPreGsm(Array.from(data.companyData));
      setDataValues(data.companyData);
    };

    loadData().catch((err) => console.error('Error loading calculator data:', err));

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const closePopupsOnTab = (event) => {
      if (event.key !== 'Tab') return;

      const activeId = document.activeElement?.id;
      setDrops((current) => ({
        ...current,
        printing: current.printing && ['pnum1', 'pnum2', 'pnum3', 'pmNum1', 'pmNum2', 'pmNum3'].includes(activeId),
        pasting: current.pasting && ['pasteNum1', 'pasteNum2'].includes(activeId),
        lamination: current.lamination && ['lamSize1', 'lamSize2', 'lamSize3', 'lamSize4'].includes(activeId),
        punching: current.punching && ['punchNum1', 'punchNum2'].includes(activeId),
        binding: current.binding && ['bindNum1', 'bindNum2'].includes(activeId),
      }));
    };

    document.addEventListener('keyup', closePopupsOnTab);
    return () => document.removeEventListener('keyup', closePopupsOnTab);
  }, []);

  const setField = (key, value) => {
    const nextValue = typeof defaultForm[key] === 'number' ? inputValue(value) : value;

    setForm((current) => ({
      ...current,
      [key]: nextValue,
      ...syncBoardGroup(current, key, nextValue),
      ...(key === 'sheet_in_gross' ? { gross: nextValue } : {}),
    }));
  };

  const setDrop = (key, value) => {
    setDrops((current) => ({ ...current, [key]: value }));
  };

  const closeSearchDrops = () => {
    setDrops((current) => ({
      ...current,
      company: false,
      product: false,
      size: false,
      remark: false,
      color: false,
    }));
  };

  const searchFieldMap = {
    company: { formKey: 'company_name', dataKey: 'company_name', dropKey: 'company' },
    product: { formKey: 'product_name', dataKey: 'product_name', dropKey: 'product' },
    size: { formKey: 'box_size', dataKey: 'box_size', dropKey: 'size' },
    remark: { formKey: 'remarks', dataKey: 'remarks', dropKey: 'remark' },
    color: { formKey: 'colors', dataKey: 'colors', dropKey: 'color' },
  };

  const searchData = (value, type) => {
    const config = searchFieldMap[type];
    if (!config) return;

    closeSearchDrops();
    setField(config.formKey, value);
    setActiveSuggestion(-1);

    const searchKey = String(value).toLowerCase();
    const matches = Array.from(
      new Set(
        dataValues
          .map((item) => item[config.dataKey])
          .filter((item) => item !== undefined && item !== null && String(item).trim() !== '')
          .filter((item) => String(item).toLowerCase().includes(searchKey))
      )
    );

    setSuggestions(matches);
    setDrop(config.dropKey, Boolean(value));
  };

  const selectSuggestion = (type, value) => {
    const config = searchFieldMap[type];
    if (!config) return;

    setField(config.formKey, value);
    setDrop(config.dropKey, false);
  };

  const handleSearchKey = (event, type) => {
    if (!suggestions.length) return;

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      const nextIndex = (activeSuggestion + 1) % suggestions.length;
      const config = searchFieldMap[type];
      setActiveSuggestion(nextIndex);
      setField(config.formKey, suggestions[nextIndex]);
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      const nextIndex = activeSuggestion <= 0 ? suggestions.length - 1 : activeSuggestion - 1;
      const config = searchFieldMap[type];
      setActiveSuggestion(nextIndex);
      setField(config.formKey, suggestions[nextIndex]);
    }

    if (event.key === 'Tab' || event.key === 'Enter') {
      closeSearchDrops();
    }
  };

  const buildPayload = () => ({
    ...form,
    ...calculated,
    date: getKolkataDate(),
    srno: '0',
  });

  const finishSave = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      navigate('/data_search');
    }, 1500);
  };

  const saveToJson = async () => {
    const data = await readCompanyFile(process.env.REACT_APP_INPUTFILE);
    const payload = buildPayload();

    payload.srno = data.companyData.length;
    data.companyData.push(payload);

    await writeCompanyFile(process.env.REACT_APP_INPUTFILE, data);
    finishSave();
  };

  const updateToJson = async () => {
    const data = await readCompanyFile(process.env.REACT_APP_INPUTFILE);

    data.companyData[editIndex] = buildPayload();
    const updatedEntry = data.companyData.splice(editIndex, 1)[0];
    data.companyData.push(updatedEntry);
    data.companyData.forEach((entry, index) => {
      entry.srno = index;
    });

    await writeCompanyFile(process.env.REACT_APP_INPUTFILE, data);
    finishSave();
  };

  const clearData = () => {
    setForm(defaultForm);
    setExtras(defaultExtras);
    setDrops(defaultDrops);
    setSuggestions([]);
    setActiveSuggestion(-1);
  };

  const setRateFromPaper = (rateKey) => {
    setField(rateKey, calculated.rate_per_sheet);
  };

  const updateExtras = (key, value, calculator) => {
    const parsedValue = inputValue(value);
    setExtras((current) => {
      const next = { ...current, [key]: parsedValue };
      const result = calculator(next);
      setForm((currentForm) => ({ ...currentForm, ...result }));
      return next;
    });
  };

  const updateLamination = (key, value) => {
    updateExtras(key, value, (next) => {
      const amount = next.lamSize1 && next.lamSize2 && next.lamNum && next.lamQty
        ? (next.lamSize1 * next.lamSize2 * next.lamNum * next.lamQty) / 100
        : 0;
      return { varnish: amount };
    });
  };

  const updatePrinting = (key, value) => {
    updateExtras(key, value, (next) => {
      let amount = 0;

      if (next.pNum1 && next.pNum2 && next.pNum3) {
        amount += next.pNum1 * next.pNum2 * next.pNum3;
      }

      if (next.pmNum1 && next.pmNum2 && next.pmNum3) {
        amount += next.pmNum1 + Math.ceil((next.pmNum3 - 1000) / 1000) * next.pmNum2;
      }

      return { printing: amount };
    });
  };

  const updatePasting = (key, value) => {
    updateExtras(key, value, (next) => ({
      pasting: next.pasteNum1 && next.pasteNum2 ? (next.pasteNum1 * next.pasteNum2) / 1000 : 0,
    }));
  };

  const updatePunching = (key, value) => {
    updateExtras(key, value, (next) => ({
      punching: next.punchNum1 && next.punchNum2 ? next.punchNum1 * next.punchNum2 : 0,
    }));
  };

  const updateBinding = (key, value) => {
    updateExtras(key, value, (next) => ({
      binding: next.bindNum1 && next.bindNum2 ? next.bindNum1 * next.bindNum2 : 0,
    }));
  };

  const getGsmData = async () => {
    const data = await readCompanyFile(process.env.REACT_APP_INPUTFILE);
    const uniqueData = data.companyData.filter((item, index, rows) => (
      index === rows.findIndex((row) => row.size_l === item.size_l && row.size_b === item.size_b && row.gsm === item.gsm)
    ));

    setPreGsm(uniqueData.reverse());
  };

  const setPreData = (srno) => {
    const selected = preGsm.find((row) => row.srno === srno);
    if (!selected) return;

    setForm((current) => ({
      ...current,
      size_l: selected.size_l || 0,
      size_b: selected.size_b || 0,
      gsm: selected.gsm || 0,
      sheet_in_gross: selected.sheet_in_gross || 0,
      textConfirmation: selected.textConfirmation || 1555000,
      rate_kg: selected.rate_kg || 0,
      gross: selected.gross || selected.sheet_in_gross || 0,
    }));
    setGsmModal(false);
  };

  const renderSuggestionField = ({ type, id, label, width }) => {
    const config = searchFieldMap[type];
    return (
      <div className="relative">
        <TextField
          id={id}
          label={label}
          width={width}
          value={form[config.formKey]}
          onKeyDown={(event) => handleSearchKey(event, type)}
          onChange={(value) => searchData(value, type)}
        />
        <SuggestionList
          open={drops[config.dropKey]}
          suggestions={suggestions}
          activeIndex={activeSuggestion}
          onSelect={(value) => selectSuggestion(type, value)}
        />
      </div>
    );
  };

  return (
    <div className="h-screen w-screen overflow-x-hidden pb-40 mt-5 bg-gradient-to-tr from-neutral-700 via-neutral-700 to-neutral-700">
      {!isLoading ? (
        <div>
          <section className={`${sectionClass} text-Roboto mt-20`}>
            <div className="flex flex-cols justify-around w-100 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-6 mt-4">
              {renderSuggestionField({ type: 'company', id: 'company_name', label: 'COMPANY NAME', width: 'w-11/12' })}
              {renderSuggestionField({ type: 'product', id: 'product_name', label: 'PRODUCT NAME', width: 'w-10/12' })}
            </div>
          </section>

          <section className={`${sectionClass} mt-2`}>
            <div className="flex flex-cols justify-around w-100 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 mt-4">
              {renderSuggestionField({ type: 'size', id: 'box_size', label: 'SIZE', width: 'w-10/12' })}
              {renderSuggestionField({ type: 'remark', id: 'remarks', label: 'REMARKS', width: 'w-10/12' })}
              {renderSuggestionField({ type: 'color', id: 'color', label: 'Color', width: 'w-10/12' })}
            </div>
          </section>

          <section className={`${sectionClass} mt-0`}>
            <div className="flex">
              <h1 className="text-xl text-yellow-300 capitalize border-2 w-max p-2 border-dashed">PAPER CALCULATION</h1>
              <img
                src={GsmIcon}
                className="w-10 h-6 px-2 mt-4 cursor-pointer"
                onClick={() => {
                  setGsmModal(true);
                  getGsmData();
                }}
                alt=""
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-6 mt-4">
              <NumberField id="size_l" label="SIZE_L" value={form.size_l} onChange={(value) => setField('size_l', value)} />
              <NumberField id="size_b" label="SIZE_B" value={form.size_b} onChange={(value) => setField('size_b', value)} />
              <NumberField id="gsm" label="GSM" value={form.gsm} onChange={(value) => setField('gsm', value)} />
              <NumberField id="sheet_in_gross" label="SHEET IN GROSS" value={form.sheet_in_gross} onChange={(value) => setField('sheet_in_gross', value)} />
              <NumberField id="textConfirmation" label="TOTAL" value={form.textConfirmation} readOnly />
              <NumberField id="kg" label="KG" value={values.kg} readOnly />
              <NumberField id="rate_kg" label="RATE(KG)" value={form.rate_kg} onChange={(value) => setField('rate_kg', value)} />
              <NumberField id="gross_rate" label="GROSS RATE" value={values.gross_rate} readOnly />
              <NumberField id="gross" label="GROSS" value={form.gross} onChange={(value) => setField('gross', value)} />

              <div>
                <NumberField id="rate_per_sheet" label="RATE PER SHEET" value={values.rate_per_sheet} readOnly />
                {['rate', 'rate1', 'rate2'].map((rateKey, index) => (
                  <button
                    key={rateKey}
                    onClick={() => setRateFromPaper(rateKey)}
                    className="bg-white text-black active:bg-pink-600 text-sm mt-1 hover:bg-zinc-500 px-4 font-bold rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
            </div>

            <h1 className="text-xl mt-16 text-yellow-300 font-bold capitalize border-2 w-max p-2 border-dashed">PRODUCT CALCULATION</h1>
            <div className="grid mt-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-8">
              <NumberField id="quantity" label="QUANTITY" value={form.quantity} onChange={(value) => setField('quantity', value)} />
            </div>

            <div className="grid xl:w-9/12 lg:w-9/12 md:w-100 sm:w-100 mt-4 grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4 gap-8">
              <NumberField id="qty" label="QTY" value={form.qty} onChange={(value) => setField('qty', value)} />
              <NumberField id="ups" label="UPS" value={form.ups} onChange={(value) => setField('ups', value)} />
              <NumberField id="board" label="BOARD" value={form.board} onChange={(value) => setField('board', value)} />
              <NumberField id="rate" label="RATE" value={form.rate} onChange={(value) => setField('rate', value)} />

              <NumberField id="qty1" label="QTY1" value={form.qty1} onChange={(value) => setField('qty1', value)} />
              <NumberField id="ups1" label="UPS1" value={form.ups1} onChange={(value) => setField('ups1', value)} />
              <NumberField id="board1" label="BOARD1" value={form.board1} onChange={(value) => setField('board1', value)} />
              <NumberField id="rate1" label="RATE1" value={form.rate1} onChange={(value) => setField('rate1', value)} />

              <NumberField id="qty2" label="QTY2" value={form.qty2} onChange={(value) => setField('qty2', value)} />
              <NumberField id="ups2" label="UPS2" value={form.ups2} onChange={(value) => setField('ups2', value)} />
              <NumberField id="board2" label="BOARD2" value={form.board2} onChange={(value) => setField('board2', value)} />
              <NumberField id="rate2" label="RATE2" value={form.rate2} onChange={(value) => setField('rate2', value)} />
              <NumberField id="board_amt" label="BOARD AMOUNT" value={values.board_amt} readOnly />

              <div className="relative">
                <NumberField id="printing" label="PRINTING" value={form.printing} onChange={(value) => setField('printing', value)} />
                <DropButton open={drops.printing} onClick={() => setDrop('printing', !drops.printing)} />
                <div className={`z-50 bg-white ${drops.printing ? 'block' : 'hidden'} absolute divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700`}>
                  <div className="m-2 flex flex-row justify-around">
                    <span className="cursor-pointer" onClick={() => setMultiColor(false)}>Single</span>
                    <span className="cursor-pointer" onClick={() => setMultiColor(true)}>Multi</span>
                  </div>
                  <div className={multiColor ? 'hidden' : 'block'}>
                    <PopupNumber id="pnum1" label="Pulling" value={extras.pNum1} onChange={(value) => updatePrinting('pNum1', value)} />
                    <PopupNumber id="pnum2" label="Color" value={extras.pNum2} onChange={(value) => updatePrinting('pNum2', value)} />
                    <PopupNumber id="pnum3" label="Quantity" value={extras.pNum3} onChange={(value) => updatePrinting('pNum3', value)} />
                  </div>
                  <div className={!multiColor ? 'hidden' : 'block'}>
                    <PopupNumber id="pmNum1" label="Rate1" value={extras.pmNum1} onChange={(value) => updatePrinting('pmNum1', value)} />
                    <PopupNumber id="pmNum2" label="Rate2" value={extras.pmNum2} onChange={(value) => updatePrinting('pmNum2', value)} />
                    <PopupNumber id="pmNum3" label="Quantity" value={extras.pmNum3} onChange={(value) => updatePrinting('pmNum3', value)} />
                  </div>
                </div>
              </div>

              <NumberField id="ink" label="INK" value={form.ink} onChange={(value) => setField('ink', value)} />

              <div className="relative">
                <NumberField id="pasting" label="PASTING" value={form.pasting} onChange={(value) => setField('pasting', value)} />
                <DropButton open={drops.pasting} onClick={() => setDrop('pasting', !drops.pasting)} />
                <div className={`z-50 bg-white ${drops.pasting ? 'block' : 'hidden'} absolute divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700`}>
                  <PopupNumber id="pasteNum1" label="Rate" value={extras.pasteNum1} onChange={(value) => updatePasting('pasteNum1', value)} />
                  <PopupNumber id="pasteNum2" label="Quantity" value={extras.pasteNum2} onChange={(value) => updatePasting('pasteNum2', value)} />
                </div>
              </div>

              <div className="relative">
                <NumberField id="punching" label="PUNCHING" value={form.punching} onChange={(value) => setField('punching', value)} />
                <DropButton open={drops.punching} onClick={() => setDrop('punching', !drops.punching)} />
                <div className={`z-50 bg-white ${drops.punching ? 'block' : 'hidden'} absolute divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700`}>
                  <PopupNumber id="punchNum1" label="Rate" value={extras.punchNum1} onChange={(value) => updatePunching('punchNum1', value)} />
                  <PopupNumber id="punchNum2" label="Quantity" value={extras.punchNum2} onChange={(value) => updatePunching('punchNum2', value)} />
                </div>
              </div>

              <NumberField id="total1" label="TOTAL" value={values.total1} readOnly />
              <NumberField id="profit" label="PROFIT" value={form.profit} onChange={(value) => setField('profit', value)} />
              <NumberField id="total2" label="TOTAL" value={values.total2} readOnly />

              <div className="relative">
                <NumberField id="varnish" label="LAMINATION" value={form.varnish} onChange={(value) => setField('varnish', value)} />
                <DropButton open={drops.lamination} onClick={() => setDrop('lamination', !drops.lamination)} />
                <div className={`z-50 bg-white ${drops.lamination ? 'block' : 'hidden'} absolute divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700`}>
                  <PopupNumber id="lamSize1" label="Size1" value={extras.lamSize1} onChange={(value) => updateLamination('lamSize1', value)} />
                  <PopupNumber id="lamSize2" label="Size2" value={extras.lamSize2} onChange={(value) => updateLamination('lamSize2', value)} />
                  <PopupNumber id="lamSize3" label="Rate" value={extras.lamNum} onChange={(value) => updateLamination('lamNum', value)} />
                  <PopupNumber id="lamSize4" label="Quantity" value={extras.lamQty} onChange={(value) => updateLamination('lamQty', value)} />
                </div>
              </div>

              <NumberField id="plate" label="PLATE" value={form.plate} onChange={(value) => setField('plate', value)} />

              <div className="relative">
                <NumberField id="binding" label="BINDING" value={form.binding} onChange={(value) => setField('binding', value)} />
                <DropButton open={drops.binding} onClick={() => setDrop('binding', !drops.binding)} />
                <div className={`z-50 bg-white ${drops.binding ? 'block' : 'hidden'} absolute divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700`}>
                  <PopupNumber id="bindNum1" label="Rate" value={extras.bindNum1} onChange={(value) => updateBinding('bindNum1', value)} />
                  <PopupNumber id="bindNum2" label="Quantity" value={extras.bindNum2} onChange={(value) => updateBinding('bindNum2', value)} />
                </div>
              </div>
            </div>
          </section>

          <section className="w-1/2 mx-4 p-6 mx-auto flex flex-cols justify-around rounded-md shadow-md dark:bg-gray-800 mt-2">
            <NumberField
              id="grand_total"
              label="GRAND TOTAL"
              value={values.grand_total}
              readOnly
              className="block text-2xl w-44 px-2 py-2 mt-2 font-bold text-red-800 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring"
            />
            <NumberField
              id="rate_per_piece"
              label="RATE(piece)"
              value={values.rate_per_piece}
              readOnly
              className="block text-2xl w-40 px-4 py-2 mt-2 font-bold text-red-800 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring"
            />
          </section>

          <div className="flex justify-center mt-6">
            {editData ? (
              <div>
                <button onClick={saveToJson} className={`${buttonClass} mr-2`}>Save</button>
                <button onClick={updateToJson} className={buttonClass}>Update</button>
              </div>
            ) : (
              <div>
                <button onClick={saveToJson} className={`${buttonClass} mr-2`}>Save</button>
                <button onClick={clearData} className={buttonClass}>Clear</button>
              </div>
            )}
          </div>

          <div className={`absolute flex justify-center items-center z-50 ${gsmModal ? 'block' : 'hidden'} p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] md:h-full`}>
            <div className="relative w-8/12 bg-white rounded-lg shadow dark:bg-gray-700">
              <div className="relative table_body w-full shadow-md sm:rounded-lg">
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                  <thead className="text-lg text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                      {[
                        ['size_l', 'Size_L'],
                        ['size_b', 'Size_B'],
                        ['gsm', 'GSM'],
                      ].map(([key, label]) => (
                        <th key={key} scope="col" className="px-2 py-3">
                          <div className="flex">
                            {label}
                            <img src={AscendingIcon} onClick={() => setPreGsm([...preGsm].sort((a, b) => numberValue(a[key]) - numberValue(b[key])))} className="ml-4 cursor-pointer" alt="" />
                            <img src={DescendingIcon} onClick={() => setPreGsm([...preGsm].sort((a, b) => numberValue(b[key]) - numberValue(a[key])))} className="ml-2 cursor-pointer" alt="" />
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-inherit table_body max-h-2">
                    {preGsm.map((row, index) => (
                      <tr key={`${row.srno}-${index}`} onClick={() => setPreData(row.srno)} className="border-b border-opacity-5 bg-inherit hover:bg-zinc-200 cursor-pointer">
                        <td className="text-lg text-black px-2 py-4">{row.size_l}</td>
                        <td className="text-lg text-black px-2 py-4">{row.size_b}</td>
                        <td className="text-lg text-black px-2 py-4">{row.gsm}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="p-6 text-center">
                <button
                  onClick={() => setGsmModal(false)}
                  type="button"
                  className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <Loading value="ADDING YOUR DATA..." />
      )}
    </div>
  );
};

export default Calculator;
