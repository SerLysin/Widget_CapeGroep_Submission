import { createElement, ReactElement, useState, KeyboardEvent, useEffect, ChangeEvent, useRef } from "react";
import { TestContainerProps } from "../typings/TestProps";
import "./ui/Test.css";

interface ChatMessage {
  text: string;
  sender: "user" | "system";
}
  
const localStorageKey = 'chatMessages';

export function Test({ initialGreeting, result, userInput, onUserInputChange, systemResponse }: TestContainerProps): ReactElement {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [isChatOpen, setIsChatOpen] = useState(false); // State to track chat visibility


    useEffect(() => {
        // Scroll to the latest message
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    useEffect(() => {
      // Load chat messages from localStorage
      const savedMessages = localStorage.getItem(localStorageKey);
      if (savedMessages) {
          setMessages(JSON.parse(savedMessages));
      } else {
          // Initialize with an optional initial greeting if provided through props
          const welcomeMessage: ChatMessage = { text: initialGreeting || "Hello! How can I help you today?", sender: "system" };
          setMessages([welcomeMessage]);
          localStorage.setItem(localStorageKey, JSON.stringify([welcomeMessage])); // Save initial message to localStorage
      }
  }, [initialGreeting]);

  const saveMessagesToStorage = (updatedMessages: ChatMessage[]) => {
    localStorage.setItem(localStorageKey, JSON.stringify(updatedMessages));
};

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    // Update local state to reflect user's input
    
    userInput?.setValue(event.target.value);
    result.setValue(event.target.value) //user input to mendix
  };

  const handleUserInput = (event: KeyboardEvent<HTMLInputElement>) => {
     const input = userInput?.value ?? "";

    if (event.key === "Enter" && input.trim()) {

        displayUserMessage(input.trim());

        userInput?.setValue("")

        if(onUserInputChange?.canExecute && !onUserInputChange.isExecuting){
            onUserInputChange?.execute();
        }        
    }
  };
  useEffect(() => {
    if (isChatOpen) {
        // Scroll to the latest message only if the chat is open
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
}, [messages, isChatOpen]); 


useEffect(() => {
    if (systemResponse?.value) {
        // `systemResponse` has been updated, display the system message
        displaySystemMessage(systemResponse.value);
    }
}, [systemResponse?.value]); // Only re-run the effect if `systemResponse.value` changes

const displayUserMessage = (message: string) => {
  setMessages(prevMessages => {
    const updatedMessages = [...prevMessages, { text: message, sender: "user" as "user" | "system" }];
    saveMessagesToStorage(updatedMessages);
    return updatedMessages;
  });
};

const displaySystemMessage = (message: string) => {
  setMessages(prevMessages => {
    const updatedMessages = [...prevMessages, { text: message, sender: "system" as "user" | "system" }];
    saveMessagesToStorage(updatedMessages);
    return updatedMessages;
  });
};

  const renderMessages = () => messages.map((message, index) => (
    <div key={index} className={`chat-message ${message.sender === "user" ? "user-message" : "system-message"}`}>
      {message.text}
    </div>
  ));

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
    if (!isChatOpen) {
        setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 0);
    }
};

  const renderChatToggleButton = () => {
    if (!isChatOpen) {
        return createElement(
            "button",
            {
                className: "chat-toggle",
                onClick: toggleChat,
                "aria-label": "Open Chat"
            },
            "+" // Replace with your icon if needed
        );
    }
    return null; // Don't render the button when the chat is open
};

const renderChat = () => {
  return createElement(
      "div", { className: `chatbot-widget ${isChatOpen ? 'open' : ''}` },
      createElement(
          "div",
          { className: "chat-header" },
          "Cape Groep Assistant",
          createElement(
              "button",
              {
                  className: "collapse-button",
                  onClick: toggleChat,
                  "aria-label": "Collapse Chat"
              }
          )
      ),
      createElement(
          "div",
          { className: "chat-body", style: { overflowY: 'auto', maxHeight: '300px' } },
          renderMessages(),
          createElement("div", { ref: messagesEndRef })
      ),
      createElement("input", {
          type: "text",
          className: "user-input",
          placeholder: "Type a message...",
          value: userInput?.value,
          onChange: handleInputChange,
          onKeyPress: handleUserInput
      })
  );
};

return createElement(
  "div", { className: "chat-container" },
  renderChatToggleButton(),
  isChatOpen ? renderChat() : null
);
};
