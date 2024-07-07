import React, { useContext, useState } from "react";
import { Modal } from "react-responsive-modal";
import "react-responsive-modal/styles.css";
import EditWord from "./EditWord";
import DeleteEntry from "../../components/DeleteEntry";
import WordDetailsModal from "./WordDetailsModal";
import { underlineWord, checkExistingWord } from "../../utils/utils";
import { FaStar, FaRegStar } from "react-icons/fa";
import { AuthContext } from "../../context/AuthContext";

const WordContainer = ({ entry, allWords }) => {
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

    const favObj = { itemType: "word", itemId: String(entry._id) };
    const isFavorite = favorites.has(favObj);

    const toggleFavorite = () => {
        if (isFavorite) {
            removeFavorite("word", entry._id);
        } else {
            addFavorite("word", entry._id);
        }
    };

    return (
        <div className="word-container-item">
            <div className="word-container-top">
                <h3>{capitalizeFirstLetter(entry.word)}</h3>
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
            {entry.meanings.map((meaning, index) => (
                <div key={index} className="word-container-bottom">
                    {meaning.definition && <p>{meaning.definition}</p>}
                    {meaning.example && <p>"{underlineWord(meaning.example, entry.word)}"</p>}
                    {meaning.synonyms?.length > 0 && (
                        <p>
                            <strong>Synonyms:</strong>{" "}
                            {meaning.synonyms
                                .map((synonym) =>
                                    checkExistingWord(synonym, allWords) ? (
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
                                    checkExistingWord(antonym, allWords) ? (
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
                    <EditWord entry={entry} onClose={handleClose} />
                ) : (
                    <DeleteEntry entryType="word" entry={entry} onClose={handleClose} />
                )}
            </Modal>
            {detailsOpen && <WordDetailsModal word={selectedWord} onClose={handleDetailsClose} />}
        </div>
    );
};

export default WordContainer;