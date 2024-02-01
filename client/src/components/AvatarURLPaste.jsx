import { useState, useEffect, useRef } from "react";

// Component allows user to paste image URLs to be used as profile pictures
const AvatarURLPaste = ({ setUploaded, setAvatarURL, setOpenPasteURL }) => {
  const [url, setUrl] = useState("");
  const popupRef = useRef();

  // Add listener to close popup when user clicks outside of it
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
    <div className="fixed inset-0 flex items-center justify-center z-50">
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

export default AvatarURLPaste;
