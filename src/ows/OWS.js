import React, { useState, useEffect, useContext } from "react";
import { UpdateContext } from "../context/UpdateContext";
import Loader from "../components/Loader";
import OWSContainer from "./OWSContainer";
import { filterWords, sortWords } from "../utils/utils";
import "../css/OWS.css";

const OWS = () => {
    const { wordUpdate } = useContext(UpdateContext);

    const [owsWords, setOwsWords] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const getOws = async () => {
        try {
            const url = `${process.env.REACT_APP_SERVER_URL}/ows`;
            const res = await fetch(url);
            const data = await res.json();
            if (res.status === 200) {
                const sortedWords = sortWords(data.words);
                setOwsWords(sortedWords);
                setLoading(false);
            } else {
                setError(true);
            }
        } catch (err) {
            setError(true);
        }
    };

    useEffect(() => {
        getOws();
    }, [wordUpdate]);

    if (loading) {
        return <Loader />;
    }

    if (error) {
        return <h1>Error</h1>;
    }

    const filteredWords = filterWords(owsWords, searchQuery);

    return (
        <>
            <div className="search-bar">
                <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="search-bar"
                />
            </div>
            <div className="main-container">
                <h2 className="main-container-heading">One Word Substitution</h2>
                <ul className="main-container-list">
                    {filteredWords.map((words) => (
                        <OWSContainer key={words._id} wordType="ows" words={words} />
                    ))}
                </ul>
            </div>
        </>
    );
};

export default OWS;
