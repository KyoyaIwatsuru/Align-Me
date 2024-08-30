"use client";

import { useState } from 'react';
import { FaArrowUp } from "react-icons/fa";
import ReactMarkdown from 'react-markdown';
import { useRouter } from 'next/navigation';

export default function Page() {
  const [chatHistory, setChatHistory] = useState([
    {
      role: "assistant",
      content: "こんにちは、佐藤太郎さん。今日はあなたの自己PRやキャリアに向けて、どのような業界や職種が合っているかを一緒に考えていきましょう。まず、これまでの経験や興味についてお話しいただけますか？たとえば、どんな部活動やサークルに参加していましたか？",
    }
  ]);
  const [prompt, setPrompt] = useState('');
  const [jobSuggestions, setJobSuggestions] = useState<string[]>([]);
  const [selectedJobs, setSelectedJobs] = useState<string[]>([]);
  const [isJobSelection, setIsJobSelection] = useState(false);
  const [actions, setActions] = useState<Record<string, string[]> | null>(null);
  const router = useRouter();

  const handleSendPrompt = async () => {
    const newChatHistory = [...chatHistory, { role: "user", content: prompt }];
    setChatHistory(newChatHistory);

    if (chatHistory.length >= 3) {
      const fetchJobSuggestions = async (newChatHistory: { role: string, content: string }[]) => {
        const result = await fetch('/api/generateJobs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ chatHistory: newChatHistory })
        });

        if (!result.ok) {
          throw new Error('Failed to fetch job suggestions');
        }

        const data = await result.json();
        const jobs = data.jobs;
        setJobSuggestions(jobs);
        setChatHistory([...newChatHistory, { role: "assistant", content: data.message }]);
      }

      await fetchJobSuggestions(newChatHistory);
      setIsJobSelection(true);
    } else {
      const result = await fetch('/api/generateQuestion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chatHistory: newChatHistory })
      });

      if (!result.ok) {
      throw new Error('Failed to fetch data')
      }

      const data = await result.json();
      setChatHistory([...newChatHistory, { role: "assistant", content: data.message }]);
    }

    setPrompt('');
  };

  const handleJobSelection = (job: string) => {
    setSelectedJobs((prevSelected) =>
      prevSelected.includes(job)
        ? prevSelected.filter(j => j !== job)
        : [...prevSelected, job]
    );
  };

  const handleSubmitJobs = async () => {
    const result = await fetch('/api/generateActions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ selectedJobs }),
    });

    if (!result.ok) {
      throw new Error('Failed to fetch actions');
    }

    const data = await result.json();
    setActions(data.actions);

    localStorage.setItem('savedData', JSON.stringify({ jobs: selectedJobs, actions: data.actions }));
    router.push('/viewSavedData');
  };

  return (
    <div className="w-[100%] flex flex-col flex-1 justify-between mb-10">
      <div className="flex flex-col h-[70vh] gap-4 overflow-y-auto">
        {chatHistory.map((chat, index) => (
          <div key={index} className={`chat ${chat.role === "user" ? "chat-end" : "chat-start"}`}>
            <div className="chat-header">
              {chat.role === "user" ? "You" : "AIアシスタント"}
            </div>
            <div className="chat-bubble chat-bubble-secondary">
              <ReactMarkdown>{chat.content}</ReactMarkdown>
            </div>
          </div>
        ))}

        {isJobSelection && jobSuggestions.length > 0 && (
          <div className="w-full flex flex-col items-center mt-4">
            <details className="dropdown w-[80%] md:w-[50%] lg:w-[40%]">
              <summary className="btn m-1 w-full text-center">興味がある職種を選択してください</summary>
              <ul className="menu dropdown-content bg-base-100 rounded-box z-[1] w-full p-2 shadow">
                {jobSuggestions.map((job, index) => (
                  <li key={index}>
                    <label className="cursor-pointer flex items-center space-x-2">
                      <input
                        type="checkbox"
                        className="checkbox"
                        value={job}
                        onChange={() => handleJobSelection(job)}
                      />
                      <span>{job}</span>
                    </label>
                  </li>
                ))}
              </ul>
            </details>
          </div>
        )}
      </div>

      {!isJobSelection ? (
        <div className="flex gap-3">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Type here"
            className="input input-bordered w-full max-w-xs"
          />
          <button onClick={handleSendPrompt} className="btn btn-primary">
            <FaArrowUp />
          </button>
        </div>
      ) : (
        <button onClick={handleSubmitJobs} className="btn btn-primary mt-4">
          <FaArrowUp /> 提案された職種を送信
        </button>
      )}
    </div>
  );
}