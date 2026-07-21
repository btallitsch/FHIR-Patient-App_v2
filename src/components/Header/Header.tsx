import React from "react";

export const Header: React.FC = () => {

    return (
        <header className="bg-blue-800 text-white px-6 py-3.5 flex items-center justify-between shadow-md">
            <div>
            {/* <p className="text-xs text-blue-300 uppercase tracking-widest font-semibold">
                Fornax
            </p> */}
            <h1 className="text-lg font-bold mt-0.5">Fornax</h1>
            </div>
        </header>
    );
};