import React, { useEffect, useState } from 'react'
import { Link } from "react-router-dom";
import { Transition } from '@headlessui/react';
import { HiOutlineX, HiMenuAlt3 } from 'react-icons/hi'
import logo from "../assets/logo.png";
import { SketchPicker } from 'react-color'; // at the top



const Navbar = () => {
    const closeWindow = () => {
        window.close();
        // const win = window.require('electron').remote.getCurrentWindow();
        // win.close();
        // const remote = (window.require) ? window.require("electron").remote : null;
        // const WIN = remote.getCurrentWindow();
        // WIN.close();
    };
    const [isOpen, setIsOpen] = useState(false);
    const [navbarColor, setNavbarColor] = useState('#fde68a'); // default: tailwind bg-yellow-200
    const [showColorPicker, setShowColorPicker] = useState(false);

    useEffect(() => {
        const savedColor = localStorage.getItem('navbarColor');
        if (savedColor) setNavbarColor(savedColor);
    }, []);

    useEffect(() => {
        localStorage.setItem('navbarColor', navbarColor);
    }, [navbarColor]);

    return (
        <nav style={{ backgroundColor: navbarColor }} className="fixed shadow-md shadow-slate-600 w-screen text-black-100 backdrop-blur-lg z-50 py-3">
            <div className="flex items-center justify-between  px-10">
                <div className="flex space-x-10 align-center">
                    <Link to="/" className="flex gap-2 text-2xl font-bold  items-center sm:flex ">
                        <img className='w-16 mr-2' alt='logo' src={logo} />
                        <span>Smart Rate</span>
                    </Link>
                    <ul className="hidden  items-center md:flex text-lg tracking-widest ">
                        <li className='hover:invert-0.4'>
                            <Link className='mx-1 px-2 font-bold' to='/rate_calculator'>Rate Calculator</Link>
                        </li>
                        <li className='hover:invert-0.4'>
                            <Link className='mx-1 px-2 font-bold' to='/data_search'>Data Search</Link>
                            {/* style={({ isActive }) => ({ color: isActive ? 'cyan' : 'white' })} */}
                            {/* style={({ isActive }) => ({ color: isActive ? 'cyan' : 'white' })} */}
                        </li>
                        <li className='hover:invert-0.4'>
                            <Link className='mx-1 px-2 font-bold' to='/box_rate'>BoxRate</Link>
                            {/* style={({ isActive }) => ({ color: isActive ? 'cyan' : 'white' })} */}
                            {/* style={({ isActive }) => ({ color: isActive ? 'cyan' : 'white' })} */}
                        </li>
                        <li className='hover:invert-0.4'>
                            <Link className='mx-1 px-2 font-bold' to='/box_search'>BoxSearch</Link>
                            {/* style={({ isActive }) => ({ color: isActive ? 'cyan' : 'white' })} */}
                            {/* style={({ isActive }) => ({ color: isActive ? 'cyan' : 'white' })} */}
                        </li>
                        <li className='hover:invert-0.4'>
                            <Link className='mx-1 px-2 font-bold' to='/box_universal'>BoxUniversal</Link>
                            {/* style={({ isActive }) => ({ color: isActive ? 'cyan' : 'white' })} */}
                            {/* style={({ isActive }) => ({ color: isActive ? 'cyan' : 'white' })} */}
                        </li>
                        <li className='hover:invert-0.4'>
                            <Link className='mx-1 px-2 font-bold' to='/box_universal_search'>BoxUniversalSearch</Link>
                            {/* style={({ isActive }) => ({ color: isActive ? 'cyan' : 'white' })} */}
                            {/* style={({ isActive }) => ({ color: isActive ? 'cyan' : 'white' })} */}
                        </li>

                    </ul>



                </div>

                <div className=" flex items-center" onClick={() => setIsOpen(!isOpen)}>
                    <button className="outline-none p-2  md:hidden mobile-menu-button bg-slate-500/30 rounded-full border-1 border-gray-500 select-none focus:bg-slate-800">
                        {isOpen ? <HiOutlineX className='text-2xl text-gray-200' /> :
                            <HiMenuAlt3 className='text-2xl text-gray-200' />
                        }
                    </button>
                    <div className="relative z-50">
                        <button
                            onClick={() => setShowColorPicker(!showColorPicker)}
                            className="rounded-full p-2 mx-1 bg-white shadow hover:bg-gray-100 border border-gray-300"
                            title="Pick Navbar Color"
                        >
                            🎨
                        </button>
                        {showColorPicker && (
                            <div className="absolute right-0 top-full mt-2 shadow-lg">
                                <SketchPicker
                                    color={navbarColor}
                                    onChangeComplete={(color) => setNavbarColor(color.hex)}
                                />
                            </div>
                        )}
                    </div>


                    {/* onClick={()=>closeWindow()} */}
                    <button type="button" onClick={() => closeWindow()} className=" rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
                        <span className="sr-only">Close menu</span>
                        <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>



            </div>
            {/* Menu  Mobile*/}
            <Transition show={isOpen}
                enter="transition ease-out duration-100 transform"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="transition ease-in duration-75 transform"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
            >
                {
                    (ref) => (
                        <div className="md:hidden " id="mobile-menu">
                            <div
                                ref={ref}
                                className="dark:bg-transparent dark:text-white mx-4 pt-4 pb-4 space-y-1"
                            >
                                <Link
                                    to="/"
                                    className="cursor-pointer hover:bg-blue-900/30 text-black dark:text-gray-200 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                                >
                                    Calculator
                                </Link>

                                <Link
                                    to="/data_seacrh"
                                    className="cursor-pointer hover:bg-blue-900/30 text-black dark:text-gray-200 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                                >
                                    DataSearch
                                </Link>
                            </div>
                        </div>
                    )
                }
            </Transition>

        </nav >
    )
}

export default Navbar