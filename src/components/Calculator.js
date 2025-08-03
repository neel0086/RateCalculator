import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import Loading from './Loading';
import DropArrow from '../assets/droparrow.png'
import GsmIcon from '../assets/gsm.png'
import DescendingIcon from '../assets/descending.png'
import AscendingIcon from '../assets/ascending.png'


const fs = window.require('fs');

const Calculator = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [size_l, setSize_l] = useState(0);
    const [size_b, setSize_b] = useState(0);
    const [kg, setKg] = useState(0);
    const [gsm, setGsm] = useState(0);
    const [sheet_in_gross, setSheet_in_gross] = useState(0);
    const [textConfirmation, setTextConfirmation] = useState(1555000);
    const [rate_kg, setRate_kg] = useState(0);
    const [gross_rate, setGross_rate] = useState(0);
    const [gross, setGross] = useState(0);
    const [rate_per_sheet, setRate_per_sheet] = useState(0);

    const [quantity, setQuantity] = useState(0)

    const [qty, setQty] = useState(0);
    const [ups, setUps] = useState(0);
    const [board, setBoard] = useState(0);
    const [rate, setRate] = useState(0);

    const [qty1, setQty1] = useState(0);
    const [ups1, setUps1] = useState(0);
    const [board1, setBoard1] = useState(0);
    const [rate1, setRate1] = useState(0);

    const [qty2, setQty2] = useState(0);
    const [ups2, setUps2] = useState(0);
    const [board2, setBoard2] = useState(0);
    const [rate2, setRate2] = useState(0);

    const [board_amt, setBoard_amt] = useState(0);
    const [printing, setPrinting] = useState(0);
    const [total1, setTotal1] = useState(0);
    const [profit, setProfit] = useState(0);
    const [total2, setTotal2] = useState(0);
    const [varnish, setVarnish] = useState(0);
    const [ink, setInk] = useState(0);
    const [pasting, setPasting] = useState(0);
    const [punching, setPunching] = useState(0);
    const [plate, setPlate] = useState(0);
    const [binding, setBinding] = useState(0);
    const [grand_total, setGrand_total] = useState(0);
    const [rate_per_piece, setRate_per_piece] = useState(0);
    const [company_name, setCompany_name] = useState("")
    const [product_name, setProduct_name] = useState("")
    const [remarks, setRemarks] = useState("")
    const [box_size, setBox_size] = useState("")
    const [dataValues, setDataValues] = useState(0)

    const [lamDrop, setLamDrop] = useState(false)
    const [lamSize1, setLamSize1] = useState(0)
    const [lamSize2, setLamSize2] = useState(0)
    const [lamNum, setLamNum] = useState(0)
    const [lamQty, setLamQty] = useState(0)

    const [pDrop, setPDrop] = useState(false)
    const [pNum1, setPNum1] = useState(0)
    const [pNum2, setPNum2] = useState(0)
    const [pNum3, setPNum3] = useState(0)
    const [pmNum1, setPmNum1] = useState(0)
    const [pmNum2, setPmNum2] = useState(0)
    const [pmNum3, setPmNum3] = useState(0)

    const [pasteDrop, setPasteDrop] = useState(false)
    const [pasteNum1, setPasteNum1] = useState(0)
    const [pasteNum2, setPasteNum2] = useState(0)

    const [bindDrop, setBindDrop] = useState(false)
    const [bindNum1, setBindNum1] = useState(0)
    const [bindNum2, setBindNum2] = useState(0)

    const [punchDrop, setPunchDrop] = useState(false)
    const [punchNum1, setPunchNum1] = useState(0)
    const [punchNum2, setPunchNum2] = useState(0)

    const [companyDrop, setCompanyDrop] = useState(false)
    const [company_suggestion, setCompany_suggestion] = useState([])
    const [inpIndex, setInpIndex] = useState(-1)
    const [colors, setColors] = useState("")
    const [productDrop, setProductDrop] = useState(false)
    const [sizeDrop, setSizeDrop] = useState(false)
    const [remarkDrop, setRemarkDrop] = useState(false)
    const [colorDrop, setColorDrop] = useState(false)

    const [preGsm, setPreGsm] = useState([])
    const [multiColor, setMultiColor] = useState(false)
    const [gsmModal, setGsmModal] = useState(false)


    const navigate = useNavigate();

    const changeValues = async (val, key) => {

        var x = ((("size_l" === key ? val : size_l) * ("size_b" === key ? val : size_b) * ("gsm" === key ? val : gsm) * ("sheet_in_gross" === key ? val : sheet_in_gross)) / 1555000)
        setKg(x.toFixed(4))

        var x1 = (x * ("rate_kg" === key ? val : rate_kg))
        setGross_rate(x1.toFixed(4))

        console.log(x1, gross, val)
        var x2 = (x1 / ("sheet_in_gross" === key ? val : gross))
        setRate_per_sheet(x2.toFixed(4))

        var x3 = (("qty" === key ? val : qty) / ("ups" === key ? val : ups))
        x3 = ("ups" === key ? val : ups) !== 0 ? x3 : 0
        setBoard(x3)

        var x4 = (("qty1" === key ? val : qty1) / ("ups1" === key ? val : ups1))
        x4 = ("ups1" === key ? val : ups1) !== 0 ? x4 : 0
        setBoard1(x4)

        var x5 = (("qty2" === key ? val : qty2) / ("ups2" === key ? val : ups2))
        x5 = ("ups2" === key ? val : ups2) !== 0 ? x5 : 0
        setBoard2(x5)

        var x6 = x3 * ("rate" === key ? val : rate) + x4 * ("rate1" === key ? val : rate1) + x5 * ("rate2" === key ? val : rate2)
        setBoard_amt(x6)

        // console.log(printing,board_amt,key,val)
        var x7 = x6 + ("printing" === key ? val : printing) + ("ink" === key ? val : ink) + ("pasting" === key ? val : pasting) + ("punching" === key ? val : punching)
        setTotal1(x7)

        var x8 = (x7 * ("profit" === key ? val : profit)) / (100) + x7
        setTotal2(x8)

        var x9 = x8 + ("varnish" === key ? val : varnish) + ("plate" === key ? val : plate) + ("binding" === key ? val : binding)
        setGrand_total(x9.toFixed(4))

        var x10 = x9 / ("quantity" === key ? val : quantity)
        setRate_per_piece(x10.toFixed(4))

    }

    const saveToJson = async () => {
        var dateObj = new Date();
        var options = { timeZone: 'Asia/Kolkata', day: 'numeric', month: 'numeric', year: 'numeric' };
        var newdate = dateObj.toLocaleString('en-US', options);

        const jsonValues = {
            company_name: company_name,
            product_name: product_name,
            size_l: size_l,
            size_b: size_b,
            gsm: gsm,
            sheet_in_gross: sheet_in_gross,
            textConfirmation: textConfirmation,
            kg: kg,
            rate_kg: rate_kg,
            gross_rate: gross_rate,
            gross: gross,
            rate_per_sheet: rate_per_sheet,
            qty: qty,
            ups: ups,
            board: board,
            rate: rate,
            colors: colors,

            quantity: quantity,

            qty1: qty1,
            ups1: ups1,
            board1: board1,
            rate1: rate1,

            qty2: qty2,
            ups2: ups2,
            board2: board2,
            rate2: rate2,

            board_amt: board_amt,
            printing: printing,
            total1: total1,
            profit: profit,
            total2: total2,
            varnish: varnish,
            ink: ink,
            pasting: pasting,
            punching: punching,
            plate: plate,
            binding: binding,
            grand_total: grand_total,
            rate_per_piece: rate_per_piece,
            remarks: remarks,
            box_size: box_size,
            date: newdate,
            srno: "0"
        }

        await fs.readFile(process.env.REACT_APP_INPUTFILE, 'utf8', async function (err, data) {
            const data_values = await JSON.parse(data)
            // setDataValues(data_values)
            jsonValues.srno = data_values.companyData.length
            await data_values.companyData.push(jsonValues)
            fs.writeFile(process.env.REACT_APP_INPUTFILE, JSON.stringify(data_values, null, 2), (err) => {
                setIsLoading(true)
                setTimeout(() => {
                    setIsLoading(false);
                    navigate("/data_search")
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
        setSize_l(data.size_l)
        setSize_b(data.size_b)
        setGsm(data.gsm)
        setSheet_in_gross(data.sheet_in_gross)
        setTextConfirmation(data.textConfirmation)
        setKg(data.kg)
        setRate_kg(data.rate_kg)
        setGross_rate(data.gross_rate)
        setGross(data.gross)
        setRate_per_sheet(data.rate_per_sheet)
        setQty(data.qty)
        setUps(data.ups)
        setBoard(data.board)
        setRate(data.rate)

        setQuantity(data.quantity)

        setQty1(data.qty1)
        setUps1(data.ups1)
        setBoard1(data.board1)
        setRate1(data.rate1)

        setQty2(data.qty2)
        setUps2(data.ups2)
        setBoard2(data.board2)
        setRate2(data.rate2)

        setBoard_amt(data.board_amt)
        setPrinting(data.printing)
        setTotal1(data.total1)
        setProfit(data.profit)
        setTotal2(data.total2)
        setVarnish(data.varnish)
        setInk(data.ink)
        setPasting(data.pasting)
        setPunching(data.punching)
        setPlate(data.plate)
        setBinding(data.binding)
        setGrand_total(data.grand_total)
        setRate_per_piece(data.rate_per_piece)
        setBox_size(data.box_size)
        setRemarks(data.remarks)
        setColors(data.colors)

    }, [data])

    const updateToJson = async () => {
        var dateObj = new Date();
        var options = { timeZone: 'Asia/Kolkata', day: 'numeric', month: 'numeric', year: 'numeric' };
        var newdate = dateObj.toLocaleString('en-US', options);

        // setSaveDate(newdate)
        const jsonValues = {
            company_name: company_name,
            product_name: product_name,
            size_l: size_l,
            size_b: size_b,
            gsm: gsm,
            sheet_in_gross: sheet_in_gross,
            textConfirmation: textConfirmation,
            kg: kg,
            rate_kg: rate_kg,
            gross_rate: gross_rate,
            gross: gross,
            rate_per_sheet: rate_per_sheet,

            quantity: quantity,

            qty: qty,
            ups: ups,
            board: board,
            rate: rate,

            qty1: qty1,
            ups1: ups1,
            board1: board1,
            rate1: rate1,

            qty2: qty2,
            ups2: ups2,
            board2: board2,
            rate2: rate2,

            board_amt: board_amt,
            printing: printing,
            total1: total1,
            profit: profit,
            total2: total2,
            varnish: varnish,
            ink: ink,
            pasting: pasting,
            punching: punching,
            plate: plate,
            binding: binding,
            grand_total: grand_total,
            rate_per_piece: rate_per_piece,
            box_size: box_size,
            remarks: remarks,
            date: newdate,
            colors: colors,
            srno: "0"
        }
        await fs.readFile(process.env.REACT_APP_INPUTFILE, 'utf8', async function (err, data) {
            const data_values = JSON.parse(data);

            data_values.companyData[index] = jsonValues;

            const updatedEntry = data_values.companyData.splice(index, 1)[0];
            data_values.companyData.push(updatedEntry);

            data_values.companyData.forEach((entry, i) => {
                entry.srno = i;
            });

            fs.writeFile(process.env.REACT_APP_INPUTFILE, JSON.stringify(data_values, null, 2), (err) => {
                setIsLoading(true)
                setTimeout(() => {
                    setIsLoading(false);
                    navigate("/data_search")
                }, 1500);

            })

        })
    }
    const updateLamnination = (val, key) => {
        const l0 = ("lamSize1" === key ? val : lamSize1),
            l1 = ("lamSize2" === key ? val : lamSize2),
            l2 = ("lamNum" === key ? val : lamNum),
            l3 = ("lamQty" === key ? val : lamQty)
        if (l0 !== 0 && l1 !== 0 && l2 !== 0 && l3 !== 0) {
            setVarnish((l0 * l1 * l2 * l3) / 100)
            changeValues((l0 * l1 * l2 * l3) / 100, "varnish")
        }
        else {
            setVarnish(0)
        }
    }

    const updatePrinting = (val, key) => {
        const p0 = ("pNum1" === key ? val : pNum1),
            p1 = ("pNum2" === key ? val : pNum2),
            p2 = ("pNum3" === key ? val : pNum3),
            p4 = ("pmNum1" === key ? val : pmNum1),
            p5 = ("pmNum2" === key ? val : pmNum2),
            p6 = ("pmNum3" === key ? val : pmNum3)
        let sm = 0
        if (p0 !== 0 && p1 !== 0 && p2 !== 0) {
            sm += (p0 * p1 * p2)
        }
        if (p4 !== 0 && p5 !== 0 && p6 !== 0) {
            sm += (p4 + Math.ceil((p6 - 1000) / 1000) * p5)
        }
        setPrinting(sm)
        changeValues(sm, "printing")


    }

    // const updateMultiPrinting = (val, key) => {
    //     const p0 = ("pNum1" === key ? val : pNum1),
    //         p1 = ("pNum2" === key ? val : pNum2),
    //         p2 = ("pNum3" === key ? val : pNum3)
    //     if (p0 !== 0 && p1 !== 0 && p2 !== 0) {
    //         setPrinting(p0 + ((p2 - 1000) / 1000) * p1)
    //         changeValues(p0 + ((p2 - 1000) / 1000) * p1, "printing")
    //     }
    //     else {
    //         setPrinting(0)
    //     }

    // }

    const updatePunching = (val, key) => {
        const p0 = ("punchNum1" === key ? val : punchNum1),
            p1 = ("punchNum2" === key ? val : punchNum2)
        if (p0 !== 0 && p1 !== 0) {
            setPunching(p0 * p1)
            changeValues(p0 * p1, "punching")
        }
        else {
            setPunching(0)
        }
    }

    const updatePasting = (val, key) => {
        const p0 = ("pasteNum1" === key ? val : pasteNum1),
            p1 = ("pasteNum2" === key ? val : pasteNum2)
        if (p0 !== 0 && p1 !== 0) {
            setPasting(p0 * p1 / 1000)
            changeValues(p0 * p1 / 1000, "pasting")
        }
        else {
            setPasting(0)
        }
    }

    const updateBinding = (val, key) => {
        const b0 = ("bindNum1" === key ? val : bindNum1),
            b1 = ("bindNum2" === key ? val : bindNum2)
        if (b0 !== 0 && b1 !== 0) {
            setBinding(b0 * b1)
            changeValues(b0 * b1, "binding")
        }
        else {
            setBinding(0)
        }
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


    useEffect(() => {
        const loadData = async () => {
            if (suggestions.current) {
                await fs.readFile(process.env.REACT_APP_INPUTFILE, 'utf8', async function (err, data) {
                    const data_values = await JSON.parse(data)
                    setPreGsm(Array.from(await JSON.parse(data)))
                    let temp = new Set()

                    data_values.companyData.forEach((key, index) => {
                        temp.add(key.companyData)
                    })
                    var tempArray = Array.from(temp)
                    setCompany_suggestion(tempArray)
                    setDataValues(data_values.companyData)
                })
                suggestions.current = false
            }
        }
        loadData()
    }, [])


    const SearchData = async (e, c) => {
        setCompanyDrop(false)
        setProductDrop(false)
        setRemarkDrop(false)
        setColorDrop(false)
        setSizeDrop(false)

        let tempS = new Set()
        if (c === "company") {
            dataValues.forEach((key, index) => {
                tempS.add(key.company_name)
            })
        }
        else if (c === "product") {
            dataValues.forEach((key, index) => {
                tempS.add(key.product_name)
            })
        }
        else if (c === 'remark') {
            dataValues.forEach((key, index) => {
                tempS.add(key.remarks)
            })
        }
        else if (c === 'color') {
            dataValues.forEach((key, index) => {
                tempS.add(key.colors)
            })
        }
        else if (c === 'size') {
            dataValues.forEach((key, index) => {
                tempS.add(key.size)
            })
        }
        var tempArray = Array.from(tempS)
        // if (e.target.value === "") setCompany_suggestion(dataValues)
        var searchKey = e.target.value
        var temp = [e.target.value]
        tempArray.forEach((key, index) => {
            if (String(key).toLowerCase().includes(searchKey.toLowerCase())) {
                temp.push(key)
            }
        });
        setCompany_suggestion(temp)
    }

    const checkClick = () => {
        // if(!e.target.closest('#menu'))
    }
    const handleSearchName = (c, x) => {
        if (c === "company") {
            setCompany_name(x)

        }
        else if (c === "product") {
            setProduct_name(x)

        }
        else if (c === 'remark') {
            setRemarks(x)

        }
        else if (c === 'color') {
            setColors(x)

        }
        else if (c === 'size') {
            setBox_size(x)
        }
    }
    const handleKey = (e, c) => {
        e.stopPropagation()
        if (e.keyCode === 40) {
            setInpIndex((inpIndex + 1) % company_suggestion.length)
            handleSearchName(c, company_suggestion[(inpIndex + 1) % company_suggestion.length])
        }
        else if (e.keyCode === 38) {
            if (inpIndex === 0) {
                var cIndex = company_suggestion.length - 1
                setInpIndex(cIndex)
                handleSearchName(c, company_suggestion[cIndex])

            }
            else {
                setInpIndex((inpIndex - 1) % company_suggestion.length)
                handleSearchName(c, company_suggestion[(inpIndex - 1) % company_suggestion.length])

            }
        }
        else if (e.keyCode === 9 || e.keyCode === 13) {
            setCompanyDrop(false)
            setProductDrop(false)
            setRemarkDrop(false)
            setColorDrop(false)
            setSizeDrop(false)

        }
    }
    const clearData = () => {
        setCompany_name(0);
        setProduct_name(0);
        setSize_b(0);
        setSize_l(0);
        setSize_b(0);
        setGsm(0);
        setSheet_in_gross(0);
        setTextConfirmation(0);
        setKg(0);
        setRate_kg(0);
        setGross_rate(0);
        setGross(0);
        setRate_per_sheet(0);
        setQty(0);
        setUps(0);
        setBoard(0);
        setRate(0);
        setQuantity(0);
        setQty1(0);
        setUps1(0);
        setBoard1(0);
        setRate1(0);
        setQty2(0);
        setUps2(0);
        setBoard2(0);
        setRate2(0);
        setBoard_amt(0);
        setPrinting(0);
        setTotal1(0);
        setProfit(0);
        setTotal2(0);
        setVarnish(0);
        setInk(0);
        setPasting(0);
        setPunching(0);
        setPlate(0);
        setBinding(0);
        setGrand_total(0);
        setRate_per_piece(0);
        setBox_size(0);
        setRemarks(0);
        setColors(0);

    }
    const getGsmData = async () => {
        await fs.readFile(process.env.REACT_APP_INPUTFILE, 'utf8', async function (err, data) {
            const data_values = await JSON.parse(data)
            var temp = [];
            data_values.companyData.forEach((key, index) => {
                temp.push(key)
            })
            const uniqueData = temp.filter((obj, index, arr) => {
                return (
                    index ===
                    arr.findIndex(
                        (t) =>
                            t.size_l === obj.size_l && t.size_b === obj.size_b && t.gsm === obj.gsm
                    )
                );
            });
            setPreGsm(uniqueData.reverse())
        })
    }

    const setPreData = (e) => {
        var temp;
        console.log(e)
        preGsm.forEach((data) => {
            if (data.srno === e) {
                temp = data;
                console.log(temp)

            }
        })
        setSize_b(temp.size_b);
        setSize_l(temp.size_l);
        setGsm(temp.gsm);
        setSheet_in_gross(temp.sheet_in_gross);
        setTextConfirmation(temp.textConfirmation);
        setKg(temp.kg);
        setRate_kg(temp.rate_kg);
        setGross_rate(temp.gross_rate);
        setGross(temp.gross);
        setRate_per_sheet(temp.rate_per_sheet);
        setGsmModal(false)
    }
    document.addEventListener("keyup", (e) => {
        if (e.keyCode === 9) {
            const activeElementId = document.activeElement?.id;
            if (pDrop === true && (activeElementId !== 'pnum3' && activeElementId !== 'pnum2' && activeElementId !== 'pnum1')) {
                setPDrop(false)
            }


            if (pasteDrop === true && (activeElementId !== 'pasteNum1' && activeElementId !== 'pasteNum2')) {

                setPasteDrop(false)

            }

            if (lamDrop === true && (activeElementId !== 'lamSize1' && activeElementId !== 'lamSize2' && activeElementId !== 'lamSize3' && activeElementId !== 'lamSize4')) {

                setLamDrop(false)

            }

            if (punchDrop === true && (activeElementId !== 'punchNum1' && activeElementId !== 'punchNum2')) {

                setPunchDrop(false)


            }
            if (bindDrop === true && (activeElementId !== 'bindNum1' && activeElementId !== 'bindNum2')) {

                setBindDrop(false)


            }

        }
    })
    return (
        <div onClick={(e) => checkClick()} className='h-screen w-screen  overflow-x-hidden  pb-40 mt-5 bg-gradient-to-tr from-neutral-700 via-neutral-700 to-neutral-700'>

            {!isLoading ? (
                <div >
                    <section className="w-100 mx-4 p-6 mx-auto text-Roboto rounded-md shadow-md dark:bg-gray-800 mt-20">
                        <div className="flex flex-cols justify-around w-100 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-6 mt-4 ">
                            <div className='relative'>
                                <label className="text-white text-lg dark:text-gray-200" for="company_name">COMPANY NAME</label>
                                <input onKeyDown={(e) => handleKey(e, "company")} onChange={(e) => { setInpIndex(0); setCompany_name(e.target.value); SearchData(e, "company"); setCompanyDrop(e.target.value ? true : false) }} value={company_name} id="company_name" type="text" className="block text-xl  w-11/12 px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring" />
                                <div className={`z-10 bg-white ${companyDrop ? "block" : "hidden"}  focus:block absolute z-50 divide-y divide-gray-100 rounded-lg shadow w-100 dark:bg-gray-700`}>
                                    {/* ${pDrop ? "block" : "hidden"} */}
                                    <ul className="h-auto max-h-48 py-2 overflow-y-auto text-gray-700 dark:text-gray-200" aria-labelledby="dropdownUsersButton">
                                        {
                                            !company_suggestion ? "" :
                                                company_suggestion.map(function (data, index) {
                                                    return (
                                                        index !== 0 &&
                                                        <li key={index} className={`flex ${inpIndex === index ? "bg-gray-100" : ""} items-center px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white`}>
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
                                <input onKeyDown={(e) => handleKey(e, "product")} onChange={(e) => { setInpIndex(0); setProduct_name(e.target.value); SearchData(e, "product"); setProductDrop(e.target.value ? true : false) }} value={product_name} id="product_name" type="text" className="block text-xl  w-10/12 px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring" />
                                <div className={`z-10 bg-white ${productDrop ? "block" : "hidden"}  focus:block absolute z-50 divide-y divide-gray-100 rounded-lg shadow w-100 dark:bg-gray-700`}>
                                    {/* ${pDrop ? "block" : "hidden"} */}
                                    <ul className="h-auto max-h-48 py-2 overflow-y-auto text-gray-700 dark:text-gray-200" aria-labelledby="dropdownUsersButton">
                                        {
                                            !company_suggestion ? "" :
                                                company_suggestion.map(function (data, index) {
                                                    return (
                                                        index !== 0 &&
                                                        <li key={index} className={`flex ${inpIndex === index ? "bg-gray-100" : ""} items-center px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white`}>
                                                            {data}
                                                        </li>

                                                    )
                                                })
                                        }


                                    </ul>
                                </div>
                            </div>



                        </div>
                    </section>

                    <section className="w-100 mx-4 p-6 mx-auto  rounded-md shadow-md dark:bg-gray-800 mt-2">
                        <div className="flex flex-cols justify-around w-100 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 mt-4 ">


                            <div>
                                <label className="text-white text-lg dark:text-gray-200" for="box_size">SIZE</label>
                                <input onKeyDown={(e) => handleKey(e, "size")} onChange={(e) => { setBox_size(e.target.value); SearchData(e, "size"); setSizeDrop(e.target.value ? true : false) }} value={box_size} id="box_size" type="text" className="block text-xl w-10/12  px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring" />
                                <div className={`z-10 bg-white ${sizeDrop ? "block" : "hidden"}  focus:block absolute z-50 divide-y divide-gray-100 rounded-lg shadow w-100 dark:bg-gray-700`}>
                                    {/* ${pDrop ? "block" : "hidden"} */}
                                    <ul className="h-auto max-h-48 py-2 overflow-y-auto text-gray-700 dark:text-gray-200" aria-labelledby="dropdownUsersButton">
                                        {
                                            !company_suggestion ? "" :
                                                company_suggestion.map(function (data, index) {
                                                    return (
                                                        index !== 0 &&
                                                        <li key={index} className={`flex ${inpIndex === index ? "bg-gray-100" : ""} items-center px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white`}>
                                                            {data}
                                                        </li>

                                                    )
                                                })
                                        }


                                    </ul>
                                </div>
                            </div>
                            <div>
                                <label className="text-white text-lg dark:text-gray-200" for="remarks">REMARKS</label>
                                <input onKeyDown={(e) => handleKey(e, "remark")} onChange={(e) => { setRemarks(e.target.value); SearchData(e, "remark"); setRemarkDrop(e.target.value ? true : false) }} value={remarks} id="remarks" type="text" className="block text-xl w-10/12  px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring" />
                                <div className={`z-10 bg-white ${remarkDrop ? "block" : "hidden"}  focus:block absolute z-50 divide-y divide-gray-100 rounded-lg shadow w-100 dark:bg-gray-700`}>
                                    {/* ${pDrop ? "block" : "hidden"} */}
                                    <ul className="h-auto max-h-48 py-2 overflow-y-auto text-gray-700 dark:text-gray-200" aria-labelledby="dropdownUsersButton">
                                        {
                                            !company_suggestion ? "" :
                                                company_suggestion.map(function (data, index) {
                                                    return (
                                                        index !== 0 &&
                                                        <li key={index} className={`flex ${inpIndex === index ? "bg-gray-100" : ""} items-center px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white`}>
                                                            {data}
                                                        </li>

                                                    )
                                                })
                                        }


                                    </ul>
                                </div>
                            </div>
                            <div>
                                <label className="text-white text-lg dark:text-gray-200" for="color">Color</label>
                                <input onKeyDown={(e) => handleKey(e, "color")} onChange={(e) => { setColors(e.target.value); SearchData(e, "color"); setColorDrop(e.target.value ? true : false) }} value={colors} id="color" type="text" className="block text-xl  w-10/12 px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring" />
                                <div className={`z-10 bg-white ${colorDrop ? "block" : "hidden"}  focus:block absolute z-50 divide-y divide-gray-100 rounded-lg shadow w-100 dark:bg-gray-700`}>
                                    {/* ${pDrop ? "block" : "hidden"} */}
                                    <ul className="h-auto max-h-48 py-2 overflow-y-auto text-gray-700 dark:text-gray-200" aria-labelledby="dropdownUsersButton">
                                        {
                                            !company_suggestion ? "" :
                                                company_suggestion.map(function (data, index) {
                                                    return (
                                                        index !== 0 &&
                                                        <li key={index} className={`flex ${inpIndex === index ? "bg-gray-100" : ""} items-center px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white`}>
                                                            {data}
                                                        </li>

                                                    )
                                                })
                                        }


                                    </ul>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="w-100 mx-4 p-6 mx-auto  rounded-md shadow-md dark:bg-gray-800 ">
                        <div className='flex'>
                            <h1 className="text-xl text-yellow-300 text-lg capitalize border-2 w-max p-2 border-dashed">PAPER CALCULATION</h1>
                            <img src={GsmIcon} className='w-10 h-6 px-2 mt-4 cursor-pointer' onClick={(e) => { setGsmModal(true); getGsmData(e) }} alt=""/>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-6 mt-4 ">
                            <div>
                                <label className="text-white text-lg  dark:text-gray-200" for="size_l">SIZE_L</label>
                                <input onChange={(e) => { setSize_l(doMaths(e)); changeValues(parseFloat(e.target.value), "size_l") }} value={size_l} id="size_l" type="number" className="block text-xl  w-40 px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring" />
                            </div>
                            <div>
                                <label className="text-white text-lg dark:text-gray-200" for="size_b">SIZE_B</label>
                                <input onChange={(e) => { setSize_b(doMaths(e)); changeValues(parseFloat(e.target.value), "size_b") }} value={size_b} id="size_b" type="number" className="block text-xl  w-40 px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring" />
                            </div>

                            <div>
                                <label className="text-white text-lg dark:text-gray-200" for="gsm">GSM</label>
                                <input onChange={(e) => { setGsm(doMaths(e)); changeValues(parseFloat(e.target.value), "gsm") }} value={gsm} id="gsm" type="number" className="block text-xl  w-40 px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring" />
                            </div>

                            <div>
                                <label className="text-white text-lg dark:text-gray-200" for="sheet_in_gross">SHEET IN GROSS</label>
                                <input onChange={(e) => { setSheet_in_gross(doMaths(e)); setGross(doMaths(e)); changeValues(parseFloat(e.target.value), "sheet_in_gross"); }} value={sheet_in_gross} id="sheet_in_gross" type="number" className="block text-xl  w-40 px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring" />
                            </div>

                            <div>
                                <label className="text-white text-lg dark:text-gray-200" for="textConfirmation">TOTAL</label>
                                <input value={textConfirmation} id="textConfirmation" type="number" className="block text-xl  w-40 px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring" />
                            </div>
                            <div>
                                <label className="text-white text-lg dark:text-gray-200" for="kg">KG</label>
                                <input value={kg} id="kg" type="number" className="block text-xl  w-40 px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring" />
                            </div>
                            <div>
                                <label className="text-white text-lg dark:text-gray-200" for="rate_kg">RATE(KG)</label>
                                <input onChange={(e) => { setRate_kg(doMaths(e)); changeValues(parseFloat(e.target.value), "rate_kg") }} value={rate_kg} id="rate_kg" type="number" className="block text-xl  w-40 px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring" />
                            </div>

                            <div>
                                <label className="text-white text-lg dark:text-gray-200" for="gross_rate">GROSS RATE</label>
                                <input value={gross_rate} id="gross_rate" type="number" className="block text-xl  w-40 px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring" />
                            </div>

                            <div>
                                <label className="text-white text-lg dark:text-gray-200" for="gross">GROSS</label>
                                <input onChange={(e) => { setGross(doMaths(e)); changeValues(parseFloat(e.target.value), "gross") }} value={gross} id="gross" type="number" className="block text-xl  w-40 px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring" />
                            </div>

                            <div>
                                <label className="text-white text-lg dark:text-gray-200" for="rate_per_sheet">RATE PER SHEET</label>
                                <input value={rate_per_sheet} id="rate_per_sheet" type="number" className="block text-xl  w-40 px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring" />
                                <button onClick={(e) => { setRate(rate_per_sheet); changeValues(parseFloat(rate_per_sheet), "rate") }} className="bg-white text-black active:bg-pink-600  text-sm mt-1 hover:bg-zinc-500 px-4 font-bold rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150" type="button">
                                    1
                                </button>
                                <button onClick={(e) => { setRate1(rate_per_sheet); changeValues(parseFloat(rate_per_sheet), "rate1") }} className="bg-white text-black active:bg-pink-600 text-sm mt-1 hover:bg-zinc-500 px-4 font-bold rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150" type="button">
                                    2
                                </button>
                                <button onClick={(e) => { setRate2(rate_per_sheet); changeValues(parseFloat(rate_per_sheet), "rate2") }} className="bg-white text-black active:bg-pink-600 text-sm mt-1 hover:bg-zinc-500 px-4 font-bold rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150" type="button">
                                    3
                                </button>
                            </div>
                        </div>
                        <h1 className="text-xl mt-16 text-yellow-300 font-bold text-lg capitalize border-2 w-max p-2 border-dashed">PRODUCT CALCULATION
                        </h1>
                        <div className="grid mt-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-8  ">
                            <div>
                                <label className="text-white text-lg dark:text-gray-200" for="quantity">QUANTITY</label>
                                <input onChange={(e) => { setQuantity(doMaths(e)); changeValues(parseFloat(e.target.value), "quantity") }} value={quantity} id="quantity" type="number" className="block text-xl  w-40 px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring" />
                            </div>
                        </div>
                        <div className="grid xl:w-9/12 lg:w-9/12 md:w-100 sm:w-100 mt-4 grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4 gap-8  ">
                            <div>
                                <label className="text-white text-lg dark:text-gray-200" for="qty">QTY</label>
                                <input onChange={(e) => { setQty(doMaths(e)); changeValues(parseFloat(e.target.value), "qty") }} value={qty} id="qty" type="number" className="block text-xl  w-40 px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring" />
                            </div>
                            <div>
                                <label className="text-white text-lg dark:text-gray-200" for="ups">UPS</label>
                                <input onChange={(e) => { setUps(doMaths(e)); changeValues(parseFloat(e.target.value), "ups") }} value={ups} id="ups" type="number" className="block text-xl  w-40 px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring" />
                            </div>
                            <div>
                                <label className="text-white text-lg dark:text-gray-200" for="board">BOARD</label>
                                <input value={board} id="board" type="number" className="block text-xl  w-40 px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring" />
                            </div>
                            <div>
                                <label className="text-white text-lg dark:text-gray-200" for="rate">RATE</label>
                                <input onChange={(e) => { setRate(doMaths(e)); changeValues(parseFloat(e.target.value), "rate") }} value={rate} id="rate" type="number" className="block text-xl  w-40 px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring" />

                            </div>

                            {/* 1st1 */}
                            <div>
                                <label className="text-white text-lg dark:text-gray-200" for="qty1">QTY1</label>
                                <input onChange={(e) => { setQty1(doMaths(e)); changeValues(parseFloat(e.target.value), "qty1") }} value={qty1} id="qty1" type="number" className="block text-xl  w-40 px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring" />
                            </div>
                            <div>
                                <label className="text-white text-lg dark:text-gray-200" for="ups1">UPS1</label>
                                <input onChange={(e) => { setUps1(doMaths(e)); changeValues(parseFloat(e.target.value), "ups1") }} value={ups1} id="ups1" type="number" className="block text-xl  w-40 px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring" />
                            </div>
                            <div>
                                <label className="text-white text-lg dark:text-gray-200" for="board1">BOARD1</label>
                                <input value={board1} id="board1" type="number" className="block text-xl  w-40 px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring" />
                            </div>
                            <div>
                                <label className="text-white text-lg dark:text-gray-200" for="rate1">RATE1</label>
                                <input onChange={(e) => { setRate1(doMaths(e)); changeValues(parseFloat(e.target.value), "rate1") }} value={rate1} id="rate1" type="number" className="block text-xl  w-40 px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring" />
                            </div>

                            {/* 2ND */}
                            <div>
                                <label className="text-white text-lg dark:text-gray-200" for="qty2">QTY2</label>
                                <input onChange={(e) => { setQty2(doMaths(e)); changeValues(parseFloat(e.target.value), "qty2") }} value={qty2} id="qty2" type="number" className="block text-xl  w-40 px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring" />
                            </div>
                            <div>
                                <label className="text-white text-lg dark:text-gray-200" for="ups2">UPS2</label>
                                <input onChange={(e) => { setUps2(doMaths(e)); changeValues(parseFloat(e.target.value), "ups2") }} value={ups2} id="ups2" type="number" className="block text-xl  w-40 px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring" />
                            </div>
                            <div>
                                <label className="text-white text-lg dark:text-gray-200" for="board2">BOARD2</label>
                                <input value={board2} id="board2" type="number" className="block text-xl  w-40 px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring" />
                            </div>
                            <div>
                                <label className="text-white text-lg dark:text-gray-200" for="rate2">RATE2</label>
                                <input onChange={(e) => { setRate2(doMaths(e)); changeValues(parseFloat(e.target.value), "rate2") }} value={rate2} id="rate2" type="number" className="block text-xl  w-40 px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring" />
                            </div>
                            <div>
                                <label className="text-white text-lg dark:text-gray-200" for="board_amt">BOARD AMOUNT</label>
                                <input value={board_amt} id="board_amt" type="number" className="block text-xl  w-40 px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring" />
                            </div>


                            <div className='relative'>
                                <label className="text-white text-lg dark:text-gray-200" for="printing">PRINTING</label>
                                <input onChange={(e) => { setPrinting(doMaths(e)); changeValues(parseFloat(e.target.value), "printing") }} value={printing} id="printing" type="number" className="block text-xl  w-40 px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring" />
                                <img src={DropArrow} onClick={(e) => setPDrop(!pDrop)} style={{ position: "absolute", top: '2.9rem', left: '8rem' }} className='border-2 border-solid rounded-lg p-1 bg-gray-200 cursor-pointer' alt=""/>
                                <div className={`z-10 bg-white ${pDrop ? "block" : "hidden"} absolute z-50 divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700`}>
                                    <div className="m-2 flex flex-row justify-around">
                                        <span className='cursor-pointer' onClick={() => { setMultiColor(false); }}>Single</span>
                                        <span className='cursor-pointer' onClick={() => { setMultiColor(true); }}>Multi</span>
                                    </div>
                                    <div className={`${multiColor ? "hidden" : "block"}`}>
                                        <div className="m-2">
                                            <span>Pulling</span>
                                            <input type="number" id="pnum1" className="block w-36 px-1 py-2 border-blue-500 border-2 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring" onChange={(e) => { setPNum1(doMaths(e)); updatePrinting(parseFloat(e.target.value), 'pNum1') }} value={pNum1} />
                                        </div>
                                        <div className="m-2">
                                            <span>Color</span>
                                            <input type="number" id="pnum2" className="block w-36  px-1 py-2 border-blue-500 border-2 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring" onChange={(e) => { setPNum2(doMaths(e)); updatePrinting(parseFloat(e.target.value), 'pNum2') }} value={pNum2} />
                                        </div>

                                        <div className="m-2">
                                            <span>Quantity</span>
                                            <input type="number" id="pnum3" className="block w-36  px-1 py-2 border-blue-500 border-2 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring" onChange={(e) => { setPNum3(doMaths(e)); updatePrinting(parseFloat(e.target.value), 'pNum3') }} value={pNum3} />
                                        </div>
                                    </div>

                                    <div className={`${!multiColor ? "hidden" : "block"}`}>
                                        <div className="m-2">
                                            <span>Rate1</span>
                                            <input type="number" id="pnum1" className="block w-36 px-1 py-2 border-blue-500 border-2 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring" onChange={(e) => { setPmNum1(doMaths(e)); updatePrinting(parseFloat(e.target.value), 'pmNum1') }} value={pmNum1} />
                                        </div>
                                        <div className="m-2">
                                            <span>Rate2</span>
                                            <input type="number" id="pnum2" className="block w-36  px-1 py-2 border-blue-500 border-2 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring" onChange={(e) => { setPmNum2(doMaths(e)); updatePrinting(parseFloat(e.target.value), 'pmNum2') }} value={pmNum2} />
                                        </div>

                                        <div className="m-2">
                                            <span>Quantity</span>
                                            <input type="number" id="pnum3" className="block w-36  px-1 py-2 border-blue-500 border-2 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring" onChange={(e) => { setPmNum3(doMaths(e)); updatePrinting(parseFloat(e.target.value), 'pmNum3') }} value={pmNum3} />
                                        </div>
                                    </div>

                                </div>
                            </div>
                            <div>
                                <label className="text-white text-lg dark:text-gray-200" for="ink">INK</label>
                                <input onChange={(e) => { setInk(doMaths(e)); changeValues(parseFloat(e.target.value), "ink") }} value={ink} id="ink" type="number" className="block text-xl  w-40 px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring" />
                            </div>
                            <div className='relative'>
                                <label className="text-white text-lg dark:text-gray-200" for="pasting">PASTING</label>
                                <input onChange={(e) => { setPasting(doMaths(e)); changeValues(parseFloat(e.target.value), "pasting") }} value={pasting} id="pasting" type="number" className="block text-xl  w-40 px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring" />
                                <img src={DropArrow} onClick={(e) => setPasteDrop(!pasteDrop)} style={{ position: "absolute", top: '2.9rem', left: '8rem' }} className='border-2 border-solid rounded-lg p-1 bg-gray-200 cursor-pointer' alt=""/>
                                <div className={`z-10 bg-white ${pasteDrop ? "block" : "hidden"} absolute z-50 divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700`}>

                                    <div className="m-2">
                                        <span>Rate</span>
                                        <input type="number" id="pasteNum1" className="block w-36 px-1 py-2 border-blue-500 border-2 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring" onChange={(e) => { setPasteNum1(doMaths(e)); updatePasting(parseFloat(e.target.value), 'pasteNum1') }} value={pasteNum1} />
                                    </div>
                                    <div className="m-2">
                                        <span>Quantity</span>
                                        <input type="number" id="pasteNum2" className="block w-36  px-1 py-2 border-blue-500 border-2 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring" onChange={(e) => { setPasteNum2(doMaths(e)); updatePasting(parseFloat(e.target.value), 'pasteNum2') }} value={pasteNum2} />
                                    </div>
                                </div>
                            </div>
                            <div className='relative'>
                                <label className="text-white text-lg dark:text-gray-200" for="punching">PUNCHING</label>
                                <input onChange={(e) => { setPunching(doMaths(e)); changeValues(parseFloat(e.target.value), "punching") }} value={punching} id="punching" type="number" className="block text-xl  w-40 px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring" />
                                <img src={DropArrow} onClick={(e) => setPunchDrop(!punchDrop)} style={{ position: "absolute", top: '2.9rem', left: '8rem' }} className='border-2 border-solid rounded-lg p-1 bg-gray-200 cursor-pointer' alt=""/>
                                <div className={`z-10 bg-white ${punchDrop ? "block" : "hidden"} absolute z-50 divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700`}>

                                    <div className="m-2">
                                        <span>Rate</span>
                                        <input type="number" id="punchNum1" className="block w-36 px-1 py-2 border-blue-500 border-2 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring" onChange={(e) => { setPunchNum1(doMaths(e)); updatePunching(parseFloat(e.target.value), 'punchNum1') }} value={punchNum1} />
                                    </div>
                                    <div className="m-2">
                                        <span>Quantity</span>
                                        <input type="number" id="punchNum2" className="block w-36  px-1 py-2 border-blue-500 border-2 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring" onChange={(e) => { setPunchNum2(doMaths(e)); updatePunching(parseFloat(e.target.value), 'punchNum2') }} value={punchNum2} />
                                    </div>
                                </div>
                            </div>
                            <div>
                                <label className="text-white text-lg dark:text-gray-200" for="total1">TOTAL</label>
                                <input value={total1} id="total1" type="number" className="block text-xl  w-40 px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring" />
                            </div>
                            <div>
                                <label className="text-white text-lg dark:text-gray-200" for="profit">PROFIT</label>
                                <input onChange={(e) => { setProfit(doMaths(e)); changeValues(parseFloat(e.target.value), "profit") }} value={profit} id="profit" type="number" className="block text-xl  w-40 px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring" />
                            </div>

                            <div>
                                <label className="text-white text-lg dark:text-gray-200" for="total2">TOTAL</label>
                                <input value={total2} id="total2" type="number" className="block text-xl  w-40 px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring" />
                            </div>
                            <div className='relative'>
                                <label className="text-white text-lg dark:text-gray-200" for="varnish">LAMINATION</label>
                                <input onChange={(e) => { setVarnish(doMaths(e)); changeValues(parseFloat(e.target.value), "varnish") }} value={varnish} id="varnish" type="number" className="block text-xl  w-40 px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring" />
                                <img src={DropArrow} onClick={(e) => setLamDrop(!lamDrop)} style={{ position: "absolute", top: '2.9rem', left: '8rem' }} className='border-2 border-solid rounded-lg p-1 bg-gray-200 cursor-pointer' alt=""/>
                                <div className={`z-10 bg-white ${lamDrop ? "block" : "hidden"} absolute z-50 divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700`}>

                                    <div className="m-2">
                                        <span>Size1</span>
                                        <input type="number" id="lamSize1" className="block w-36 px-1 py-2 border-blue-500 border-2 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring" onChange={(e) => { setLamSize1(doMaths(e)); updateLamnination(parseFloat(e.target.value), 'lamSize1') }} value={lamSize1} />
                                    </div>
                                    <div className="m-2">
                                        <span>Size2</span>
                                        <input type="number" id="lamSize2" className="block w-36  px-1 py-2 border-blue-500 border-2 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring" onChange={(e) => { setLamSize2(doMaths(e)); updateLamnination(parseFloat(e.target.value), 'lamSize2') }} value={lamSize2} />
                                    </div>

                                    <div className="m-2">
                                        <span>Rate</span>
                                        <input type="number" id="lamSize3" className="block w-36  px-1 py-2 border-blue-500 border-2 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring" onChange={(e) => { setLamNum(doMaths(e)); updateLamnination(parseFloat(e.target.value), 'lamNum') }} value={lamNum} />
                                    </div>
                                    <div className="m-2">
                                        <span>Quantity</span>
                                        <input type="number" id="lamSize4" className="block w-36  px-1 py-2 border-blue-500 border-2 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring" onChange={(e) => { setLamQty(doMaths(e)); updateLamnination(parseFloat(e.target.value), 'lamQty') }} value={lamQty} />
                                    </div>

                                </div>
                            </div>

                            <div>
                                <label className="text-white text-lg dark:text-gray-200" for="plate">PLATE</label>
                                <input onChange={(e) => { setPlate(doMaths(e)); changeValues(parseFloat(e.target.value), "plate") }} value={plate} id="plate" type="number" className="block text-xl  w-40 px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring" />
                            </div>
                            <div className='relative'>
                                <label className="text-white text-lg dark:text-gray-200" for="binding">BINDING</label>
                                <input onChange={(e) => { setBinding(doMaths(e)); changeValues(parseFloat(e.target.value), "binding") }} value={binding} id="binding" type="number" className="block text-xl  w-40 px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring" />
                                <img src={DropArrow} onClick={(e) => setBindDrop(!bindDrop)} style={{ position: "absolute", top: '2.9rem', left: '8rem' }} className='border-2 border-solid rounded-lg p-1 bg-gray-200 cursor-pointer' alt=""/>
                                <div className={`z-10 bg-white ${bindDrop ? "block" : "hidden"} absolute z-50 divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700`}>

                                    <div className="m-2">
                                        <span>Rate</span>
                                        <input type="number" id="bindNum1" className="block w-36 px-1 py-2 border-blue-500 border-2 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring" onChange={(e) => { setBindNum1(doMaths(e)); updateBinding(parseFloat(e.target.value), 'bindNum1') }} value={bindNum1} />
                                    </div>
                                    <div className="m-2">
                                        <span>Quantity</span>
                                        <input type="number" id="bindNum2" className="block w-36  px-1 py-2 border-blue-500 border-2 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring" onChange={(e) => { setBindNum2(doMaths(e)); updateBinding(parseFloat(e.target.value), 'bindNum2') }} value={bindNum2} />
                                    </div>
                                </div>
                            </div>


                        </div>
                    </section>
                    <section className='w-1/2 mx-4 p-6 mx-auto flex flex-cols justify-around rounded-md shadow-md dark:bg-gray-800 mt-2'>
                        <div>
                            <label className="text-white text-lg dark:text-gray-200" for="grand_total">GRAND TOTAL</label>
                            <input value={grand_total} id="grand_total" type="number" className="block text-2xl  w-44 px-2 py-2 mt-2 font-bold text-red-800 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring" />
                        </div>
                        <div>
                            <label className="text-white text-lg dark:text-gray-200" for="rate_per_piece">RATE(piece)</label>
                            <input value={rate_per_piece} id="rate_per_piece" type="number" className="block text-2xl  w-40 px-4 py-2 mt-2 font-bold text-red-800 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring" />
                        </div>
                    </section>

                    <div className="flex justify-center mt-6">
                        {
                            data &&
                            <div>
                                <button onClick={() => saveToJson()} className="px-6 py-2 mr-2 w-44 leading-5 text-white text-lg transition-colors duration-200 transform bg-pink-500 rounded-md hover:bg-pink-700 focus:outline-none ">Save</button>
                                <button onClick={() => updateToJson()} className="px-6 w-44 py-2 leading-5 text-white text-lg transition-colors duration-200 transform bg-pink-500 rounded-md hover:bg-pink-700 focus:outline-none ">Update</button>
                            </div>
                        }
                        {
                            !data &&
                            <div>
                                <button onClick={() => saveToJson()} className="px-6 py-2 mr-2 w-44 leading-5 text-white text-lg transition-colors duration-200 transform bg-pink-500 rounded-md hover:bg-pink-700 focus:outline-none ">Save</button>
                                <button onClick={() => clearData()} className="px-6 py-2 w-44 leading-5 text-white text-lg transition-colors duration-200 transform bg-pink-500 rounded-md hover:bg-pink-700 focus:outline-none ">Clear</button>

                            </div>
                        }
                    </div>
                    <div className={`absolute flex justify-center items-center z-50 ${gsmModal ? "block" : 'hidden'} p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] md:h-full`}>
                        <div class="relative w-8/12 bg-white rounded-lg shadow dark:bg-gray-700">
                            <div className="relative table_body w-full shadow-md sm:rounded-lg">
                                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                                    <thead className="text-lg  text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                        <tr>
                                            <th scope="col" className="px-2 py-3">
                                                <div className='flex'>
                                                    Size_L
                                                    <img src={AscendingIcon} onClick={() => { setPreGsm([...preGsm].sort((a, b) => a.size_l - b.size_l)) }} className='ml-4 cursor-pointer' alt=""/>
                                                    <img src={DescendingIcon} onClick={() => setPreGsm([...preGsm].sort((a, b) => b.size_l - a.size_l))} className='ml-2 cursor-pointer' alt=""/>
                                                </div>
                                            </th>
                                            <th scope="col" className="px-2 py-3 ">
                                                <div className='flex'>
                                                    Size_B
                                                    <img src={AscendingIcon} onClick={() => setPreGsm([...preGsm].sort((a, b) => a.size_b - b.size_b))} className='ml-4 cursor-pointer' alt=""/>
                                                    <img src={DescendingIcon} onClick={() => setPreGsm([...preGsm].sort((a, b) => b.size_b - a.size_b))} className='ml-2 cursor-pointer' alt=""/>
                                                </div>
                                            </th>
                                            <th scope="col" className="px-2 py-3 ">
                                                <div className='flex'>

                                                    GSM
                                                    <img src={AscendingIcon} onClick={() => setPreGsm([...preGsm].sort((a, b) => a.gsm - b.gsm))} className='ml-4 cursor-pointer' alt=""/>
                                                    <img src={DescendingIcon} onClick={() => setPreGsm([...preGsm].sort((a, b) => b.gsm - a.gsm))} className='ml-2 cursor-pointer' alt=""/>
                                                </div>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-inherit table_body max-h-2" >
                                        {!preGsm ? "" :
                                            preGsm.map(function (data, index) {
                                                return (
                                                    <tr key={data.srno} onClick={(e) => setPreData(data.srno)} className=" border-b border-opacity-5 bg-inherit  hover:bg-zinc-200 cursor-pointer">
                                                        <td className="text-lg text-black px-2 py-4 " >
                                                            {data.size_l}
                                                        </td>
                                                        <td className="text-lg text-black px-2 py-4" >
                                                            {data.size_b}
                                                        </td>
                                                        <td className="text-lg text-black px-2 py-4" >
                                                            {data.gsm}
                                                        </td>
                                                    </tr>

                                                )
                                            })
                                        }
                                    </tbody>
                                </table>

                            </div>
                            <div class="p-6 text-center">

                                <button onClick={(e) => setGsmModal(false)} type="button" class="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600">Cancel</button>
                            </div>
                        </div>
                    </div>


                </div>
            ) : (
                <Loading value='ADDING YOUR DATA...' />
            )
            }
        </div >
    )
}

export default Calculator;