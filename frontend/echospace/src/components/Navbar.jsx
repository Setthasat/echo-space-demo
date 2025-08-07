import React from 'react';

function Navbar() {
    return (
        <nav className="w-full flex items-center justify-between px-4 sm:px-6 py-4 bg-white shadow-sm fixed top-0 z-50">
            <div className="font-bold text-md sm:text-xl flex items-center gap-2 mb-2 sm:mb-0">
                Echo Spaces <span role="img" aria-label="leaf">🪴</span>
            </div>
            <ul className="flex sm:flex-row gap-2 sm:gap-8 text-gray-700 text-sm">
                <li><a href="#" className="hover:text-green-600">หน้าหลัก</a></li>
                <li><a href="#" className="hover:text-green-600">สอบถาม</a></li>
                <li><a href="#" className="hover:text-green-600">เกี่ยวกับ</a></li>
            </ul>
        </nav>
    );
}

export default Navbar;
