import React from "react";
import "../Loader.css"; // Import the CSS file

const Loader = () => {
    return (
        <div className="container">
            <div className="loader">
                <div className="loader--dot first"></div>
                <div className="loader--dot second"></div>
                <div className="loader--dot third"></div>
                <div className="loader--dot fourth"></div>
                <div className="loader--dot fifth"></div>
                <div className="loader--dot sixth"></div>
                <div className="loader--text"></div>
            </div>
        </div>
    );
};

export default Loader;