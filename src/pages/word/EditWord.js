import React, { useState, useContext, useEffect } from "react";
import { UpdateContext } from "../../context/UpdateContext";

export default function EditWordDialog({ entry, onClose }) {
    const { setWordUpdate } = useContext(UpdateContext);
    const entryId = entry._id;
    const [updatedEntry, setUpdatedEntry] = useState({
        ...entry,
        meanings: entry.meanings.map((meaning) => ({
            ...meaning,
            definition: meaning.definition ? meaning.definition : "",
            synonyms: Array.isArray(meaning.synonyms)
                ? meaning.synonyms.join(", ")
                : meaning.synonyms,
            antonyms: Array.isArray(meaning.antonyms)
                ? meaning.antonyms.join(", ")
                : meaning.antonyms,
            example: meaning.example ? meaning.example : "",
        })),
    });
    const [error, setError] = useState("");

    const handleChange = (e, index) => {
        const { name, value } = e.target;
        if (name === "word") {
            setUpdatedEntry({
                ...updatedEntry,
                [name]: value,
            });
        } else {
            const newMeanings = updatedEntry.meanings.map((meaning, i) => {
                if (i === index) {
                    return { ...meaning, [name]: value };
                }
                return meaning;
            });
            setUpdatedEntry({
                ...updatedEntry,
                meanings: newMeanings,
            });
        }
    };

    const handleAddMeaning = () => {
        setUpdatedEntry({
            ...updatedEntry,
            meanings: [
                ...updatedEntry.meanings,
                {
                    definition: "",
                    synonyms: "",
                    antonyms: "",
                    example: "",
                },
            ],
        });
    };

    const handleDeleteMeaning = (index) => {
        setUpdatedEntry({
            ...updatedEntry,
            meanings: updatedEntry.meanings.filter((_, i) => i !== index),
        });
    };

    const handleSubmit = async (e) => {
        const { word, meanings } = updatedEntry;

        if (word === "") {
            setError("Word is required");
            return;
        }

        // Filter out empty meanings and validate
        const updatedMeanings = meanings.filter((meaning) => {
            const hasDefinition = meaning.definition.trim() !== "";
            const hasSynonyms = meaning.synonyms.trim() !== "";
            const hasAntonyms = meaning.antonyms.trim() !== "";
            const hasExample = meaning.example.trim() !== "";

            return hasDefinition || hasSynonyms || hasAntonyms || hasExample;
        });

        // Convert synonyms and antonyms strings to arrays
        const finalMeanings = updatedMeanings.map((meaning) => ({
            ...meaning,
            synonyms:
                meaning.synonyms.length > 0
                    ? meaning.synonyms.split(",").map((item) => item.trim().toLowerCase())
                    : [],
            antonyms:
                meaning.antonyms.length > 0
                    ? meaning.antonyms.split(",").map((item) => item.trim().toLowerCase())
                    : [],
        }));

        const url = `${process.env.REACT_APP_SERVER_URL}/word/${entryId}`;
        const res = await fetch(url, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ word, meanings: finalMeanings }),
        });
        const data = await res.json();
        if (res.status === 200) {
            onClose();
            setWordUpdate((prev) => !prev);
        } else {
            setError(data.error);
        }
    };

    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => {
                setError("");
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [error]);

    return (
        <div className="modal-content">
            <h3>
                <strong>Edit Word</strong>
            </h3>
            <div className="form-group">
                <div className="form-sub-group">
                    <div className="form-group-name">Word:</div>
                    <input
                        type="text"
                        name="word"
                        value={updatedEntry.word}
                        onChange={(e) => handleChange(e)}
                        required
                    />
                </div>
            </div>
            {updatedEntry.meanings.map((meaning, index) => (
                <div key={index} className={`part-group ${index === 0 ? "first-part-group" : ""}`}>
                    <div className="form-group">
                        <div className="form-sub-group">
                            <div className="form-group-name">Definition:</div>
                            <input
                                type="text"
                                name="definition"
                                value={meaning.definition}
                                onChange={(e) => handleChange(e, index)}
                            />
                        </div>
                    </div>
                    <div className="form-group">
                        <div className="form-sub-group">
                            <div className="form-group-name">Synonyms (comma-separated):</div>
                            <input
                                type="text"
                                name="synonyms"
                                value={meaning.synonyms}
                                onChange={(e) => handleChange(e, index)}
                            />
                        </div>
                    </div>
                    <div className="form-group">
                        <div className="form-sub-group">
                            <div className="form-group-name">Antonyms (comma-separated):</div>
                            <input
                                type="text"
                                name="antonyms"
                                value={meaning.antonyms}
                                onChange={(e) => handleChange(e, index)}
                            />
                        </div>
                    </div>
                    <div className="form-group">
                        <div className="form-sub-group">
                            Example:
                            <input
                                type="text"
                                name="example"
                                value={meaning.example}
                                onChange={(e) => handleChange(e, index)}
                            />
                        </div>
                    </div>
                    {index > 0 && (
                        <button
                            className="delete-part-button"
                            type="button"
                            onClick={() => handleDeleteMeaning(index)}
                        >
                            Delete
                        </button>
                    )}
                </div>
            ))}
            <div className="add-part">
                {error && <p className="error-message">*{error}</p>}
                <button className="add-part-button" type="button" onClick={handleAddMeaning}>
                    + Add Meaning
                </button>
            </div>
            <div className="modal-actions">
                <button type="button" className="submit-button" onClick={onClose}>
                    Cancel
                </button>
                <button type="submit" className="submit-button" onClick={handleSubmit}>
                    Save
                </button>
            </div>
        </div>
    );
}