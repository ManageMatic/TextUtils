import React, { useState, useEffect, useRef } from 'react';

export default function TextForm(props) {
  const [text, setText] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState('');
  const [pitch, setPitch] = useState(1);
  const [speed, setSpeed] = useState(1);
  
  // Voice Recognition (Dictation) State
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);

  // Search & Replace State
  const [findText, setFindText] = useState('');
  const [replaceText, setReplaceText] = useState('');
  const [showSearchReplace, setShowSearchReplace] = useState(false);

  // Snippet History State
  const [history, setHistory] = useState([]);

  // Load voices for Speech Synthesis
  useEffect(() => {
    const loadVoices = () => {
      const systemVoices = window.speechSynthesis.getVoices();
      setVoices(systemVoices);
      if (systemVoices.length > 0 && !selectedVoice) {
        // default to first english voice or default voice
        const englishVoice = systemVoices.find(v => v.lang.includes('en')) || systemVoices[0];
        setSelectedVoice(englishVoice.name);
      }
    };
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }, [selectedVoice]);

  // Load History from LocalStorage on mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('textcraft_history');
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, []);

  // Save current text snippet in local history
  const saveToHistory = (txtToSave) => {
    if (!txtToSave || txtToSave.trim() === '') return;
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const date = new Date().toLocaleDateString();
    const newEntry = {
      id: Date.now(),
      text: txtToSave,
      time: `${date} ${timestamp}`,
      charCount: txtToSave.length
    };
    const updated = [newEntry, ...history.slice(0, 9)]; // limit to 10 entries
    setHistory(updated);
    localStorage.setItem('textcraft_history', JSON.stringify(updated));
  };

  const handleOnChange = (event) => {
    setText(event.target.value);
  };

  // 1. Text conversions
  const handleUpClick = () => {
    let newText = text.toUpperCase();
    setText(newText);
    props.showAlert("Converted to UPPERCASE", "success");
  };

  const handleLwClick = () => {
    let newText = text.toLowerCase();
    setText(newText);
    props.showAlert("Converted to lowercase", "success");
  };

  const handleTitleCase = () => {
    let newText = text.toLowerCase().split(' ').map(word => {
      return word.charAt(0).toUpperCase() + word.slice(1);
    }).join(' ');
    setText(newText);
    props.showAlert("Converted to Title Case", "success");
  };

  const handleSentenceCase = () => {
    let newText = text.toLowerCase().replace(/(^\s*|[.!?]\s+)([a-z])/g, (match, p1, p2) => {
      return p1 + p2.toUpperCase();
    });
    setText(newText);
    props.showAlert("Converted to Sentence case", "success");
  };

  const handleSlugify = () => {
    let newText = text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '') // remove non-word characters
      .replace(/[\s_]+/g, '-')  // replace spaces/underscores with hyphens
      .replace(/-+/g, '-');     // replace duplicate hyphens
    setText(newText);
    props.showAlert("Slugified text (URL safe)", "success");
  };

  const handleBase64Encode = () => {
    try {
      let encoded = btoa(unescape(encodeURIComponent(text)));
      setText(encoded);
      props.showAlert("Encoded to Base64", "success");
    } catch (e) {
      props.showAlert("Failed to encode to Base64: Invalid characters", "danger");
    }
  };

  const handleBase64Decode = () => {
    try {
      let decoded = decodeURIComponent(escape(atob(text)));
      setText(decoded);
      props.showAlert("Decoded from Base64", "success");
    } catch (e) {
      props.showAlert("Failed to decode: Invalid Base64 string", "danger");
    }
  };

  const handleURLEncode = () => {
    setText(encodeURIComponent(text));
    props.showAlert("Encoded URL characters", "success");
  };

  const handleURLDecode = () => {
    try {
      setText(decodeURIComponent(text));
      props.showAlert("Decoded URL string", "success");
    } catch (e) {
      props.showAlert("Failed to decode URL string", "danger");
    }
  };

  const removeExtraSpaces = () => {
    let newText = text.split(/[ ]+/);
    setText(newText.join(" "));
    props.showAlert("Extra spacing removed", "success");
  };

  const handleClClick = () => {
    if (text) {
      saveToHistory(text); // save draft automatically on clear so it is not lost
    }
    setText("");
    props.showAlert("Workspace Cleared", "success");
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    props.showAlert("Copied text to Clipboard!", "success");
  };

  const handleSaveDraft = () => {
    saveToHistory(text);
    props.showAlert("Draft saved in recent logs", "success");
  };

  const loadHistoryItem = (itemText) => {
    setText(itemText);
    props.showAlert("Restored snippet from logs", "success");
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('textcraft_history');
    props.showAlert("Draft history cleared", "success");
  };

  // 2. Text-to-Speech (Speak)
  const Speak = () => {
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      if (!text) {
        props.showAlert("Please add some text to read aloud", "danger");
        return;
      }
      let utterance = new SpeechSynthesisUtterance(text);
      
      // Configure voice parameters
      if (selectedVoice) {
        const activeVoice = voices.find(v => v.name === selectedVoice);
        if (activeVoice) utterance.voice = activeVoice;
      }
      utterance.pitch = pitch;
      utterance.rate = speed;
      
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      
      window.speechSynthesis.speak(utterance);
      setIsSpeaking(true);
    }
  };

  // 3. Speech-to-Text (Voice Recognition)
  const toggleListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      props.showAlert("Web Speech Recognition is not supported by your browser.", "danger");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
        props.showAlert("Microphone active. Speak now...", "success");
      };

      recognition.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0])
          .map(result => result.transcript)
          .join('');
        
        setText(prev => prev + (prev.length > 0 ? ' ' : '') + transcript);
      };

      recognition.onerror = (e) => {
        console.error(e);
        setIsListening(false);
        props.showAlert("Voice recognition encountered an error.", "danger");
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    }
  };

  // 4. Find & Replace
  const handleFindReplace = () => {
    if (!findText) {
      props.showAlert("Please input target search value", "danger");
      return;
    }
    const escapedSearch = findText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // escape regex
    const regex = new RegExp(escapedSearch, 'g');
    if (!text.match(regex)) {
      props.showAlert("Search key not found in text", "danger");
      return;
    }
    const replaced = text.replace(regex, replaceText);
    setText(replaced);
    props.showAlert(`Replaced all occurrences of "${findText}"`, "success");
  };

  // 5. Exporters
  const downloadTxtFile = () => {
    if (!text) {
      props.showAlert("No content to download", "danger");
      return;
    }
    const element = document.createElement("a");
    const file = new Blob([text], { type: 'text/plain;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = "textcraft_export.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    props.showAlert("Downloaded text document successfully", "success");
  };

  const handlePrint = () => {
    if (!text) {
      props.showAlert("No content to print", "danger");
      return;
    }
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>TextCraft Print Export</title>
          <style>
            body { font-family: sans-serif; padding: 40px; color: #333; line-height: 1.6; }
            h1 { border-bottom: 2px solid #6366f1; padding-bottom: 10px; color: #6366f1; }
            .content { white-space: pre-wrap; font-size: 16px; margin-top: 20px; }
          </style>
        </head>
        <body>
          <h1>TextCraft Document</h1>
          <div class="content">${text}</div>
          <script>window.print();</script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  // Syllables Estimator for Readability
  const countSyllables = (word) => {
    word = word.toLowerCase().trim();
    if (word.length <= 3) return 1;
    word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '');
    word = word.replace(/^y/, '');
    const vowels = word.match(/[aeiouy]{1,2}/g);
    return vowels ? vowels.length : 1;
  };

  // Readability diagnostics parser
  const getReadabilityMetrics = () => {
    const rawText = text.trim();
    if (!rawText) return { score: 100, label: "Empty Document" };

    const words = rawText.match(/\b[a-zA-Z']+\b/g) || [];
    const sentences = rawText.split(/[.!?]+\s*/).filter(s => s.trim().length > 0) || [];
    
    let totalSyllables = 0;
    words.forEach(w => {
      totalSyllables += countSyllables(w);
    });

    const wCount = words.length || 1;
    const sCount = sentences.length || 1;

    // Flesch Reading Ease Formula
    let score = 206.835 - 1.015 * (wCount / sCount) - 84.6 * (totalSyllables / wCount);
    score = Math.max(0, Math.min(100, Math.round(score)));

    let label = "";
    if (score >= 90) label = "Very Easy (5th Grade)";
    else if (score >= 80) label = "Easy (6th Grade)";
    else if (score >= 70) label = "Fairly Easy (7th Grade)";
    else if (score >= 60) label = "Standard (8th-9th Grade)";
    else if (score >= 50) label = "Fairly Difficult (High School)";
    else if (score >= 30) label = "Difficult (College)";
    else label = "Very Confusing (Graduate level)";

    return { score, label };
  };

  // Live Word Density Analyzer
  const getKeywordDensity = () => {
    const rawText = text.trim();
    if (!rawText) return [];

    const stopWords = ['the', 'a', 'an', 'and', 'to', 'in', 'is', 'of', 'it', 'that', 'for', 'on', 'with', 'as', 'this', 'at', 'by', 'from', 'but', 'are', 'was', 'were', 'or', 'be', 'he', 'she', 'they', 'you', 'i', 'we'];
    const words = rawText.toLowerCase().match(/\b[a-zA-Z']+\b/g) || [];
    
    const freq = {};
    words.forEach(w => {
      if (w.length > 2 && !stopWords.includes(w)) {
        freq[w] = (freq[w] || 0) + 1;
      }
    });

    return Object.keys(freq)
      .map(key => ({ word: key, count: freq[key] }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  };

  // Calculations
  const wordCount = text.split(/\s+/).filter(el => el.length !== 0).length;
  const charCount = text.length;
  const charNoSpaces = text.replace(/\s/g, '').length;
  const lineCount = text.split('\n').filter(el => el.trim().length !== 0).length;
  const paragraphCount = text.split(/\n\s*\n/).filter(el => el.trim().length !== 0).length;
  const readTime = (0.008 * wordCount).toFixed(2);
  const speakTime = (0.006 * wordCount).toFixed(2);

  const readability = getReadabilityMetrics();
  const keywordDensity = getKeywordDensity();

  return (
    <div className="main-grid">
      {/* LEFT PANEL - Workspace Area */}
      <div className="d-flex flex-column gap-3">
        <div className="glass-card">
          <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
            <h1 className="h3 mb-0" style={{ color: 'var(--text-primary)' }}>{props.heading}</h1>
            <div className="d-flex align-items-center gap-2">
              {/* Dictation Mode Trigger */}
              <button 
                onClick={toggleListening}
                className={`btn-premium-secondary ${isListening ? 'border-danger' : ''}`}
                style={{ padding: '8px 12px', borderRadius: '10px' }}
                title={isListening ? "Stop Voice Typing" : "Start Voice Typing (Speech to Text)"}
              >
                {isListening ? (
                  <div className="d-flex align-items-center gap-2">
                    <span className="mic-wave-container">
                      <span className="mic-wave-bar"></span>
                      <span className="mic-wave-bar"></span>
                      <span className="mic-wave-bar"></span>
                    </span>
                    <span style={{ fontSize: '0.85rem', color: 'red', fontWeight: 'bold' }}>Recording...</span>
                  </div>
                ) : (
                  <div className="d-flex align-items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-mic-fill text-danger" viewBox="0 0 16 16">
                      <path d="M5 3a3 3 0 0 1 6 0v5a3 3 0 0 1-6 0z"/>
                      <path d="M3.5 6.5A.5.5 0 0 1 4 7v1a4 4 0 0 0 8 0V7a.5.5 0 0 1 1 0v1a5 5 0 0 1-4.5 4.975V15h3a.5.5 0 0 1 0 1h-7a.5.5 0 0 1 0-1h3v-2.025A5 5 0 0 1 3 8V7a.5.5 0 0 1 .5-.5"/>
                    </svg>
                    <span style={{ fontSize: '0.85rem' }}>Dictation</span>
                  </div>
                )}
              </button>
            </div>
          </div>

          <div className="position-relative mb-2">
            <textarea 
              className="form-control form-control-premium w-100" 
              value={text} 
              onChange={handleOnChange} 
              id="myBox" 
              placeholder="Paste or type your writing here to analyze, transform casing, check keyword weight, and run readability diagnostics..."
              rows="12"
              style={{ resize: 'vertical' }}
            ></textarea>
            {text.length > 0 && (
              <button 
                onClick={handleClClick}
                className="btn-premium-secondary position-absolute"
                style={{ right: '12px', bottom: '12px', padding: '4px 8px', fontSize: '0.8rem', borderRadius: '6px', background: 'rgba(0,0,0,0.05)' }}
                title="Clear content"
              >
                Clear
              </button>
            )}
          </div>

          {/* Quick Counter row at bottom of text box */}
          <div className="d-flex justify-content-between flex-wrap gap-1 px-1" style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            <span><strong>{wordCount}</strong> words &middot; <strong>{charCount}</strong> characters (<strong>{charNoSpaces}</strong> with no spaces)</span>
            <span><strong>{lineCount}</strong> lines &middot; <strong>{paragraphCount}</strong> paragraphs</span>
          </div>

          {/* Expandable Find & Replace console */}
          <div className="mt-3">
            <button 
              className="btn-premium-secondary w-100 justify-content-between"
              onClick={() => setShowSearchReplace(!showSearchReplace)}
              style={{ borderRadius: '12px' }}
            >
              <span>Search & Replace Drawer</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className={`bi bi-chevron-down ms-2 transition-all ${showSearchReplace ? 'rotate-180' : ''}`} viewBox="0 0 16 16" style={{ transform: showSearchReplace ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
                <path fillRule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708"/>
              </svg>
            </button>
            
            {showSearchReplace && (
              <div className="card mt-2 p-3 border-0" style={{ borderRadius: '12px', backgroundColor: 'var(--accent-light)', border: '1px solid var(--border-color)' }}>
                <div className="row g-2">
                  <div className="col-md-5">
                    <input 
                      type="text" 
                      className="form-control form-control-premium w-100" 
                      placeholder="Find term..." 
                      value={findText}
                      onChange={(e) => setFindText(e.target.value)}
                    />
                  </div>
                  <div className="col-md-5">
                    <input 
                      type="text" 
                      className="form-control form-control-premium w-100" 
                      placeholder="Replace with..." 
                      value={replaceText}
                      onChange={(e) => setReplaceText(e.target.value)}
                    />
                  </div>
                  <div className="col-md-2 d-grid">
                    <button 
                      className="btn-premium w-100" 
                      onClick={handleFindReplace}
                    >
                      Replace
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* TOOL GRID - Operations panel */}
        <div className="glass-card">
          <h2 className="h5 mb-3" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>Text Transformation Utilities</h2>
          <div className="tool-grid">
            <button disabled={text.length === 0} className="btn-premium" onClick={handleUpClick}>UPPERCASE</button>
            <button disabled={text.length === 0} className="btn-premium" onClick={handleLwClick}>lowercase</button>
            <button disabled={text.length === 0} className="btn-premium" onClick={handleTitleCase}>Title Case</button>
            <button disabled={text.length === 0} className="btn-premium" onClick={handleSentenceCase}>Sentence Case</button>
            <button disabled={text.length === 0} className="btn-premium" onClick={handleSlugify}>Slugify URL</button>
            <button disabled={text.length === 0} className="btn-premium" onClick={removeExtraSpaces}>Clean Spacing</button>
            <button disabled={text.length === 0} className="btn-premium" onClick={handleCopy}>Copy Text</button>
            <button disabled={text.length === 0} className="btn-premium-secondary" onClick={handleSaveDraft}>Save Draft</button>
          </div>

          <h2 className="h6 mb-2 mt-4" style={{ color: 'var(--text-secondary)' }}>Coding Encoders / Decoders</h2>
          <div className="d-flex flex-wrap gap-2">
            <button disabled={text.length === 0} className="btn-premium-secondary" onClick={handleBase64Encode}>Base64 Encode</button>
            <button disabled={text.length === 0} className="btn-premium-secondary" onClick={handleBase64Decode}>Base64 Decode</button>
            <button disabled={text.length === 0} className="btn-premium-secondary" onClick={handleURLEncode}>URL Encode</button>
            <button disabled={text.length === 0} className="btn-premium-secondary" onClick={handleURLDecode}>URL Decode</button>
          </div>

          <h2 className="h6 mb-2 mt-4" style={{ color: 'var(--text-secondary)' }}>Document Exports</h2>
          <div className="d-flex flex-wrap gap-2">
            <button disabled={text.length === 0} className="btn-premium-secondary" onClick={downloadTxtFile}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-download me-1" viewBox="0 0 16 16">
                <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5"/>
                <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708z"/>
              </svg>
              Download Text (.txt)
            </button>
            <button disabled={text.length === 0} className="btn-premium-secondary" onClick={handlePrint}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-printer me-1" viewBox="0 0 16 16">
                <path d="M2.5 8a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1"/>
                <path d="M5 1a2 2 0 0 0-2 2v2H2a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h1v1a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-1h1a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-1V3a2 2 0 0 0-2-2zM4 3a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2H4zm1 5a2 2 0 0 0-2 2v1H2a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v-1a2 2 0 0 0-2-2zm7 2v3a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1"/>
              </svg>
              Print / Save PDF
            </button>
          </div>
        </div>

        {/* WORKSPACE PREVIEW */}
        <div className="glass-card">
          <h2 className="h5 mb-3" style={{ color: 'var(--text-primary)' }}>Live Workspace Preview</h2>
          <div 
            className="p-3 border rounded" 
            style={{ 
              minHeight: '100px', 
              maxHeight: '300px', 
              overflowY: 'auto', 
              whiteSpace: 'pre-wrap', 
              borderColor: 'var(--border-color)', 
              fontSize: '0.95rem',
              backgroundColor: 'var(--bg-secondary)',
              color: 'var(--text-primary)'
            }}
          >
            {text.length > 0 ? text : "Start writing in the text area above to preview the formatting in real-time..."}
          </div>
        </div>
      </div>

      {/* RIGHT PANEL - Live Analytics & Configurations */}
      <div className="d-flex flex-column gap-3">
        {/* 1. Speech Center Controls */}
        <div className="glass-card">
          <h2 className="h5 mb-3 d-flex align-items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="var(--accent-primary)" className="bi bi-volume-up-fill" viewBox="0 0 16 16">
              <path d="M11.536 14.01A8.47 8.47 0 0 0 14 8c0-2.29-.912-4.474-2.536-6.01a.5.5 0 0 0-.687.73A7.48 7.48 0 0 1 13 8a7.48 7.48 0 0 1-2.15 5.28a.5.5 0 0 0 .686.73M9.794 11.358A5.7 5.7 0 0 0 11 8c0-1.62-.646-3.164-1.794-4.254a.5.5 0 0 0-.68.736A4.7 4.7 0 0 1 10 8a4.7 4.7 0 0 1-1.686 3.622a.5.5 0 0 0 .68.736M5.5 5.5A.5.5 0 0 1 6 6v4a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5"/>
              <path d="M7 4a.5.5 0 0 0-.812-.39L3.825 5.5H1.5A.5.5 0 0 0 1 6v4a.5.5 0 0 0 .5.5h2.325l2.363 1.89A.5.5 0 0 0 7 12zM1.863.099a.145.145 0 0 1 .274 0l.258.774c.115.346.386.617.732.732l.774.258a.145.145 0 0 1 0 .274l-.774.258a1.16 1.16 0 0 0-.732.732l-.258.774a.145.145 0 0 1-.274 0l-.258-.774a1.16 1.16 0 0 0-.732-.732l-.774-.258a.145.145 0 0 1 0-.274l.774-.258c.346-.115.617-.386.732-.732z"/>
            </svg>
            Speech Synthesis Control
          </h2>
          <div className="mb-3">
            <label className="form-label" style={{ fontSize: '0.85rem' }}>Select active Voice</label>
            <select 
              className="form-select form-control-premium w-100" 
              value={selectedVoice}
              onChange={(e) => setSelectedVoice(e.target.value)}
              style={{ fontSize: '0.9rem' }}
            >
              {voices.map(voice => (
                <option key={voice.name} value={voice.name}>
                  {voice.name} ({voice.lang})
                </option>
              ))}
            </select>
          </div>
          
          <div className="row g-2 mb-3">
            <div className="col-6">
              <label className="form-label" style={{ fontSize: '0.85rem' }}>Speed / Rate ({speed}x)</label>
              <input 
                type="range" 
                className="w-100 accent-primary" 
                min="0.5" 
                max="2" 
                step="0.1" 
                value={speed}
                onChange={(e) => setSpeed(parseFloat(e.target.value))}
              />
            </div>
            <div className="col-6">
              <label className="form-label" style={{ fontSize: '0.85rem' }}>Pitch ({pitch})</label>
              <input 
                type="range" 
                className="w-100 accent-primary" 
                min="0.5" 
                max="1.5" 
                step="0.1" 
                value={pitch}
                onChange={(e) => setPitch(parseFloat(e.target.value))}
              />
            </div>
          </div>

          <button 
            disabled={text.length === 0} 
            className={`btn-premium w-100 ${isSpeaking ? 'bg-danger shadow-sm' : ''}`}
            onClick={Speak}
            style={{ 
              background: isSpeaking ? 'var(--text-secondary)' : 'var(--accent-gradient)'
            }}
          >
            {isSpeaking ? (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-stop-fill" viewBox="0 0 16 16">
                  <path d="M5 3.5h6A1.5 1.5 0 0 1 12.5 5v6a1.5 1.5 0 0 1-1.5 1.5H5A1.5 1.5 0 0 1 3.5 11V5A1.5 1.5 0 0 1 5 3.5"/>
                </svg>
                Cancel / Mute Reader
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-play-fill" viewBox="0 0 16 16">
                  <path d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393"/>
                </svg>
                Read Text Out Loud
              </>
            )}
          </button>
        </div>

        {/* 2. Readability Diagnostics */}
        <div className="glass-card">
          <h2 className="h5 mb-3 d-flex align-items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="var(--accent-primary)" className="bi bi-activity" viewBox="0 0 16 16">
              <path fillRule="evenodd" d="M6 2a.5.5 0 0 1 .47.33L10 12.036l1.53-4.22a.5.5 0 0 1 .94.03l.9 3a.5.5 0 0 1-.985.296l-.548-1.825-1.99 5.485a.5.5 0 0 1-.952-.008L5.41 3.44l-1.24 3.72a.5.5 0 0 1-.948.068L1.13 4.87a.5.5 0 0 1 .94-.34l1.11 3.053 1.35-4.05A.5.5 0 0 1 6 2"/>
            </svg>
            Readability Diagnostics
          </h2>
          
          <div className="text-center p-3 rounded mb-3" style={{ backgroundColor: 'var(--accent-light)', border: '1px solid var(--border-color)' }}>
            <div className="fs-1 fw-extrabold text-primary" style={{ color: 'var(--accent-primary)', fontWeight: '800' }}>
              {readability.score}
            </div>
            <div className="fw-semibold mt-1" style={{ fontSize: '0.95rem', color: 'var(--text-primary)' }}>{readability.label}</div>
            <div className="text-muted mt-1" style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Flesch Reading Ease index</div>
          </div>

          <div className="metric-row">
            <span>Estimated Reading</span>
            <span className="metric-value">{readTime} min</span>
          </div>
          <div className="metric-row">
            <span>Estimated Speaking</span>
            <span className="metric-value">{speakTime} min</span>
          </div>
        </div>

        {/* 3. Keyword Weights */}
        <div className="glass-card">
          <h2 className="h5 mb-3 d-flex align-items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="var(--accent-primary)" className="bi bi-bar-chart-fill" viewBox="0 0 16 16">
              <path d="M1 11a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1zm5-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1zm5-5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1z"/>
            </svg>
            Keyword Density Weight
          </h2>
          {keywordDensity.length > 0 ? (
            <div className="d-flex flex-column gap-2">
              {keywordDensity.map((item, idx) => {
                // calculate simple visual weight
                const maxCount = keywordDensity[0].count;
                const percentage = Math.round((item.count / maxCount) * 100);
                return (
                  <div key={item.word}>
                    <div className="d-flex justify-content-between mb-1" style={{ fontSize: '0.85rem' }}>
                      <span className="font-semibold">{idx+1}. <strong style={{ color: 'var(--text-primary)' }}>{item.word}</strong></span>
                      <span style={{ color: 'var(--text-muted)' }}>{item.count} occurrences</span>
                    </div>
                    <div className="progress-premium">
                      <div className="progress-bar-premium" style={{ width: `${percentage}%` }}></div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-3" style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Add text content to calculate keyword weights.
            </div>
          )}
        </div>

        {/* 4. Session History & Drafts Logger */}
        <div className="glass-card">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h2 className="h5 mb-0 d-flex align-items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="var(--accent-primary)" className="bi bi-clock-history" viewBox="0 0 16 16">
                <path d="M8.515 1.019A7 7 0 0 0 8 1V0a8 8 0 0 1 .589.022zm2.004.45a7 7 0 0 0-.985-.299l.219-.976c.383.086.76.2 1.126.342zm1.37.71a7 7 0 0 0-.439-.265l.493-.87a8 8 0 0 1 .987.587l-.548.836zm.987.587-.548.836a7 7 0 0 0-.439-.265l.493-.87a8 8 0 0 1 .987.587zm.622.846-.777.633a7 7 0 0 0-.265-.439l.87-.493a8 8 0 0 1 .587.987zm.265.439a7 7 0 0 0-.265-.439l.87-.493a8 8 0 0 1 .587.987zm.05 1.026-.976.219a7 7 0 0 0-.086-.383l.976-.219c.022.383.022.76 0 1.143zm-.219-.219-.976.219a7 7 0 0 0-.086-.383l.976-.219c.022.383.022.76 0 1.143zm-.71 1.37a7 7 0 0 0-.342-.76l.976-.219c.142.366.256.743.342 1.126zM8 7.5a.5.5 0 0 1 .5.5v1.5H10a.5.5 0 0 1 0 1H8a.5.5 0 0 1-.5-.5V8a.5.5 0 0 1 .5-.5"/>
                <path d="M8 1a7 7 0 1 0 8 7 7 7 0 0 0-8-7m0 1a6 6 0 1 1-6 6 6 6 0 0 1 6-6"/>
              </svg>
              Draft History Log
            </h2>
            {history.length > 0 && (
              <button 
                onClick={clearHistory}
                className="btn btn-link text-danger text-decoration-none p-0"
                style={{ fontSize: '0.8rem' }}
              >
                Clear All
              </button>
            )}
          </div>

          {history.length > 0 ? (
            <div style={{ maxHeight: '250px', overflowY: 'auto', paddingRight: '4px' }}>
              {history.map(item => (
                <div 
                  key={item.id} 
                  className="history-item px-2"
                  onClick={() => loadHistoryItem(item.text)}
                >
                  <div className="history-text-preview">{item.text}</div>
                  <div className="history-meta">
                    <span>{item.charCount} characters</span>
                    <span>{item.time}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4" style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              No recent draft history. Drafts are automatically logged when you save or clear the sheet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}