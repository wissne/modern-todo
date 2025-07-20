import React, { useState } from 'react';
import { API_BASE } from '../hooks/useTodos';

export const API_ADMIN_BASE = `${API_BASE}/admin`;

function AdminPanel() {
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState(''); // 认证和错误消息
  const [uploadMsg, setUploadMsg] = useState(null); // 上传成功/失败消息
  const [file, setFile] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleUpload = async () => {
    if (!file) {
      setMessage('Please select a database file to upload.');
      return;
    }
    const formData = new FormData();
    const encodedPassword = btoa(password);
    formData.append('token', encodedPassword);
    formData.append('file', file);
    try {
      const res = await fetch(`${API_ADMIN_BASE}/db`, {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        setUploadMsg({ type: 'success', text: data.message || 'Upload successful.' });
      } else {
        setUploadMsg({ type: 'error', text: data.message || 'Upload failed.' });
      }
    } catch (err) {
      setUploadMsg({ type: 'error', text: 'Upload failed.' });
    }
  };

  const handleDownload = async () => {
    try {
      const encodedPassword = btoa(password);
      const res = await fetch(`${API_ADMIN_BASE}/db?token=${encodeURIComponent(encodedPassword)}`);
      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'todos.db';
        a.click();
        window.URL.revokeObjectURL(url);
        setMessage('Download successful.');
      } else {
        const data = await res.json();
        setMessage(data.message || 'Download failed.');
      }
    } catch (err) {
      setMessage('Download failed.');
    }
  };

  // Password check via backend API
  const checkPassword = async () => {
    try {
      const encodedPassword = btoa(password);
      const res = await fetch(`${API_ADMIN_BASE}/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: encodedPassword }),
      });
      const data = await res.json();
      if (data.success) {
        setIsAuthenticated(true);
        setMessage(''); // 验证成功不显示消息
      } else {
        setIsAuthenticated(false);
        setMessage('Incorrect token.');
      }
    } catch (err) {
      setIsAuthenticated(false);
      setMessage('Network error.');
    }
  };

return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full p-6 border border-gray-200 rounded-lg bg-white shadow flex flex-col items-center">
            <h2 className="text-2xl font-bold mb-6 text-center">Admin Panel</h2>
            {!isAuthenticated && (
                <>
                    <input
                        type="password"
                        placeholder="Enter password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        onKeyDown={e => {
                            if (e.key === 'Enter') checkPassword();
                        }}
                        className="w-full mb-4 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 text-center"
                    />
                    <button
                        onClick={checkPassword}
                        className="w-full mb-6 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                    >
                        Check Password
                    </button>
                </>
            )}
            {isAuthenticated && (
                <>
                    <div className="w-full mb-4 flex flex-row items-center gap-2">
                        <input type="file" accept=".db" onChange={e => setFile(e.target.files[0])} className="flex-1 w-24 border border-gr</div>ay-300 rounded" />
                        <button
                            onClick={handleUpload}
                            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
                        >
                            Restore Database
                        </button>
                    </div>
                    {/* 上传成功/失败提示 */}
                    {uploadMsg && uploadMsg.type === 'success' && (
                        <div className="w-full mt-2 px-4 py-2 bg-green-100 text-green-700 rounded text-center border border-green-300 animate-fade-in">
                            {uploadMsg.text}
                        </div>
                    )}
                    {uploadMsg && uploadMsg.type === 'error' && (
                        <div className="w-full mt-2 px-4 py-2 bg-red-100 text-red-700 rounded text-center border border-red-300 animate-fade-in">
                            {uploadMsg.text}
                        </div>
                    )}
                    <button
                        onClick={handleDownload}
                        className="w-full mb-4 px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition"
                    >
                        Backup Database
                    </button>
                </>
            )}
            {/* 认证失败或其他错误提示 */}
            {!isAuthenticated && message && (
                <div className="w-full mt-2 px-4 py-2 bg-red-100 text-red-700 rounded text-center border border-red-300 animate-fade-in">
                    {message}
                </div>
            )}
        </div>
    </div>
);
}

export default AdminPanel;
