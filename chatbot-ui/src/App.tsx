// import React, { useState } from 'react';
// import './App.css';
// import { Container, Row, Col, Button, Form, Dropdown, Image } from 'react-bootstrap';

// interface Message {
//   id: number;
//   text: string;
//   type: 'user' | 'bot';
//   actions?: string[];
// }

// const App: React.FC = () => {
//   const [messages, setMessages] = useState<Message[]>([]);
//   const [newMessage, setNewMessage] = useState<string>('');
//   const [editingMessageId, setEditingMessageId] = useState<number | null>(null);

//   // Mock function to simulate an API response
//   const sendMessageToAPI = async (message: string) => {
//     const botMessage: Message = {
//       id: Date.now(),
//       text: `Hi Jane,\nAmazing how Mosey is simplifying state compliance\nfor businesses across the board!`,
//       type: 'bot',
//       actions: ['Create Report this month', 'Call Lead'],
//     };
//     return botMessage;
//   };

//   const handleSend = async () => {
//     if (newMessage.trim()) {
//       if (editingMessageId) {
//         // Editing an existing message
//         setMessages((prevMessages) =>
//           prevMessages.map((msg) =>
//             msg.id === editingMessageId ? { ...msg, text: newMessage } : msg
//           )
//         );
//         setEditingMessageId(null); // Reset after editing
//       } else {
//         // Sending a new message
//         const userMessage: Message = { id: Date.now(), text: newMessage, type: 'user' };
//         setMessages([...messages, userMessage]);

//         const botMessage = await sendMessageToAPI(newMessage);
//         setMessages([...messages, userMessage, botMessage]);
//       }
//       setNewMessage('');
//     }
//   };

//   const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
//     if (e.key === 'Enter') {
//       e.preventDefault();
//       handleSend();
//     }
//   };

//   const handleEdit = (messageId: number, text: string) => {
//     setNewMessage(text);
//     setEditingMessageId(messageId); // Set the ID of the message being edited
//   };

//   const handleDelete = (messageId: number) => {
//     setMessages(messages.filter((message) => message.id !== messageId));
//   };

//   return (
//     <Container className="chat-container" style={{ maxWidth: '400px', marginTop: '50px', padding: '20px', borderRadius: '20px', backgroundColor: '#f7f7f7' }}>
//       <Row className="chat-header">
//         <Col className="d-flex align-items-center">
//           <Image src="https://media.istockphoto.com/id/1914590146/photo/3d-cartoon-businesswoman-with-headset-working-on-laptop.jpg?s=2048x2048&w=is&k=20&c=Lgbe-P3Tu2EcBqxNXKRZPfDPcReakwl06cX_9iNRIGs=" roundedCircle className="avatar" />
//           <div className="ml-2">
//             <strong>Hey👋, I'm Ava</strong>
//             <p>Ask me anything or pick a place to start</p>
//           </div>
//         </Col>
//       </Row>

//       {/* Conditionally render the chat body only if messages are not empty */}
//       {messages.length > 0 && (
//         <div className="chat-body" style={{ maxHeight: '400px', overflowY: 'auto', padding: '10px', marginTop: '20px', backgroundColor: '#fff', borderRadius: '10px' }}>
//           {messages.map((message) => (
//             <div key={message.id} className={`message-bubble ${message.type}`}>
//               <p>{message.text}</p>
//               {message.type === 'user' && (
//                 <div className="message-actions">
//                   <Button variant="link" size="sm" onClick={() => handleEdit(message.id, message.text)}>
//                     Edit
//                   </Button>
//                   <Button variant="link" size="sm" onClick={() => handleDelete(message.id)}>
//                     Delete
//                   </Button>
//                 </div>
//               )}
//               {message.actions && (
//                 <div className="action-buttons">
//                   {message.actions.map((action, index) => (
//                     <Button variant="outline-primary" size="sm" key={index} className="action-btn">
//                       {action}
//                     </Button>
//                   ))}
//                 </div>
//               )}
//             </div>
//           ))}
//         </div>
//       )}

//       <Row className="chat-input mt-3">
//         <Col xs={10}>
//           {/* Add onKeyPress to listen for Enter key */}
//           <Form.Control
//             type="text"
//             value={newMessage}
//             onChange={(e) => setNewMessage(e.target.value)}
//             onKeyPress={handleKeyPress} // Listening for Enter key
//             placeholder="Your question"
//           />
//         </Col>
//         <Col xs={2} className="d-flex align-items-center justify-content-end">
//           <Button onClick={handleSend} variant="primary">
//             {editingMessageId ? 'Save' : 'Send'}
//           </Button>
//         </Col>
//       </Row>

//       <Row className="chat-footer mt-3">
//         <Col>
//           <Dropdown>
//             <Dropdown.Toggle variant="secondary" id="dropdown-basic">
//               Context
//             </Dropdown.Toggle>

//             <Dropdown.Menu>
//               <Dropdown.Item href="#/action-1">Onboarding</Dropdown.Item>
//               <Dropdown.Item href="#/action-2">Support</Dropdown.Item>
//             </Dropdown.Menu>
//           </Dropdown>
//         </Col>
//       </Row>
//     </Container>
//   );
// };

// export default App;


import React, { useState } from 'react';
import './App.css';
import { Container, Row, Col, Button, Form, Dropdown, Image } from 'react-bootstrap';

interface Message {
  id: number;
  text: string;
  type: 'user' | 'bot';
  actions?: string[];
  userMessageId?: number; // Add this line
}

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>('');
  const [editingMessageId, setEditingMessageId] = useState<number | null>(null);

  const apiURL = 'http://127.0.0.1:8000/send_message/'; // Replace with your API URL

  // Function to send message to API and receive a response
  const sendMessageToAPI = async (message: string): Promise<Message> => {
    try {
      const response = await fetch(apiURL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_message: message }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const botMessage: Message = await response.json();
      console.log(botMessage);
      return botMessage;
    } catch (error) {
      console.error('Failed to send message:', error);
      return {
        id: Date.now(),
        text: 'Sorry, something went wrong.',
        type: 'bot',
      };
    }
  };


  const handleSend = async () => {
  if (newMessage.trim()) {
    if (editingMessageId) {
      // Editing an existing message
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg.id === editingMessageId ? { ...msg, text: newMessage } : msg
        )
      );
      setEditingMessageId(null); // Reset after editing
    } else {
      // Sending a new message
      const userMessage: Message = { id: Date.now(), text: newMessage, type: 'user' };
      setMessages([...messages, userMessage]);

      // Send message to API and get bot's response
      const botMessage = await sendMessageToAPI(newMessage);
      setMessages([...messages, userMessage, { ...botMessage, userMessageId: userMessage.id }]);
    }
    setNewMessage('');
  }
};


  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSend();
    }
  };

  const handleEdit = (messageId: number, text: string) => {
    setNewMessage(text);
    setEditingMessageId(messageId); // Set the ID of the message being edited
  };

  const handleDelete = (messageId: number) => {
  setMessages((prevMessages) =>
    prevMessages.filter(
      (message) =>
        message.id !== messageId &&
        message.userMessageId !== messageId // Remove associated bot messages
    )
  );
};


  return (
    <Container className="chat-container" style={{ maxWidth: '400px', marginTop: '50px', padding: '20px', borderRadius: '20px', backgroundColor: '#f7f7f7' }}>
      <Row className="chat-header">
        <Col className="d-flex align-items-center">
          <Image src="https://media.istockphoto.com/id/1914590146/photo/3d-cartoon-businesswoman-with-headset-working-on-laptop.jpg?s=2048x2048&w=is&k=20&c=Lgbe-P3Tu2EcBqxNXKRZPfDPcReakwl06cX_9iNRIGs=" roundedCircle className="avatar" />
          <div className="ml-2">
            <strong>Hey👋, I'm Ava</strong>
            <p>Ask me anything or pick a place to start</p>
          </div>
        </Col>
      </Row>

      {/* Conditionally render the chat body only if messages are not empty */}
      {messages.length > 0 && (
        <div className="chat-body" style={{ maxHeight: '400px', overflowY: 'auto', padding: '10px', marginTop: '20px', backgroundColor: '#fff', borderRadius: '10px' }}>
          {messages.map((message) => (
            <div key={message.id} className={`message-bubble ${message.type}`}>
              <p>{message.text}</p>
              {message.type === 'user' && (
                <div className="message-actions">
                  <Button variant="link" size="sm" onClick={() => handleEdit(message.id, message.text)}>
                    Edit
                  </Button>
                  <Button variant="link" size="sm" onClick={() => handleDelete(message.id)}>
                    Delete
                  </Button>
                </div>
              )}
              {message.actions && (
                <div className="action-buttons">
                  {message.actions.map((action, index) => (
                    <Button variant="outline-primary" size="sm" key={index} className="action-btn">
                      {action}
                    </Button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <Row className="chat-input mt-3">
        <Col xs={10}>
          <Form.Control
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress} // Listening for Enter key
            placeholder="Your question"
          />
        </Col>
        <Col xs={2} className="d-flex align-items-center justify-content-end">
          <Button onClick={handleSend} variant="primary">
            {editingMessageId ? 'Save' : 'Send'}
          </Button>
        </Col>
      </Row>

      <Row className="chat-footer mt-3">
        <Col>
          <Dropdown>
            <Dropdown.Toggle variant="secondary" id="dropdown-basic">
              Context
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item href="#/action-1">Onboarding</Dropdown.Item>
              <Dropdown.Item href="#/action-2">Support</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Col>
      </Row>
    </Container>
  );
};

export default App;
