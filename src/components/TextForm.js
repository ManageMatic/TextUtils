import React, { useState } from 'react'

export default function TextForm(props) {
    const handleUpClick = () => {
        //console.log("Uppercase was clicked" + text);
        let newText = text.toUpperCase();
        setText(newText);
        props.showAlert("Converted to UpperCase", "success")
    }

    const handleLwClick = () => {
        //console.log("Lowercase was clicked" + text);
        let newText = text.toLowerCase();
        setText(newText);
        props.showAlert("Converted to LowerCase", "success")
    }

    const handleClClick = () => {
        //console.log("Lowercase was clicked" + text);
        let newText = "";
        setText(newText);
        props.showAlert("Cleared", "success")
    }

    const handleCopy = () => {
        navigator.clipboard.writeText(text);
        props.showAlert("Copy to clipboard", "success")
    }

    const removeExtraSpaces = () => {
        let newText = text.split(/[ ]+/);
        setText(newText.join(" "))
        props.showAlert("Spaces are removed", "success")
    }

    const Speak = () => {
        if (window.speechSynthesis.speaking) {
            window.speechSynthesis.cancel();
            setIsSpeaking(false);
        } else {
            let newText = new SpeechSynthesisUtterance();
            newText.text = text;
            newText.onend = () => setIsSpeaking(false);
            window.speechSynthesis.speak(newText);
            setIsSpeaking(true);
        }
    }

    function capitalizeFirstLetter() {
        let newText = text.charAt(0).toUpperCase() + text.slice(1);
        newText = newText.replace(/(\.\s*)([a-z])/g, (match, p1, p2) => {
            return p1 + p2.toUpperCase();
        });
        setText(newText)
        props.showAlert("Capitalize first letter", "success")
    }

    const handleOnChange = (event) => {
        //console.log("On Change");
        setText(event.target.value);
    }

    const [text, setText] = useState('');

    const [isSpeaking, setIsSpeaking] = useState(false);

    //const wordCount = text.split(" ").length - 1;
    //const charCount = text.length;
    //const readTime = 0.008 * wordCount;
    return (
        <>
            <div className='container my-3' style={{ color: props.mode === 'dark' ? 'white' : 'black' }}>
                <div className="mb-3">
                    <h1 className='mb-2'>{props.heading}</h1>
                    <textarea className="form-control" value={text} style={{ backgroundColor: props.mode === 'dark' ? '#4c6578' : 'white', color: props.mode === 'dark' ? 'white' : 'black' }} onChange={handleOnChange} id="myBox" rows="8"></textarea>
                </div>
                <button disabled={text.length === 0} className="btn btn-primary mx-2 my-1" style={{ border: props.mode === 'dark' ? '#75b798' : '#f0880d', backgroundColor: props.mode === 'dark' ? '#75b798' : '#f0880d' }} onClick={handleUpClick}>Convert to Uppercase</button>
                <button disabled={text.length === 0} className="btn btn-primary mx-2 my-1" style={{ border: props.mode === 'dark' ? '#75b798' : '#f0880d', backgroundColor: props.mode === 'dark' ? '#75b798' : '#f0880d' }} onClick={handleClClick}>Clear Text</button>
                <button disabled={text.length === 0} className="btn btn-primary mx-2 my-1" style={{ border: props.mode === 'dark' ? '#75b798' : '#f0880d', backgroundColor: props.mode === 'dark' ? '#75b798' : '#f0880d' }} onClick={handleLwClick}>Convert to Lowercase</button>
                <button disabled={text.length === 0} className="btn btn-primary mx-2 my-1" style={{ border: props.mode === 'dark' ? '#75b798' : '#f0880d', backgroundColor: props.mode === 'dark' ? '#75b798' : '#f0880d' }} onClick={Speak}>Speak</button>
                <button disabled={text.length === 0} className="btn btn-primary mx-2 my-1" style={{ border: props.mode === 'dark' ? '#75b798' : '#f0880d', backgroundColor: props.mode === 'dark' ? '#75b798' : '#f0880d' }} onClick={handleCopy}>Copy Text</button>
                <button disabled={text.length === 0} className="btn btn-primary mx-2 my-1" style={{ border: props.mode === 'dark' ? '#75b798' : '#f0880d', backgroundColor: props.mode === 'dark' ? '#75b798' : '#f0880d' }} onClick={removeExtraSpaces}>Remove Extra Spaces</button>
                <button disabled={text.length === 0} className="btn btn-primary mx-2 my-1" style={{ border: props.mode === 'dark' ? '#75b798' : '#f0880d', backgroundColor: props.mode === 'dark' ? '#75b798' : '#f0880d' }} onClick={capitalizeFirstLetter}>Capitalize First Letter</button>

            </div>
            <div className="container my-3" style={{ color: props.mode === 'dark' ? 'white' : 'black' }}>
                <h2>Your text summary</h2>
                <p>{text.split(/\s+/).filter((element) => { return element.length !== 0 }).length} words and {text.length} characters</p>
                <p>{0.008 * text.split(" ").filter((element) => { return element.length !== 0 }).length} Minutes read</p>
                <h2>Preview</h2>
                <p>{text.length > 0 ? text : "Nothing to preview!"}</p>
            </div>
        </>
    )
}