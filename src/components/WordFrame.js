import React from "react";

export default function WordFrame({ word }) {
    // Function to capitalize the first letter of a word
    const capitalizeFirstLetter = (word) => {
        return word.charAt(0).toUpperCase() + word.slice(1);
    };

    return (
        <>
            <h3 className="MainScreen-word">{capitalizeFirstLetter(word.word)}</h3>
            {word.meanings.map((meaning) => (
                <div key={word._id} className="word-frame">
                    {meaning.definition && <p className="word-meaning">{meaning.definition}</p>}
                    {meaning.example && <p className="word-example">"{meaning.example}"</p>}
                    {meaning.synonyms?.length > 0 && (
                        <p>
                            <strong>Synonyms:</strong> {meaning.synonyms.join(", ")}
                        </p>
                    )}
                    {meaning.antonyms?.length > 0 && (
                        <p>
                            <strong>Antonyms:</strong> {meaning.antonyms.join(", ")}
                        </p>
                    )}
                </div>
            ))}
        </>
    );
}
