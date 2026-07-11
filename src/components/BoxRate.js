import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Loading from './Loading';
import UpArrow from '../assets/uparrow.png';
import RightArrow from '../assets/rightarrow.png';
import { readCompanyFile, writeCompanyFile } from '../utils/jsonFile';

const inputClass = 'block text-xl w-40 px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring';
const resultInputClass = 'block text-2xl px-2 py-2 mt-2 font-bold text-red-800 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring';
const labelClass = 'text-white text-lg dark:text-gray-200';
const sectionClass = 'w-100 mx-4 p-6 mx-auto rounded-md shadow-md dark:bg-gray-800';
const buttonClass = 'px-6 py-2 w-44 leading-5 text-white text-lg transition-colors duration-200 transform bg-pink-500 rounded-md hover:bg-pink-700 focus:outline-none';

const defaultForm = {
  company_name: '',
  product_name: '',
  size1: 0,
  size2: 0,
  size3: 0,
  pFlap: 0,
  cFlap: 0,
  rows: 0,
  cols: 0,
  marginL: 0,
  marginB: 0,
};

const numberValue = (value) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const inputValue = (value) => (value === '' ? '' : numberValue(value));

const displayNumber = (value) => (numberValue(value) === 0 ? '' : value);

const fixed = (value, digits = 5) => numberValue(value).toFixed(digits);

const getKolkataDate = () => {
  const options = { timeZone: 'Asia/Kolkata', day: 'numeric', month: 'numeric', year: 'numeric' };
  return new Date().toLocaleString('en-US', options);
};

const calculateBox = (form) => {
  const boxLength = numberValue(form.cFlap) * 2 + numberValue(form.size2) * 2 + numberValue(form.size3);
  const boxBreadth = numberValue(form.size1) * 2 + numberValue(form.size2) * 2 + numberValue(form.pFlap);
  const rows = numberValue(form.rows);
  const cols = numberValue(form.cols);

  const sheetSizeL = rows
    ? numberValue(form.marginL) + boxLength + (boxLength - numberValue(form.cFlap) - numberValue(form.size2)) * (rows - 1)
    : 0;
  const sheetSizeB = numberValue(form.marginB) + boxBreadth * cols;

  return {
    ups: rows * cols,
    boxSize: boxLength || boxBreadth ? `${boxLength}X${boxBreadth}` : '',
    sheetSizeL,
    sheetSizeB,
    sheetSizeInchL: fixed(sheetSizeL / 25.4),
    sheetSizeInchB: fixed(sheetSizeB / 25.4),
  };
};

const normalizeLoadedForm = (data) => ({
  ...defaultForm,
  ...(data || {}),
});

const normalizeFormForSave = (form) => {
  const normalized = { ...form };

  Object.keys(defaultForm).forEach((key) => {
    if (typeof defaultForm[key] === 'number') {
      normalized[key] = numberValue(form[key]);
    }
  });

  return normalized;
};

const Field = ({ id, label, value, onChange, onKeyDown, type = 'number', children, className = inputClass }) => (
  <div>
    <label className={`${labelClass} ${children ? 'flex' : ''}`} htmlFor={id}>
      {label}
      {children}
    </label>
    <input
      id={id}
      type={type}
      value={type === 'number' ? displayNumber(value) : value}
      onKeyDown={onKeyDown}
      onChange={(event) => onChange?.(event.target.value)}
      className={className}
      readOnly={!onChange}
    />
  </div>
);

const SuggestionList = ({ open, suggestions, activeIndex, onSelect }) => (
  <div className={`z-50 bg-white ${open ? 'block' : 'hidden'} absolute divide-y divide-gray-100 rounded-lg shadow w-100 dark:bg-gray-700`}>
    <ul className="h-auto max-h-48 py-2 overflow-y-auto text-gray-700 dark:text-gray-200">
      {suggestions.map((item, index) => (
        <li
          key={`${item}-${index}`}
          onMouseDown={() => onSelect(item)}
          className={`flex ${activeIndex === index ? 'bg-gray-100' : ''} items-center px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white cursor-pointer`}
        >
          {String(item)}
        </li>
      ))}
    </ul>
  </div>
);

const BoxRate = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const editData = Array.isArray(location.state) ? location.state[0] : null;
  const editIndex = Array.isArray(location.state) ? location.state[1] : null;
  const calculatorSizeData = !Array.isArray(location.state) && location.state?.fromCalculator
    ? location.state
    : null;

  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState(defaultForm);
  const [marginType, setMarginType] = useState(true);
  const [dataValues, setDataValues] = useState([]);
  const [suggestions, setSuggestions] = useState({ company: [], product: [] });
  const [drops, setDrops] = useState({ company: false, product: false });
  const [activeIndex, setActiveIndex] = useState(-1);

  const calculated = useMemo(() => calculateBox(form), [form]);

  useEffect(() => {
    if (editData) {
      setForm(normalizeLoadedForm(editData));
    }
  }, [editData]);

  useEffect(() => {
    if (calculatorSizeData) {
      setForm((current) => ({
        ...current,
        size1: calculatorSizeData.size1 || 0,
        size2: calculatorSizeData.size2 || 0,
        size3: calculatorSizeData.size3 || 0,
      }));
    }
  }, [calculatorSizeData]);

  useEffect(() => {
    let isMounted = true;

    const loadSuggestions = async () => {
      const [boxData, universalData, inputData] = await Promise.all([
        readCompanyFile(process.env.REACT_APP_INPUTBOXFILE),
        readCompanyFile(process.env.REACT_APP_INPUTUNIVERSALFILE),
        readCompanyFile(process.env.REACT_APP_INPUTFILE),
      ]);

      if (!isMounted) return;

      setDataValues([
        ...boxData.companyData,
        ...universalData.companyData,
        ...inputData.companyData,
      ]);
    };

    loadSuggestions().catch((err) => console.error('Error loading suggestions:', err));

    return () => {
      isMounted = false;
    };
  }, []);

  const setField = (key, value) => {
    setForm((current) => ({
      ...current,
      [key]: typeof defaultForm[key] === 'number' ? inputValue(value) : value,
    }));
  };

  const closeDrops = () => setDrops({ company: false, product: false });

  const searchData = (value) => {
    const searchKey = String(value).toLowerCase();
    const matches = (key) => Array.from(new Set(
      dataValues
        .map((item) => item[key])
        .filter((item) => item !== undefined && item !== null && String(item).trim() !== '')
        .filter((item) => String(item).toLowerCase().includes(searchKey))
    ));

    setSuggestions({
      company: matches('company_name'),
      product: matches('product_name'),
    });
  };

  const handleSearchChange = (key, value) => {
    setActiveIndex(-1);
    setField(key, value);
    searchData(value);
    setDrops((current) => ({ ...current, [key === 'company_name' ? 'company' : 'product']: Boolean(value) }));
  };

  const selectSuggestion = (key, value) => {
    setField(key, value);
    setDrops((current) => ({ ...current, [key === 'company_name' ? 'company' : 'product']: false }));
  };

  const handleKey = (event, key) => {
    const listKey = key === 'company_name' ? 'company' : 'product';
    const list = suggestions[listKey];
    if (!list.length) return;

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      const nextIndex = (activeIndex + 1) % list.length;
      setActiveIndex(nextIndex);
      setField(key, list[nextIndex]);
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      const nextIndex = activeIndex <= 0 ? list.length - 1 : activeIndex - 1;
      setActiveIndex(nextIndex);
      setField(key, list[nextIndex]);
    }

    if (event.key === 'Enter' || event.key === 'Tab') {
      closeDrops();
    }
  };

  const buildPayload = () => {
    const saveForm = normalizeFormForSave(form);

    return {
    company_name: saveForm.company_name,
    product_name: saveForm.product_name,
    size1: saveForm.size1,
    size2: saveForm.size2,
    size3: saveForm.size3,
    pFlap: saveForm.pFlap,
    cFlap: saveForm.cFlap,
    rows: saveForm.rows,
    cols: saveForm.cols,
    sheet_sizeL: calculated.sheetSizeL,
    sheet_sizeB: calculated.sheetSizeB,
    marginL: saveForm.marginL,
    marginB: saveForm.marginB,
    date: getKolkataDate(),
    ups: calculated.ups,
    boxSize: calculated.boxSize,
    srno: '0',
    };
  };

  const getSheetSizeForCalculator = () => (
    !calculated.sheetSizeL && !calculated.sheetSizeB
      ? ''
      : `${calculated.sheetSizeL} X ${calculated.sheetSizeB}`
  );

  const finishSave = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      if (calculatorSizeData) {
        navigate('/rate_calculator', {
          state: {
            fromBoxRate: true,
            calculatorForm: calculatorSizeData.calculatorForm,
            boxSheetSize: getSheetSizeForCalculator(),
          },
        });
        return;
      }

      navigate('/box_search');
    }, 1500);
  };

  const saveToJson = async () => {
    const data = await readCompanyFile(process.env.REACT_APP_INPUTBOXFILE);
    const payload = buildPayload();

    payload.srno = data.companyData.length;
    data.companyData.push(payload);

    await writeCompanyFile(process.env.REACT_APP_INPUTBOXFILE, data);
    finishSave();
  };

  const updateToJson = async () => {
    const data = await readCompanyFile(process.env.REACT_APP_INPUTBOXFILE);

    data.companyData[editIndex] = buildPayload();
    data.companyData[editIndex].srno = editIndex;

    await writeCompanyFile(process.env.REACT_APP_INPUTBOXFILE, data);
    finishSave();
  };

  const clearData = () => {
    setForm(defaultForm);
    setSuggestions({ company: [], product: [] });
    closeDrops();
    setActiveIndex(-1);
  };

  const renderSuggestionField = ({ id, label, formKey, listKey, width }) => (
    <div className="relative">
      <Field
        id={id}
        label={label}
        type="text"
        value={form[formKey]}
        onKeyDown={(event) => handleKey(event, formKey)}
        onChange={(value) => handleSearchChange(formKey, value)}
        className={`block text-xl ${width} px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring`}
      />
      <SuggestionList
        open={drops[listKey]}
        suggestions={suggestions[listKey]}
        activeIndex={activeIndex}
        onSelect={(value) => selectSuggestion(formKey, value)}
      />
    </div>
  );

  const sheetSizeValue = !calculated.sheetSizeL && !calculated.sheetSizeB
    ? ''
    : marginType
    ? `${calculated.sheetSizeL} X ${calculated.sheetSizeB}`
    : `${calculated.sheetSizeInchL} X ${calculated.sheetSizeInchB}`;

  return (
    <div className="h-screen w-screen text-Roboto overflow-x-hidden pb-40 mt-5 bg-gradient-to-tr from-neutral-700 via-neutral-700 to-neutral-700">
      {!isLoading ? (
        <div>
          <section className={`${sectionClass} mt-20`}>
            <div className="flex flex-cols justify-around w-100 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-6 mt-4">
              <div>
                {renderSuggestionField({ id: 'company_name', label: 'COMPANY NAME', formKey: 'company_name', listKey: 'company', width: 'w-11/12' })}
              </div>
              <div>
                {renderSuggestionField({ id: 'product_name', label: 'PRODUCT NAME', formKey: 'product_name', listKey: 'product', width: 'w-10/12' })}
              </div>
            </div>
          </section>

          <section className={sectionClass}>
            <div className="flex">
              <h1 className="text-xl text-yellow-300 capitalize border-2 w-max p-2 border-dashed">INTERLOCK</h1>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-6 mt-4">
              <Field id="size1" label="SIZE1" value={form.size1} onChange={(value) => setField('size1', value)} />
              <Field id="size2" label="SIZE2" value={form.size2} onChange={(value) => setField('size2', value)} />
              <Field id="size3" label="SIZE3" value={form.size3} onChange={(value) => setField('size3', value)} />
              <Field id="pFlap" label="Pasting Flap" value={form.pFlap} onChange={(value) => setField('pFlap', value)} />
              <Field id="cFlap" label="Closing Flap" value={form.cFlap} onChange={(value) => setField('cFlap', value)} />
              <Field id="rows" label="Rows" value={form.rows} onChange={(value) => setField('rows', value)}>
                &nbsp;&nbsp;<span><img src={UpArrow} alt="" /></span>
              </Field>
              <Field id="cols" label="Columns" value={form.cols} onChange={(value) => setField('cols', value)}>
                &nbsp;&nbsp;<span><img src={RightArrow} alt="" /></span>
              </Field>
              <Field id="marginL" label="MarginL" value={form.marginL} onChange={(value) => setField('marginL', value)} />
              <Field id="marginB" label="MarginB" value={form.marginB} onChange={(value) => setField('marginB', value)} />
            </div>
          </section>

          <section className="w-1/2 mx-4 p-6 mx-auto flex flex-cols justify-around rounded-md shadow-md dark:bg-gray-800 mt-2">
            <Field id="boxSize" label="Box Size" type="text" value={calculated.boxSize} className={`${resultInputClass} w-44`} />
            <Field id="ups" label="Ups" value={calculated.ups} className={`${resultInputClass} w-40 px-4`} />
          </section>

          <section className="w-1/2 mx-4 p-6 mx-auto flex flex-cols justify-around rounded-md shadow-md dark:bg-gray-800 mt-2">
            <div className="relative">
              <Field id="sheetSizeL" label="Sheet Size" type="text" value={sheetSizeValue} className={`${resultInputClass} w-96`} />
              <button
                onClick={() => setMarginType(true)}
                className={`${marginType ? 'bg-zinc-500' : ''} bg-white text-black active:bg-pink-600 text-sm mt-1 hover:bg-zinc-500 px-4 font-bold rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150`}
                type="button"
              >
                mm
              </button>
              <button
                onClick={() => setMarginType(false)}
                className={`${!marginType ? 'bg-zinc-500' : ''} bg-white text-black active:bg-pink-600 text-sm mt-1 hover:bg-zinc-500 px-4 font-bold rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150`}
                type="button"
              >
                in
              </button>
            </div>
          </section>

          <div className="flex justify-center mt-6">
            {editData ? (
              <button onClick={updateToJson} className={buttonClass}>Update</button>
            ) : (
              <div>
                <button onClick={saveToJson} className={`${buttonClass} mr-2`}>Save</button>
                <button onClick={clearData} className={buttonClass}>Clear</button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <Loading value="ADDING YOUR DATA..." />
      )}
    </div>
  );
};

export default BoxRate;
