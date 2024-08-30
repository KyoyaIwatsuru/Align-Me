"use client";

import { useEffect, useState } from 'react';

export default function Page() {
  const [savedData, setSavedData] = useState<{ jobs: string[], actions: Record<string, string[]> } | null>(null);

  useEffect(() => {
    const data = localStorage.getItem('savedData');
    if (data) {
      const parsedData = JSON.parse(data);

      const actions = typeof parsedData.actions === 'string' ? JSON.parse(parsedData.actions.replace("```json", "").replace("```", "")) : parsedData.actions;

      setSavedData({ ...parsedData, actions });
    }
  }, []);

  return (
    <main className="h-[100%]">
      <div className="p-4 h-[100%]">
        <h1 className="text-2xl font-bold mb-4">保存された職種と行動</h1>
        {savedData ? (
          <div>
            <h2 className="text-xl font-semibold mb-2">選択された職種</h2>
            <ul className="list-disc ml-6 mb-4">
              {savedData.jobs.map((job, index) => (
                <li key={index} className="mb-1">{job}</li>
              ))}
            </ul>

            <h2 className="text-xl font-semibold mb-2">提案された行動</h2>
            {Object.keys(savedData.actions).map((job, index) => (
              <div key={job} className="collapse collapse-arrow bg-base-200 mb-2">
                <input type="radio" name="my-accordion-2" defaultChecked={index === 0} />
                <div className="collapse-title text-xl font-medium">{job}</div>
                <div className="collapse-content">
                  <ul className="list-disc ml-6">
                    {savedData.actions[job].map((action, actionIndex) => (
                      <li key={actionIndex} className="mb-1">{action}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>まだデータが保存されていません。</p>
        )}
      </div>
    </main>
  );
}