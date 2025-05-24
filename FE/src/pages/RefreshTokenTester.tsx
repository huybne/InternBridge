import React, { useState } from 'react';
import axios from 'axios';
import { RefreshResponse } from '../features/auth/authType';

export default function RefreshTokenTester() {
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleRefresh = async () => {
    try {
      const response = await axios.post<RefreshResponse>(
        'http://localhost:8088/api/v1/auth/refresh',
        {},
        { withCredentials: true }
      );
      console.log('✅ Refresh response:', response.data);
      setResult(`New access token: ${response.data.data.token}`);
      setError(null);
    } catch (err: any) {
      console.error('❌ Refresh error:', err);
      setResult(null);
      setError(err.response?.data?.message || 'Unknown error');
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>🔄 Refresh Token Tester</h2>
      <button onClick={handleRefresh}>Refresh Token</button>
      {result && <p style={{ color: 'green' }}>{result}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}

