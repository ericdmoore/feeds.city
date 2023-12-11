/**
 * A Preact Stateful component that renders the text from a loaded URL.
 * So the component state would need be and input box.
 * and then also have a side effect of creating text state from the URL.
*/

import {useState, useEffect} from 'preact/hooks'

export const Preview = () => {
  const [text, setText] = useState('');
  const [url, setUrl] = useState('');

  const fetchText = async () => {
    const response = await fetch(url);
    const text = await response.text();
    setText(text);
  };

  useEffect(() => {fetchText()}, [url]);

  return (
    <div>
      <input
        type="text"
        value={url}
        onChange={(e) => setUrl(e?.target?.value)}
      />
      <pre>{text}</pre>
    </div>
  );
};  


