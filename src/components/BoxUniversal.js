import React, { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import Loading from './Loading';
import UpArrow from "../assets/uparrow.png"
import RightArrow from "../assets/rightarrow.png"


const fs = window.require('fs');

const BoxUniversal = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [size1, setSize1] = useState(0);
    const [size2, setSize2] = useState(0);
    const [size3, setSize3] = useState(0);
    const [pFlap, setPFlap] = useState(0);
    const [cFlap, setCFlap] = useState(0);
    const [rows, setRows] = useState(0);
    const [cols, setCols] = useState(0);

    const [sheetSizeL, setSheetSizeL] = useState(0);
    const [sheetSizeB, setSheetSizeB] = useState(0);


    const [company_name, setCompany_name] = useState("")
    const [product_name, setProduct_name] = useState("")
    const [saveDate, setSaveDate] = useState("")
    const [companyDrop, setCompanyDrop] = useState(false)
    const [company_suggestion, setCompany_suggestion] = useState([])
    const [inpIndex, setInpIndex] = useState(-1)
    const [dataValues, setDataValues] = useState(0)
    const [dataValues1, setDataValues1] = useState(0)
    const [dataValues2, setDataValues2] = useState(0)
    const [marginL, setMarginL] = useState(0);
    const [marginB, setMarginB] = useState(0);
    const [marginType,setMarginType] = useState(true)
    const [sheetSizeInchL, setSheetSizeInchL] = useState(0);
    const [sheetSizeInchB, setSheetSizeInchB] = useState(0);
    
    const [boxSize, setBoxSize] = useState("");
    const [ups, setUps] = useState(0);




    const navigate = useNavigate();

    const changeValues = async (val, key) => {
        var y = ("marginL" == key ? val : marginL)
        var w = ("marginB" == key ? val : marginB)
        
        var rowL = ("rows" == key ? val : rows)
        var colL = ("cols" == key ? val : cols)
        setUps(rowL * colL)
        if (rowL != 0) {
            var x = ("cFlap" == key ? val : cFlap) * 2 +  ("size3" == key ? val : size3)
            var a=y+x*rowL
            setSheetSizeL(a)
            setSheetSizeInchL((a/25.4).toFixed(5))
            
        }
        else {
            setSheetSizeL(0)
        }
        var z = (("size1" == key ? val : size1) * 2 + ("size2" == key ? val : size2) * 2 + ("pFlap" == key ? val : pFlap))
        var b=w + z * ("cols" == key ? val : cols)
        setSheetSizeB(b)
        setSheetSizeInchB((b/25.4).toFixed(5))
        setBoxSize(x + "X" + z)

    }

    const saveToJson = async () => {
        var dateObj = new Date();
        var options = { timeZone: 'Asia/Kolkata', day: 'numeric', month: 'numeric', year: 'numeric' };
        var newdate = dateObj.toLocaleString('en-US', options);

        setSaveDate(newdate)
        const jsonValues = {
            company_name: company_name,
            product_name: product_name,
            size1: size1,
            size2: size2,
            size3: size3,
            pFlap: pFlap,
            rows: rows,
            cols: cols,
            sheet_sizeL: sheetSizeL,
            sheet_sizeB: sheetSizeB,
            marginL: marginL,
            marginB: marginB,
            date: newdate,
            ups: ups,
            boxSize: boxSize,
            srno: "0"
        }

        await fs.readFile(process.env.REACT_APP_INPUTUNIVERSALFILE, 'utf8', async function (err, data) {
            const data_values = await JSON.parse(data)
            // setDataValues(data_values)
            jsonValues.srno = data_values.companyData.length
            await data_values.companyData.push(jsonValues)
            fs.writeFile(process.env.REACT_APP_INPUTUNIVERSALFILE, JSON.stringify(data_values, null, 2), (err) => {
                setIsLoading(true)
                setTimeout(() => {
                    setIsLoading(false);
                    navigate("/box_universal_search")
                }, 1500);
                // navigate("/data_search")
            })

        })


    }
    const location = useLocation();
    const dataObj = location.state;
    var data, index;
    if (dataObj) {
        data = dataObj[0]
        index = dataObj[1]
    }
    useEffect(() => {
        if (!data) return 0;
        setCompany_name(data.company_name)
        setProduct_name(data.product_name)
        setSize1(data.size1)
        setSize2(data.size2)
        setSize3(data.size3)
        setPFlap(data.pFlap)
        setRows(data.rows)
        setCols(data.cols)
        setSheetSizeL(data.sheet_sizeL)
        setSheetSizeB(data.sheet_sizeB)
        setMarginL(marginL)
        setMarginB(marginB)
        setBoxSize(boxSize)
        setUps(ups)

    }, [])

    const updateToJson = async () => {
        var dateObj = new Date();
        var options = { timeZone: 'Asia/Kolkata', day: 'numeric', month: 'numeric', year: 'numeric' };
        var newdate = dateObj.toLocaleString('en-US', options);

        // setSaveDate(newdate)
        const jsonValues = {
            company_name: company_name,
            product_name: product_name,
            size1: size1,
            size2: size2,
            size3: size3,
            pFlap: pFlap,
            rows: rows,
            cols: cols,
            sheet_sizeL: sheetSizeL,
            sheet_sizeB: sheetSizeB,
            marginL: marginL,
            marginB: marginB,
            date: newdate,
            ups: ups,
            boxSize: boxSize,
            srno: "0"
        }
        await fs.readFile(process.env.REACT_APP_INPUTUNIVERSALFILE, 'utf8', async function (err, data) {
            const data_values = await JSON.parse(data)
            data_values.companyData[index] = jsonValues
            data_values.companyData[index].srno = index
            fs.writeFile(process.env.REACT_APP_INPUTUNIVERSALFILE, JSON.stringify(data_values, null, 2), (err) => {
                setIsLoading(true)
                setTimeout(() => {
                    setIsLoading(false);
                    navigate("/box_universal_search")
                }, 1500);

            })

        })
    }



    const doMaths = (e) => {
        if (isNaN(e.target.value)) {
            return e.target.value

        }
        else {
            return parseFloat(e.target.value.trim())
        }
    }

    const suggestions = useRef(true);
    useEffect(async () => {
        if (suggestions.current) {
            await fs.readFile(process.env.REACT_APP_INPUTBOXFILE, 'utf8', async function (err, data) {
                const data_values = await JSON.parse(data)
                let temp = new Set()
                data_values.companyData.forEach((key, index) => {
                    temp.add(key.company_name)
                })
                var tempArray = Array.from(temp)
                setCompany_suggestion(tempArray)
                setDataValues(tempArray)
            })
            await fs.readFile(process.env.REACT_APP_INPUTUNIVERSALFILE, 'utf8', async function (err, data) {
                const data_values = await JSON.parse(data)
                let temp = new Set()
                data_values.companyData.forEach((key, index) => {
                    temp.add(key.company_name)
                })
                var tempArray = Array.from(temp)
                setDataValues1(tempArray)
            })
            await fs.readFile(process.env.REACT_APP_INPUTFILE, 'utf8', async function (err, data) {
                const data_values = await JSON.parse(data)
                let temp = new Set()
                data_values.companyData.forEach((key, index) => {
                    temp.add(key.company_name)
                })
                var tempArray = Array.from(temp)
                setDataValues2(tempArray)
            })
            suggestions.current = false
        }
    }, [])


    const SearchData = async (e) => {
        if (e.target.value == "") setCompany_suggestion(dataValues)
        var searchKey = e.target.value
        var temp = [e.target.value]
        var temp1 = new Set()
        dataValues.forEach((key, index) => {
            if (String(key).toLowerCase().includes(searchKey.toLowerCase())) {
                temp1.add(key)
            }
        });
        dataValues1.forEach((key, index) => {
            if (String(key).toLowerCase().includes(searchKey.toLowerCase())) {
                temp1.add(key)
            }
        });
        dataValues2.forEach((key, index) => {
            if (String(key).toLowerCase().includes(searchKey.toLowerCase())) {
                temp1.add(key)
            }
        });
        var tempArray =temp.concat(Array.from(temp1));
        setCompany_suggestion(tempArray)
    }
    const handleKey = (e) => {
        e.stopPropagation()
        if (e.keyCode == 40) {
            setInpIndex((inpIndex + 1) % company_suggestion.length)
            setCompany_name(company_suggestion[(inpIndex + 1) % company_suggestion.length])
        }
        else if (e.keyCode == 38) {
            if (inpIndex == 0) {
                var cIndex = company_suggestion.length - 1
                setInpIndex(cIndex)
                setCompany_name(company_suggestion[cIndex])
            }
            else {
                setInpIndex((inpIndex - 1) % company_suggestion.length)
                setCompany_name(company_suggestion[(inpIndex - 1) % company_suggestion.length])
            }
        }
        else if (e.keyCode == 13) {
            setCompanyDrop(false)
        }
    }
    const clearData = () => {
        setCompany_name(0);
        setProduct_name(0);
        setSize2(0);
        setSize1(0);
        setSize3(0);
        setPFlap(0);
        setRows(0);
        setCols(0);
        setSheetSizeL(0)
        setSheetSizeB(0)
        setSheetSizeInchL(0)
        setSheetSizeInchB(0)
        setMarginL(0)
        setMarginB(0)
        setSaveDate(0);
        setBoxSize(0)
        setUps(0)

    }

    return (
        <div className='h-screen w-screen text-Roboto overflow-x-hidden  pb-40 mt-5 bg-gradient-to-tr from-neutral-700 via-neutral-700 to-neutral-700'>

            {!isLoading ? (
                <div >

                    <section className="w-100 mx-4 p-6 mx-auto  rounded-md shadow-md dark:bg-gray-800 mt-20">
                        <div className="flex flex-cols justify-around w-100 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-6 mt-4 ">
                            <div className='relative'>
                                <label className="text-white text-lg dark:text-gray-200" for="company_name">COMPANY NAME</label>
                                <input onKeyDown={(e) => handleKey(e)} onChange={(e) => { setInpIndex(0); setCompany_name(e.target.value); SearchData(e); setCompanyDrop(e.target.value ? true : false) }} value={company_name} id="company_name" type="text" className="block text-xl  w-11/12 px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring" />
                                <div className={`z-10 bg-white ${companyDrop ? "block" : "hidden"}  focus:block absolute z-50 divide-y divide-gray-100 rounded-lg shadow w-100 dark:bg-gray-700`}>
                                    {/* ${pDrop ? "block" : "hidden"} */}
                                    <ul className="h-auto max-h-48 py-2 overflow-y-auto text-gray-700 dark:text-gray-200" aria-labelledby="dropdownUsersButton">
                                        {
                                            !company_suggestion ? "" :
                                                company_suggestion.map(function (data, index) {
                                                    return (
                                                        index != 0 &&
                                                        <li key={index} className={`flex ${inpIndex == index ? "bg-gray-100" : ""} items-center px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white`}>
                                                            {data}
                                                        </li>

                                                    )
                                                })
                                        }


                                    </ul>
                                </div>
                            </div>
                            <div>
                                <label className="text-white text-lg dark:text-gray-200" for="product_name">PRODUCT NAME</label>
                                <input onChange={(e) => setProduct_name(e.target.value)} value={product_name} id="product_name" type="text" className="block text-xl  w-10/12 px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring" />
                            </div>


                        </div>
                    </section>

                    <section className="w-100 mx-4 p-6 mx-auto  rounded-md shadow-md dark:bg-gray-800 ">
                        <div className='flex'>
                            <h1 className="text-xl text-yellow-300 text-lg capitalize border-2 w-max p-2 border-dashed">Universal</h1>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-6 mt-4 ">
                            <div>
                                <label className="text-white text-lg  dark:text-gray-200" for="size1">SIZE1</label>
                                <input onChange={(e) => { setSize1(doMaths(e)); changeValues(parseFloat(e.target.value), "size1") }} value={size1} id="size1" type="number" className="block text-xl  w-40 px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring" />
                            </div>
                            <div>
                                <label className="text-white text-lg dark:text-gray-200" for="size2">SIZE2</label>
                                <input onChange={(e) => { setSize2(doMaths(e)); changeValues(parseFloat(e.target.value), "size2") }} value={size2} id="size2" type="number" className="block text-xl  w-40 px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring" />
                            </div>

                            <div>
                                <label className="text-white text-lg dark:text-gray-200" for="size3">SIZE3</label>
                                <input onChange={(e) => { setSize3(doMaths(e)); changeValues(parseFloat(e.target.value), "size3") }} value={size3} id="size3" type="number" className="block text-xl  w-40 px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring" />
                            </div>

                            <div>
                                <label className="text-white text-lg dark:text-gray-200" for="pFlap">Pasting Flap</label>
                                <input onChange={(e) => { setPFlap(doMaths(e)); changeValues(parseFloat(e.target.value), "pFlap"); }} value={pFlap} id="pFlap" type="number" className="block text-xl  w-40 px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring" />
                            </div>
                            <div>
                                <label className="text-white text-lg dark:text-gray-200" for="cFlap">Closing Flap</label>
                                <input onChange={(e) => { setCFlap(doMaths(e)); changeValues(parseFloat(e.target.value), "cFlap") }} value={cFlap} id="cFlap" type="number" className="block text-xl  w-40 px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring" />
                            </div>

                            <div>
                                <label className="text-white text-lg dark:text-gray-200 flex" for="rows">Rows &nbsp;&nbsp;<span><img src={UpArrow} /></span></label>
                                <input value={rows} id="rows" type="number" onChange={(e) => { setRows(doMaths(e)); changeValues(parseFloat(e.target.value), "rows") }} className="block text-xl  w-40 px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring" />
                                
                            </div>

                            <div>
                                <label className="text-white text-lg dark:text-gray-200 flex" for="cols">Columns &nbsp;&nbsp;<span><img src={RightArrow} /></span></label>
                                <input onChange={(e) => { setCols(doMaths(e)); changeValues(parseFloat(e.target.value), "cols") }} value={cols} id="cols" type="number" className="block text-xl  w-40 px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring" />
                            </div>
                            <div>
                                <label className="text-white text-lg dark:text-gray-200" for="marginL">MarginL</label>
                                <input onChange={(e) => { setMarginL(doMaths(e)); changeValues(parseFloat(e.target.value), "marginL") }} value={marginL} id="marginL" type="number" className="block text-xl  w-40 px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring" />
                            </div>
                            <div>
                                <label className="text-white text-lg dark:text-gray-200" for="marginB">MarginB</label>
                                <input onChange={(e) => { setMarginB(doMaths(e)); changeValues(parseFloat(e.target.value), "marginB") }} value={marginB} id="marginB" type="number" className="block text-xl  w-40 px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring" />
                            </div>



                        </div>

                    </section>
                    {/* <section className='w-1/2 mx-4 p-6 mx-auto flex flex-cols justify-around rounded-md shadow-md dark:bg-gray-800 mt-2'>
                        <div>
                            <label className="text-white text-lg dark:text-gray-200" for="upsL">Box Size(L)</label>
                            <input value={upsL} id="upsL" type="number" className="block text-2xl  w-44 px-2 py-2 mt-2 font-bold text-red-800 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring" />
                        </div>
                        <div>
                            <label className="text-white text-lg dark:text-gray-200" for="upsB">Box Size(B)</label>
                            <input value={upsB} id="upsB" type="number" className="block text-2xl  w-44 px-2 py-2 mt-2 font-bold text-red-800 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring" />
                        </div>
                    </section> */}
                    <section className='w-1/2 mx-4 p-6 mx-auto flex flex-cols justify-around rounded-md shadow-md dark:bg-gray-800 mt-2'>
                        <div>
                            <label className="text-white text-lg dark:text-gray-200" for="boxSize">Box Size</label>
                            <input value={boxSize} id="boxSize" type="text" className="block text-2xl  w-44 px-2 py-2 mt-2 font-bold text-red-800 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring" />
                        </div>
                        <div>
                            <label className="text-white text-lg dark:text-gray-200" for="ups">Ups</label>
                            <input value={ups} id="ups" type="number" className="block text-2xl  w-40 px-4 py-2 mt-2 font-bold text-red-800 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring" />
                        </div>
                    </section>

                    <section className='w-1/2 mx-4 p-6 mx-auto flex flex-cols justify-around rounded-md shadow-md dark:bg-gray-800 mt-2'>
                        <div className='relative'>
                            <label className="text-white text-lg dark:text-gray-200" for="sheetSizeL">
                                Sheet Size
                            </label>
                            <input value={marginType ? sheetSizeL+" X "+sheetSizeB : sheetSizeInchL+" X "+sheetSizeInchB } id="sheetSizeL" type="text" className="block text-2xl  w-96 px-2 py-2 mt-2 font-bold text-red-800 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring" />
                            <button onClick={()=>{setMarginType(true)}} className={`${marginType ? "bg-zinc-500": ""} bg-white text-black active:bg-pink-600  text-sm mt-1 hover:bg-zinc-500 px-4 font-bold rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150`} type="button">
                                mm
                            </button>
                            <button  onClick={()=>{setMarginType(false)}} className={`${!marginType ? "bg-zinc-500": ""} bg-white text-black active:bg-pink-600 text-sm mt-1 hover:bg-zinc-500 px-4 font-bold rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150`} type="button">
                                in
                            </button>
                        </div>
                        {/* <div>
                            <label className="text-white text-lg dark:text-gray-200" for="sheetSizeB">Sheet Size(B)</label>
                            <input value={sheetSizeB} id="sheetSizeB" type="text" className="block text-2xl  w-48 px-4 py-2 mt-2 font-bold text-red-800 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring" />
                            <button onClick={()=>{set;setMarginTypeB(!marginTypeB)}} className={`${marginTypeB ? "bg-zinc-500": ""} bg-white text-black active:bg-pink-600  text-sm mt-1 hover:bg-zinc-500 px-4 font-bold rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150`} type="button">
                                mm
                            </button>
                            <button  onClick={()=>{setMarginTypeB(!marginTypeB)}} className={`${!marginTypeB ? "bg-zinc-500": ""} bg-white text-black active:bg-pink-600 text-sm mt-1 hover:bg-zinc-500 px-4 font-bold rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150`} type="button">
                                in
                            </button>
                        </div> */}

                    </section>

                    <div className="flex justify-center mt-6">
                        {
                            data &&
                            <button onClick={() => updateToJson()} className="px-6 w-44 py-2 leading-5 text-white text-lg transition-colors duration-200 transform bg-pink-500 rounded-md hover:bg-pink-700 focus:outline-none ">Update</button>

                        }
                        {
                            !data &&
                            <div>
                                <button onClick={() => saveToJson()} className="px-6 py-2 mr-2 w-44 leading-5 text-white text-lg transition-colors duration-200 transform bg-pink-500 rounded-md hover:bg-pink-700 focus:outline-none ">Save</button>
                                <button onClick={() => clearData()} className="px-6 py-2 w-44 leading-5 text-white text-lg transition-colors duration-200 transform bg-pink-500 rounded-md hover:bg-pink-700 focus:outline-none ">Clear</button>

                            </div>
                        }
                    </div>


                </div>
            ) : (
                <Loading value='ADDING YOUR DATA...' />
            )
            }
        </div >
    )
}

export default BoxUniversal;