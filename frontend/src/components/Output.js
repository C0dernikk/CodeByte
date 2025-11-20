import React, { useContext } from 'react';
import CodeContext from '../context/CodeContext';

export default function Output() {
  const { result, theme } = useContext(CodeContext);

  const getThemeColors = (themeName) => {
    const light = { background: '#ffffff', color: '#222222', border: '#ddd' };
    const dark = { background: '#000000', color: '#ffffff', border: '#222' };

    const map = {
      github: { background: '#f6f8fa', color: '#24292e', border: '#e1e4e8' },
      chrome: { background: '#ffffff', color: '#333333', border: '#ddd' },
      dawn: { background: '#fefefe', color: '#333333', border: '#e6e6e6' },
      ambiance: { background: '#2b2b2b', color: '#f8f8f2', border: '#222' },
      monokai: { background: '#272822', color: '#f8f8f2', border: '#3b3a32' },
      dracula: { background: '#282a36', color: '#f8f8f2', border: '#222430' },
      twilight: { background: '#141414', color: '#e6e6e6', border: '#222' },
      tomorrow_night_bright: { background: '#1e1e1e', color: '#e6e1dc', border: '#2a2a2a' },
      tomorrow_night_blue: { background: '#002451', color: '#ffffff', border: '#001f3f' }
    };

    return map[themeName] || (themeName && themeName.includes('night') ? dark : light);
  };

  const themeColors = getThemeColors(theme);

  const myStyle = {
    marginTop: "3.1rem",
    backgroundColor: themeColors.background,
    padding: "1rem",
    color: themeColors.color,
  };

  const consoleStyle = {
    whiteSpace: "pre-wrap",
    height: "100%",
    width: "100%",
    padding: "0.5rem 1rem",
    borderRadius: "6px",
    color: themeColors.color,
    backgroundColor: themeColors.background,
    border: `1px solid ${themeColors.border}`,
    resize: "none",
  };

  return (
    <div style={{...myStyle, border: `1px solid ${themeColors.border}`, borderRadius: '8px'}}>
      <h5 className='mx-2'><i className="fa-solid fa-terminal"></i></h5>
      <div>
        <textarea disabled={true} style={consoleStyle} rows={10} value={result ? result.output : ''}></textarea>
      </div>
      <div id='output-meta'>
        <p className='my-0'>Job ID: {result?._id || '-'}</p>
        <p className='my-0'>Execution Time: {result?.executionTime || '-'}</p>
        <p className='my-0'>Language: {result?.language || '-'}</p>
        <p className='my-0'>Submitted At: {result?.submittedAt || '-'}</p>
      </div>
    </div>
  )
}
