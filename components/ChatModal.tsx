import React, { useState, useEffect, useRef } from 'react';
import { marked } from 'marked';
import { ActiveTopic, ChatMessage, Scenario } from '../types';
import { CloseIcon, CopyIcon, CheckIcon } from '../constants';

interface ChatModalProps {
    isOpen: boolean;
    onClose: () => void;
    topic: ActiveTopic | null;
    history: ChatMessage[];
    isLoading: boolean;
    error: string | null;
    scenarios: Scenario[];
    onScenarioSelect: (scenario: Scenario) => void;
}

const ScenarioSelectionView: React.FC<{ scenarios: Scenario[], onSelect: (scenario: Scenario) => void }> = ({ scenarios, onSelect }) => (
    <div className="p-6 space-y-4">
        <h3 className="text-lg font-semibold text-gray-700 text-center">Choose an Example Scenario</h3>
        {scenarios.map((scenario) => (
            <button
                key={scenario.title}
                onClick={() => onSelect(scenario)}
                className="w-full text-left p-4 rounded-lg bg-gray-50 hover:bg-blue-100 border border-gray-200 transition-all duration-200"
            >
                <p className="font-bold text-blue-700">{scenario.title}</p>
                <p className="text-sm text-gray-600 mt-1">{scenario.description}</p>
            </button>
        ))}
    </div>
);

const ChatView: React.FC<{ history: ChatMessage[], isLoading: boolean, onCopy: () => void, copied: boolean }> = ({ history, isLoading, onCopy, copied }) => {
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [parsedMessages, setParsedMessages] = useState<string[]>([]);

    useEffect(() => {
        const parseMessages = async () => {
            const parsed = await Promise.all(
                history
                    .filter(msg => msg.role === 'model')
                    .map(msg => marked.parse(msg.text))
            );
            setParsedMessages(parsed);
        };
        parseMessages();
    }, [history]);
    
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [parsedMessages, isLoading]);

    const lastModelResponse = history.filter(msg => msg.role === 'model').pop();

    return (
        <>
            <div className="flex-grow p-6 overflow-y-auto space-y-6">
                {parsedMessages.map((html, index) => (
                    <div key={index} className="flex flex-col">
                        <div className="bg-blue-500 text-white rounded-full h-8 w-8 flex items-center justify-center font-bold self-start mb-2">
                            <span>AI</span>
                        </div>
                        <div className="bg-gray-100 rounded-lg p-4 text-gray-800 w-full prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: html }}>
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="flex items-center justify-center p-4">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                        <p className="ml-3 text-gray-600">AI is thinking...</p>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {lastModelResponse && !isLoading && (
                <footer className="p-4 border-t border-gray-200 sticky bottom-0 bg-white rounded-b-2xl">
                    <button
                        onClick={onCopy}
                        className="w-full flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200"
                    >
                        {copied ? <CheckIcon /> : <CopyIcon />}
                        <span className="ml-2">{copied ? 'Copied to Clipboard!' : 'Copy Response'}</span>
                    </button>
                </footer>
            )}
        </>
    );
};


const ChatModal: React.FC<ChatModalProps> = ({ isOpen, onClose, topic, history, isLoading, scenarios, onScenarioSelect }) => {
    const [copied, setCopied] = useState(false);
    
    const [view, setView] = useState<'selection' | 'chat'>('selection');

    useEffect(() => {
        if (isOpen) {
            setView('selection'); // Reset to selection view whenever modal is opened
        }
    }, [isOpen]);
    
    useEffect(() => {
        if (history.length > 0) {
            setView('chat');
        }
    }, [history]);

    if (!isOpen) return null;

    const handleCopy = () => {
        const lastModelResponse = history.filter(msg => msg.role === 'model').pop();
        if (lastModelResponse) {
            navigator.clipboard.writeText(lastModelResponse.text);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const showChat = view === 'chat' || isLoading;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
                <header className="flex items-center justify-between p-4 border-b border-gray-200 sticky top-0 bg-white rounded-t-2xl">
                    <div className="flex items-center space-x-4">
                        {topic?.icon && <span className="text-3xl">{topic.icon}</span>}
                        <h2 className="text-xl font-bold text-gray-800">{topic?.title || 'Details'}</h2>
                    </div>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800 transition-colors">
                        <CloseIcon />
                    </button>
                </header>

                {showChat ? (
                     <ChatView history={history} isLoading={isLoading} onCopy={handleCopy} copied={copied} />
                ) : (
                    <ScenarioSelectionView scenarios={scenarios} onSelect={onScenarioSelect} />
                )}
            </div>
        </div>
    );
};

export default ChatModal;