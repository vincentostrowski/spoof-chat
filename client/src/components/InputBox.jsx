import { useState, useEffect, useRef } from "react";
import messageService from "../services/messageService";

const InputBox = ({ conversation, setNewMessage, newMessage, className }) => {
  const [text, setText] = useState("");
  const textareaRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "0px";
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = scrollHeight + "px";
    }
  }, [text]);

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await messageService.create(conversation.id, { text });
      setText("");
      setNewMessage(!newMessage);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className={`${className} bg-gray-200 p-2 rounded`}>
      <form onSubmit={onSubmit} className="flex justify-center gap-3">
        <textarea
          ref={textareaRef}
          placeholder="Enter a message..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-4/5 h-10 resize-none overflow-auto"
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              onSubmit(e);
            }
          }}
        />
        <button>Send</button>
      </form>
    </div>
  );
};

export default InputBox;
