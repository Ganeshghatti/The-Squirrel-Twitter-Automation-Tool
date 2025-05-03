'use client';
import { useState } from 'react';

export default function Home() {
  const [sheetUrl, setSheetUrl] = useState('');
  const [inputHtml, setInputHtml] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const processFollowers = async (event) => {
    event.preventDefault();
    if (!sheetUrl.trim()) {
      alert('Please enter a Google Sheet URL.');
      return;
    }

    const container = document.createElement('div');
    container.innerHTML = inputHtml;

    const followers = [];

    const usernameDivs = container.querySelectorAll('div[dir="ltr"].r-1wvb978');
    const fullNameDivs = container.querySelectorAll(
      'div[dir="ltr"].css-146c3p1.r-bcqeeo.r-1ttztb7.r-qvutc0.r-37j5jr.r-a023e6.r-rjixqe.r-b88u0q.r-1awozwy.r-6koalj.r-1udh08x.r-3s2u2q span.css-1jxf684.r-dnmrzs.r-1udh08x.r-1udbk01.r-3s2u2q.r-bcqeeo.r-1ttztb7.r-qvutc0.r-poiln3'
    );

    for (let i = 0; i < usernameDivs.length; i++) {
      const fullNameSpan = fullNameDivs[i]?.querySelector('span span');
      const fullName = fullNameSpan?.textContent?.trim() || '';
      const userName = usernameDivs[i]?.textContent?.trim() || '';
      const profileLink = `https://x.com/${userName}`;
      followers.push({ fullName, userName, profileLink });
    }

    try {
      console.log("Folowers ",followers)
      console.log('data sent to backend is ',JSON.stringify({ followers, sheetUrl }),)
      setError(false);
      setLoading(true);

      const response = await fetch('http://localhost:5000/add-row', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ followers, sheetUrl }),
      });
      const result = await response.json();
      console.log('Result:', result);
      alert('Data added to Google Sheet!');
    } catch (err) {
      console.error('Error:', err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <form onSubmit={processFollowers} className="flex flex-col gap-6 items-start">
        <input type="text" placeholder="Paste Google Sheet URL" value={sheetUrl} required
          className="w-full max-w-xl border border-black rounded-xl p-3"
          onChange={(e) => setSheetUrl(e.target.value)}
        />
        <textarea placeholder="Paste here..." value={inputHtml} required
          className="w-full max-w-xl h-52 border border-black rounded-xl p-3 text-sm resize-y"
          onChange={(e) => setInputHtml(e.target.value)}
        ></textarea>
        <button type="submit" className="w-64 bg-white border border-black rounded-xl p-3 text-lg hover:bg-blue-600 hover:text-white transition cursor-pointer"
        >
          Extract Followers
        </button>
      </form>

      {loading && (
        <div className="mt-4 text-blue-500">Sending data to Google Sheet...</div>
      )}
      {error && (
        <div className="mt-4 text-red-500">Some error occurred, please try again...</div>
      )}
    </div>
  );
}
