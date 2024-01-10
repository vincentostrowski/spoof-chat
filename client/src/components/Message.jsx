const Message = (props) => {
  return (
    <div className={`${props.className} ${props.isUser ? "isUser" : ""}`}>
      {props.message.text}
    </div>
  );
};

export default Message;
