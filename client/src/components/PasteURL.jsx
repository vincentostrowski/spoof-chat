import { useState, useEffect, useRef } from "react";

const PasteURL = ({ setUploaded, setAvatarURL, setOpenPasteURL }) => {
  const [url, setUrl] = useState("");
  const popupRef = useRef();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setOpenPasteURL(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const onSubmit = (e) => {
    e.preventDefault();
    setUploaded(true);
    setAvatarURL(url);
    setUrl("");
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-10">
      <div ref={popupRef} className="bg-white p-5 rounded shadow-lg">
        <form onSubmit={(e) => onSubmit(e)}>
          <input
            type="text"
            placeholder="Paste URL here"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default PasteURL;
