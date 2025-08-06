import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import Loading from './Loading';
import "./DataSearch.css"
import Whatsapp from "../assets/whatsapp.png"
import Delete from "../assets/delete.png"
import PrintIcon from "../assets/print.png"

import * as XLSX from 'xlsx';
import AscendingIcon from '../assets/ascending.png'
import SelectAllWithModal from './SelectAllWithModal';

const fs = window.require('fs');

const DataSearch = ({ contract }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [dataValues, setDataValues] = useState();
  const [searchData, setSearchData] = useState();
  const [mssgModal, setMssgModal] = useState(false)
  const [deleteModal, setDeleteModal] = useState(false)
  const [deleteIndex, setDeleteIndex] = useState(false)
  const [phoneNumber, setPhoneNUmber] = useState("")
  const [selectedIds, setSelectedIds] = useState([]);


  const [wid, setWid] = useState("")
  const [wText, setWText] = useState("")
  const [printData, setPrintData] = useState("")
  const [printPreview, setPrintPreview] = useState("")

  const [printModal, setPrintModal] = useState(false)


  useEffect(() => {
    const loadData = () => {
      const filePath = process.env.REACT_APP_INPUTFILE;

      if (!filePath) {
        console.error("REACT_APP_INPUTFILE is undefined");
        return;
      }

      fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
          console.error("Error reading file:", err);
          return;
        }

        try {
          const data_values = JSON.parse(data);
          setDataValues(data_values.companyData);

          const temp = data_values.companyData.map((key, index) => [key, index]);
          setSearchData(temp.reverse());
        } catch (parseErr) {
          console.error("Error parsing JSON:", parseErr);
        }
      });
    };

    loadData();
  }, []);

  const navigate = useNavigate();
  const SearchData = async (e) => {
    if (e.target.value === "") setSearchData(dataValues)
    var searchKey = e.target.value
    var temp = []
    dataValues.forEach((key, index) => {
      for (const subKey in key) {
        if (String(key[subKey]).toLowerCase().includes(searchKey.toLowerCase())) {
          temp.push([key, index])
          break

        }
      }
    });
    setSearchData(temp.reverse())
  }
  function ExportToExcel() {
    const worksheet = XLSX.utils.json_to_sheet(dataValues);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    XLSX.writeFile(workbook, 'data.xlsx');
  }

  function ExportSelectedToExcel() {
    if (!selectedIds.length) return alert("No rows selected!");
    console.log(selectedIds)
    const selectedKeys = ["company_name", "product_name", "grand_total", "rate_per_piece", "box_size", "quantity"]; // add/remove keys here
    const selectedData = selectedIds.map((id) => {
      const row = dataValues[id]; // dataValues is an object now
      if (!row) return {}; // safety check

      return Object.fromEntries(
        Object.entries(row).filter(([key]) => selectedKeys.includes(key))
      );
    });


    const worksheet = XLSX.utils.json_to_sheet(selectedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Selected Data');
    XLSX.writeFile(workbook, 'selected_data.xlsx');
  }

  const changeWText = (e) => {
    try {
      setPrintData(
        "<table class='center'>" +
        "<tr><th>Company Name</th><td>" + dataValues[parseInt(e.target.value) - 1].company_name + "</td></tr>" +
        "<tr><th>Product Name</th><td>" + dataValues[parseInt(e.target.value) - 1].product_name + "</td></tr>" +
        "<tr><th>Size</th><td>" + dataValues[parseInt(e.target.value) - 1].box_size + "</td></tr>" +
        "<tr><th>Remarks</th><td>" + dataValues[parseInt(e.target.value) - 1].remarks + "</td></tr>" +
        "<tr><th>Quantity</th><td>" + dataValues[parseInt(e.target.value) - 1].quantity + "</td></tr>" +
        "<tr><th>Board1</th><td>" + dataValues[parseInt(e.target.value) - 1].board + "</td></tr>" +
        "<tr><th>Board2</th><td>" + dataValues[parseInt(e.target.value) - 1].board1 + "</td></tr>" +
        "<tr><th>Board3</th><td>" + dataValues[parseInt(e.target.value) - 1].board2 + "</td></tr>" +
        "</table>"
      )
      setPrintPreview(

        "Company Name : " + dataValues[parseInt(e.target.value) - 1].company_name + "\n"
        + "Product Name : " + dataValues[parseInt(e.target.value) - 1].product_name + "\n"
        + "Size : " + dataValues[parseInt(e.target.value) - 1].box_size + "\n"
        + "Remarks : " + dataValues[parseInt(e.target.value) - 1].remarks + "\n"
        + "Quantity : " + dataValues[parseInt(e.target.value) - 1].quantity + "\n"
        + "Board1 : " + dataValues[parseInt(e.target.value) - 1].board + "\n"
        + "board2 : " + dataValues[parseInt(e.target.value) - 1].board1 + '\n'
        + "board3 : " + dataValues[parseInt(e.target.value) - 1].board2 + '\n'
      )

      setWText("Company Name : " + dataValues[parseInt(e.target.value) - 1].company_name + "\n"
        + "Product Name : " + dataValues[parseInt(e.target.value) - 1].product_name + "\n"
        + "Size : " + dataValues[parseInt(e.target.value) - 1].box_size + "\n"
        + "Other Information : " + dataValues[parseInt(e.target.value) - 1].remarks + "\n"
        + "Quantity : " + dataValues[parseInt(e.target.value) - 1].quantity + "\n"
        + "Grand Total : " + dataValues[parseInt(e.target.value) - 1].grand_total + "\n"
        + "Rate Per Piece : " + dataValues[parseInt(e.target.value) - 1].rate_per_piece
      )
    }
    catch (e) {
      setWText("Please re-enter the proper number")
    }
  }


  const readUploadFile = (e) => {
    e.preventDefault();
    if (e.target.files) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = e.target.result;
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const json = XLSX.utils.sheet_to_json(worksheet);
        fs.writeFile(process.env.REACT_APP_INPUTFILE, JSON.stringify({ companyData: json }, null, 2), (err) => {
          setIsLoading(true)
          setTimeout(() => {
            setIsLoading(false);
            window.location.reload()
          }, 1500);
          // navigate("/data_search")
        })
      };
      reader.readAsArrayBuffer(e.target.files[0]);
    }
  }

  const deleteProduct = async () => {
    fs.readFile(process.env.REACT_APP_INPUTFILE, 'utf8', (err, data) => {
      if (err) return console.error(err);

      try {
        const data_values = JSON.parse(data);
        let temp = [];
        let dindex = 0;

        if (deleteIndex === "bulk") {
          data_values.companyData.forEach((item, i) => {
            if (!selectedIds.includes(i)) {
              item.srno = dindex++;
              temp.push(item);
            }
          });
        } else {
          data_values.companyData.forEach((item) => {
            if (parseInt(item.srno) !== parseInt(deleteIndex)) {
              item.srno = dindex++;
              temp.push(item);
            }
          });
        }

        data_values.companyData = temp;

        fs.writeFile(
          process.env.REACT_APP_INPUTFILE,
          JSON.stringify(data_values, null, 2),
          (err) => {
            if (err) return console.error(err);

            setIsLoading(true);
            setTimeout(() => {
              setIsLoading(false);
              setSelectedIds([]);
              window.location.reload();
            }, 1500);
          }
        );
      } catch (parseErr) {
        console.error("Error parsing file:", parseErr);
      }
    });
  };


  const handlePrint = () => {
    const currentDate = new Date().toLocaleDateString();
    const printWindow = window.open('', '_blank');
    printWindow.document.write('<html><head><title>Print</title>');
    printWindow.document.write(
      '<style>' +
      'table { border-collapse: collapse; margin: 0 auto; border: 1px solid black; }' +
      'th, td { padding: 5px; margin-right: 20px; font-size: 16px; font-family: Roboto, Arial, sans-serif; border: 1px solid black; }' +
      '.header-row { display: flex; justify-content: space-between; margin-bottom: 20px; }' +
      '.company-name { font-size: 20px; margin-right: 20px; }' +
      '.date { font-size: 14px; }' +
      '</style>'
    );
    printWindow.document.write('</head><body>');
    printWindow.document.write('<div class="header-row">');
    printWindow.document.write('<div class="company-name">Shree Vallabh Packaging</div>');
    printWindow.document.write('<div class="date">' + currentDate + '</div>');
    printWindow.document.write('</div>');
    printWindow.document.write(printData);
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.print();
  };

  const toggleRowSelection = (id) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };


  if (!searchData) return <Loading value="Loading data..." />;

  return (
    <div className='pt-8 pb-20 w-screen flex h-screen'>
      {!isLoading ? (
        <div className='w-screen  tracking-wide rounded-3xl mt-20 '>
          <div className='flex'>
            <label for="default-search" className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
            <div className="relative w-5/12 mb-4">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg aria-hidden="true" className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
              </div>
              <input onChange={(e) => { SearchData(e) }} type="search" id="default-search" className="block text-white text-xl bg-inherit w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search Mockups, Logos..." required />
              {/* <button type="submit" className="text-white text-xl absolute right-2.5 bottom-2.5 bg-zinc-500 hover:bg-zinc-600 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2  ">Search</button> */}

            </div>
            <div className="pl-4 flex flex-row justify-around w-7/12">
              <button className="text-white text-xl h-fit bg-zinc-700 hover:bg-zinc-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 mt-2 mr-2">
                <label className="cursor-pointer" htmlFor="upload">ImportFromExcel</label>
                <input
                  className='hidden '
                  type="file"
                  name="upload"
                  id="upload"
                  onChange={readUploadFile}
                />
                {/* <span className="relative">ImportToExcel</span> */}
              </button>
              <button onClick={() => ExportToExcel()} className="text-white text-xl h-fit bg-zinc-700 hover:bg-zinc-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 mt-2 mr-2">

                <span className="relative">ExportToExcel</span>
              </button>
              <button onClick={() => ExportSelectedToExcel()} className="text-white text-xl h-fit bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 mt-2 mr-2">
                Export Selected
              </button>
              <button
                onClick={() => {
                  if (selectedIds.length === 0) {
                    alert("No rows selected!");
                  } else {
                    setDeleteModal(true);
                    setDeleteIndex("bulk"); // special value for bulk delete
                  }
                }}
                className="text-white text-xl h-fit bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 mt-2 mr-2"
              >
                <span className="relative"><img src={Delete} alt="" /></span>
              </button>


              {/* <a href="https://wa.me/919825328865?text=hello" target="_blank" rel="noopener noreferrer"> */}
              <button onClick={(e) => setMssgModal(true)} className="text-white text-xl h-fit bg-zinc-700 hover:bg-zinc-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 mt-2 mr-2">

                <span className="relative"><img src={Whatsapp} alt="" /></span>
              </button>
              <button onClick={(e) => setPrintModal(true)} className="text-white text-xl h-fit bg-zinc-700 hover:bg-zinc-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 mt-2 mr-2">

                <span className="relative"><img src={PrintIcon} alt="" /></span>
              </button>
            </div>
          </div>
          {/* overflow-x-auto */}
          <div className="relative table_body w-screen  shadow-md sm:rounded-lg">
            <table className="w-screen text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className="text-lg  text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="px-2 py-3">
                    <SelectAllWithModal
                      onApplySelection={(ids) => {
                        if (ids === 'ALL') {
                          // Select all visible rows
                          const allIds = searchData && searchData.map(row => row[1]); // assuming your table data has `id`
                          setSelectedIds(allIds);
                        } else {
                          setSelectedIds(ids);
                        }
                      }}
                      validIds={searchData.map(a=>a[1])}
                    />

                  </th>

                  <th scope="col" className="px-6 py-3">
                    <div className='flex'>
                      Sr no. <img src={AscendingIcon} className='pl-2 cursor-pointer' onClick={() => { setSearchData([...searchData].reverse()) }} alt="" />
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Company Name
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Product Name
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Grand Total
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Rate per piece
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Box Size
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Date
                  </th>

                </tr>
              </thead>
              <tbody className="bg-inherit table_body" >
                {!searchData ? "" :
                  searchData.map((data, index) => (
                    <tr
                      key={data[1]} // Ensure this is stable and unique
                      onClick={() => navigate("/rate_calculator", { state: data })}
                      className=" border-b border-opacity-5 bg-inherit  hover:bg-zinc-900 cursor-pointer"
                    >
                      <td className="text-lg text-white px-2 py-4">
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(data[1])}
                          onClick={(e) => e.stopPropagation()}
                          onChange={() => toggleRowSelection(data[1])}
                        />
                      </td>

                      <td className="text-lg text-white px-6 py-4">
                        {data[0].srno + 1}
                      </td>
                      <td className="text-lg text-white px-6 py-4">
                        {data[0].company_name}
                      </td>
                      <td className="text-lg text-white px-6 py-4">
                        {data[0].product_name}
                      </td>
                      <th scope="row" className="text-lg text-white px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                        {data[0].grand_total}
                      </th>
                      <td className="text-lg text-white px-6 py-4">
                        {data[0].rate_per_piece}
                      </td>
                      <td className="text-lg text-white px-6 py-4">
                        {data[0].box_size}
                      </td>
                      <td className="text-lg text-white px-6 py-4">
                        {data[0].date}
                      </td>

                    </tr>

                  )
                  )
                }
              </tbody>
            </table>

          </div>

          <div className={`absolute flex justify-center items-center z-50 ${mssgModal ? "block" : 'hidden'} p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] md:h-full`}>
            <div className="relative  w-full h-full max-w-md md:h-auto">
              <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                <button type="button" onClick={(e) => { setMssgModal(false) }} className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white">
                  <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
                  <span className="sr-only">Close modal</span>
                </button>
                <div className="p-6 ">
                  <div className='mb-4'>
                    <div>
                      <label for="w_num" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Whatsapp Number</label>
                      <input onChange={(e) => setPhoneNUmber(e.target.value)} val={phoneNumber} type="text" name="w_num" id="w_num" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" required />
                    </div>
                    <div id="dropdownHover" className="w-100 z-10 mt-4 mb-4 bg-white divide-y divide-gray-100 rounded-lg shadow w-100 dark:bg-gray-700">
                      <label for="w_num" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Sr No</label>
                      <input onChange={(e) => { setWid(e.target.value); changeWText(e) }} val={wid} type="text" name="w_num" id="w_num" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" required />
                    </div>
                    <div>
                      <label for="w-text" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Please verify the text</label>
                      <textarea value={wText} className="bg-gray-50 h-44 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" >

                      </textarea>
                    </div>
                  </div>
                  <button type="button" className="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center mr-2">
                    <a href={`https://wa.me/91${phoneNumber}?text=${encodeURI(wText)}`} target="_blank" rel="noopener noreferrer">

                      <span className="relative">Whatsapp</span>
                    </a>
                  </button>


                </div>
              </div>
            </div>
          </div>

          <div className={`absolute flex justify-center items-center z-50 ${printModal ? "block" : 'hidden'} p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] md:h-full`}>
            <div className="relative  w-full h-full max-w-md md:h-auto">
              <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                <button type="button" onClick={(e) => { setPrintModal(false) }} className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white">
                  <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
                  <span className="sr-only">Close modal</span>
                </button>
                <div className="p-6 ">
                  <div className='mb-4'>
                    <div id="dropdownHover" className="w-100 z-10 mt-4 mb-4 bg-white divide-y divide-gray-100 rounded-lg shadow w-100 dark:bg-gray-700">
                      <label for="w_num" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Sr No</label>
                      <input onChange={(e) => { setWid(e.target.value); changeWText(e) }} val={wid} type="text" name="w_num" id="w_num" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" required />
                    </div>
                    <div>
                      <label for="w-text" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Please verify the text</label>
                      <textarea value={printPreview} id="printDiv" className="bg-gray-50 h-44 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" >

                      </textarea>
                    </div>
                  </div>
                  <button type="button" className="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center mr-2">
                    <div onClick={() => handlePrint()} rel="noopener noreferrer">

                      <span className="relative">Print</span>
                    </div>
                  </button>
                  <div id="printDiv" className='hidden'>
                    {printData}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className={`absolute flex justify-center items-center z-50 ${deleteModal ? "block" : 'hidden'} p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] md:h-full`}>
            <div class="relative w-full h-full max-w-md md:h-auto">
              <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
                <button onClick={(e) => setDeleteModal(false)} type="button" class="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white">
                  <svg aria-hidden="true" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
                  <span class="sr-only">Close modal</span>
                </button>
                <div class="p-6 text-center">
                  <svg aria-hidden="true" class="mx-auto mb-4 text-gray-400 w-14 h-14 dark:text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                  <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                    {deleteIndex === "bulk" ? (
                      <>
                        Are you sure you want to delete <span className="font-bold">{selectedIds.length}</span> selected products?
                      </>
                    ) : (
                      <>
                        Are you sure you want to delete this product (SR_NO: <span className='font-bold text-xl'>{deleteIndex + 1}</span>)?
                      </>
                    )}
                  </h3>

                  <button onClick={(e) => deleteProduct(e)} type="button" class="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center mr-2">
                    Yes, I'm sure
                  </button>
                  <button onClick={(e) => setDeleteModal(false)} type="button" class="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600">No, cancel</button>
                </div>
              </div>
            </div>
          </div>


        </div>

      ) : (
        <Loading value='Deleting the data' />
      )}
    </div>
  )
}

export default DataSearch