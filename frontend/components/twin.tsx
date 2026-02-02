'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User } from 'lucide-react';

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
}

export default function Twin() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [sessionId, setSessionId] = useState<string>('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const sendMessage = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: input,
            timestamp: new Date(),
        };

        setMessages(prev => [...prev, userMessage]);

        // Auto-show resume if keyword detected
        if (input.toLowerCase().includes('resume')) {
            setShowResume(true);
        }

        setInput('');
        setIsLoading(true);

        try {
            const response = await fetch('http://localhost:8000/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: input,
                    session_id: sessionId || undefined,
                }),
            });

            if (!response.ok) throw new Error('Failed to send message');

            const data = await response.json();

            if (!sessionId) {
                setSessionId(data.session_id);
            }

            const assistantMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: data.response,
                timestamp: new Date(),
            };

            setMessages(prev => [...prev, assistantMessage]);
        } catch (error) {
            console.error('Error:', error);
            // Add error message
            const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: 'Sorry, I encountered an error. Please try again.',
                timestamp: new Date(),
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    const [showResume, setShowResume] = useState(false);

    return (
        <div className={`flex h-full bg-white gap-4 transition-all duration-500 ease-in-out`}>
            {/* Chat Column */}
            <div className={`flex flex-col h-full bg-white flex-1 transition-all duration-500`}>
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-white/50 backdrop-blur-sm sticky top-0 z-10">
                    <div className="flex items-center gap-3">
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-sm font-medium text-gray-600">Agent Active</span>
                    </div>
                    <button
                        onClick={() => setMessages([])}
                        className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        Clear Chat
                    </button>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto px-6 py-6 space-y-8 scroll-smooth">
                    {messages.length === 0 && (
                        <div className="h-full flex flex-col items-center justify-center text-center opacity-0 animate-[fadeIn_0.5s_ease-in_forwards]">
                            <div className="w-16 h-16 bg-gradient-to-tr from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
                                <Bot className="w-8 h-8 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-800">Welcome to your Digital Twin</h3>
                            <p className="text-gray-500 max-w-sm mt-2 text-sm leading-relaxed">
                                I can help you orchestrate, deploy, and manage your AI infrastructure.
                            </p>

                            <div className="flex flex-wrap gap-2 mt-8 w-full justify-center">
                                {['How to contact you?', 'Show your resume', 'Tell me about yourself'].map((text) => (
                                    <button
                                        key={text}
                                        onClick={() => setInput(text)}
                                        className="px-4 py-2 bg-white border border-gray-200 rounded-full text-sm text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm hover:shadow-md active:scale-[0.98] whitespace-nowrap"
                                    >
                                        {text}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {messages.map((message) => (
                        <div
                            key={message.id}
                            className={`flex flex-col ${message.role === 'user' ? 'items-end' : 'items-start'} animate-[slideIn_0.3s_ease-out]`}
                        >
                            <div
                                className={`max-w-[80%] rounded-2xl px-5 py-3.5 shadow-sm text-[15px] leading-relaxed ${message.role === 'user'
                                    ? 'bg-gray-900 text-white rounded-br-sm'
                                    : 'bg-gray-50 text-gray-800 border border-gray-100 rounded-bl-sm'
                                    }`}
                            >
                                <p className="whitespace-pre-wrap">{message.content}</p>
                            </div>
                            <span className="text-[10px] text-gray-300 mt-1.5 px-1 font-medium">
                                {message.role === 'user' ? 'YOU' : 'AI TWIN'} • {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                        </div>
                    ))}

                    {isLoading && (
                        <div className="flex justify-start animate-[slideIn_0.3s_ease-out]">
                            <div className="bg-gray-50 border border-gray-100 rounded-2xl rounded-bl-sm px-5 py-4 shadow-sm">
                                <div className="flex space-x-1.5 items-center h-full">
                                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
                                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }} />
                                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }} />
                                </div>
                            </div>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="p-6 bg-white">
                    <div className="relative flex items-center gap-2">
                        <button
                            onClick={() => setShowResume(!showResume)}
                            className={`p-4 rounded-xl border transition-all ${showResume ? 'bg-gray-900 text-white border-gray-900' : 'bg-gray-50 text-gray-500 border-transparent hover:bg-gray-100'}`}
                            title="Toggle Resume"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                                <polyline points="14 2 14 8 20 8" />
                                <line x1="16" y1="13" x2="8" y2="13" />
                                <line x1="16" y1="17" x2="8" y2="17" />
                                <line x1="10" y1="9" x2="8" y2="9" />
                            </svg>
                        </button>
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyPress}
                            placeholder="Type your message..."
                            className="w-full pl-5 pr-14 py-4 bg-gray-50 border-0 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-100 focus:bg-white transition-all shadow-inner text-base"
                            disabled={isLoading}
                        />
                        <button
                            onClick={sendMessage}
                            disabled={!input.trim() || isLoading}
                            className="absolute right-2 p-2 bg-gray-900 text-white rounded-lg hover:bg-black transition-all disabled:opacity-0 disabled:scale-90 shadow-md hover:shadow-lg active:scale-95"
                        >
                            <Send className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Resume Column - only shows when showResume is true */}
            {showResume && (
                <div className="flex-1 h-full bg-gray-50 rounded-2xl border border-gray-200 overflow-hidden animate-[slideIn_0.5s_ease-out]">
                    <div className="h-full w-full flex flex-col">
                        <div className="px-4 py-3 bg-white border-b border-gray-200 flex justify-between items-center">
                            <span className="text-sm font-medium text-gray-700">resume-rohan.pdf</span>
                            <button onClick={() => setShowResume(false)} className="text-gray-400 hover:text-gray-600">×</button>
                        </div>
                        <iframe
                            src="/resume-rohan.pdf"
                            className="w-full h-full"
                            title="Resume"
                        />
                    </div>
                </div>
            )}
        </div>
    );
}