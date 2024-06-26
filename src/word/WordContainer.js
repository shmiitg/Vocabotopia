import React, { useContext, useState } from "react";
import { Modal } from "react-responsive-modal";
import "react-responsive-modal/styles.css";
import EditWord from "./EditWord";
import DeleteWord from "../components/DeleteWord";
import WordDetailsModal from "./WordDetailsModal";
import { underlineWord } from "../utils/utils";
import { FaStar, FaRegStar } from "react-icons/fa";
import { AuthContext } from "../context/AuthContext";

const WordContainer = ({ word, allWords, forwardedRef }) => {
    const { user, addFavorite, removeFavorite, favorites } = useContext(AuthContext);
    const [open, setOpen] = useState(false);
    const [detailsOpen, setDetailsOpen] = useState(false);
    const [updateType, setUpdateType] = useState("edit");
    const [selectedWord, setSelectedWord] = useState(null);

    const capitalizeFirstLetter = (word) => {
        return word.charAt(0).toUpperCase() + word.slice(1);
    };

    const handleUpdate = (type) => {
        setOpen(true);
        setUpdateType(type);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleDetailsOpen = (word) => {
        setSelectedWord(word);
        setDetailsOpen(true);
    };

    const handleDetailsClose = () => {
        setDetailsOpen(false);
        setSelectedWord(null);
    };

    const isWordExisting = (word) => allWords.includes(word.toLowerCase());

    const isFavorite = favorites.has(String(word._id));

    const toggleFavorite = () => {
        if (isFavorite) {
            removeFavorite(word._id);
        } else {
            addFavorite(word._id);
        }
    };

    return (
        <div className="word-container-item" ref={forwardedRef}>
            <div className="word-container-top">
                <h3>{capitalizeFirstLetter(word.word)}</h3>
                <div className="update-icons">
                    {user && (
                        <button onClick={toggleFavorite}>
                            {isFavorite ? (
                                <FaStar className="star-icon" />
                            ) : (
                                <FaRegStar className="star-icon" />
                            )}
                        </button>
                    )}
                    <button onClick={() => handleUpdate("edit")}>Edit</button>
                    <button onClick={() => handleUpdate("delete")}>Delete</button>
                </div>
            </div>
            {word.meanings.map((meaning, index) => (
                <div key={index} className="word-container-bottom">
                    {meaning.definition && <p>{meaning.definition}</p>}
                    {meaning.example && <p>"{underlineWord(meaning.example, word.word)}"</p>}
                    {meaning.synonyms?.length > 0 && (
                        <p>
                            <strong>Synonyms:</strong>{" "}
                            {meaning.synonyms
                                .map((synonym) =>
                                    isWordExisting(synonym) ? (
                                        <span
                                            key={synonym}
                                            className="clickable-word"
                                            onClick={() => handleDetailsOpen(synonym)}
                                        >
                                            {synonym}
                                        </span>
                                    ) : (
                                        <span key={synonym}>{synonym}</span>
                                    )
                                )
                                .reduce((prev, curr) => [prev, ", ", curr])}
                        </p>
                    )}
                    {meaning.antonyms?.length > 0 && (
                        <p>
                            <strong>Antonyms:</strong>{" "}
                            {meaning.antonyms
                                .map((antonym) =>
                                    isWordExisting(antonym) ? (
                                        <span
                                            key={antonym}
                                            className="clickable-word"
                                            onClick={() => handleDetailsOpen(antonym)}
                                        >
                                            {antonym}
                                        </span>
                                    ) : (
                                        <span key={antonym}>{antonym}</span>
                                    )
                                )
                                .reduce((prev, curr) => [prev, ", ", curr])}
                        </p>
                    )}
                </div>
            ))}
            <Modal
                open={open}
                onClose={handleClose}
                showCloseIcon={false}
                closeOnOverlayClick={false}
                center
            >
                {updateType === "edit" ? (
                    <EditWord word={word} onClose={handleClose} />
                ) : (
                    <DeleteWord wordType="word" word={word} onClose={handleClose} />
                )}
            </Modal>
            {detailsOpen && <WordDetailsModal word={selectedWord} onClose={handleDetailsClose} />}
        </div>
    );
};

export default WordContainer;
