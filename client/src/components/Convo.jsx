import messageService from "../services/messageService";
import { useState, useEffect } from "react";
/* 
How to handle this part?????
-given props.conversation

- to type message will use an input element, form with send (submit button)
  - maybe this can be it's own component

- how to deal with messages?
- query DB for all messages with this convo as it's convo field ID
- start placing them in by time created
- 
*/

const Convo = (props) => {
  const [messages, setMessages] = useState([]);
  const [pagination, setPagination] = useState({ limit: 10, skip: 0 });

  useEffect(() => {
    const loadMessages = async () => {
      const { data } = await messageService.getAll(
        props.conversation.id,
        pagination
      );
      //FIGURE OUT HOW TO uSE PAGINATION & SKIP & LIMIT
      /* setMessages();
      setPagination(); */

      //until then ^ just use below to set
      setMessages(data);
    };

    loadMessages();
    //cleanup so when props.conversation.id changes, rendered messages removed right away
    return () => {
      setMessages([]);
      setPagination({ limit: 10, skip: 0 });
    };
  }, [props.conversation.id]);

  return (
    <div className={props.className}>
      {props.conversation.groupInfo.name}
      <ul className="space-y-4">
        {messages &&
          messages.map((message) => {
            return <li key={message._id}>{message.text}</li>;
          })}
      </ul>
    </div>
  );
};

export default Convo;
