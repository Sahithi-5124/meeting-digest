import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchDigestHistory } from '../api';
import DigestResult from '../components/DigestResult';

function History() {
  const [digests, setDigests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDigestHistory()
      .then(setDigests)
      .catch((err) => setError(err.message))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="home">
      <Link to="/" className="back-link">← New digest</Link>
      <h1>Past Digests</h1>

      {isLoading && <p className="empty">Loading...</p>}
      {error && <p className="error">{error}</p>}
      {!isLoading && !error && digests.length === 0 && (
        <p className="empty">No digests yet — generate one from the home page.</p>
      )}

      <div className="history-list">
        {digests.map((digest) => (
          <div key={digest._id} className="history-entry">
            <p className="history-date">
              {new Date(digest.createdAt).toLocaleString()}
            </p>
            <p className="history-notes">{digest.notes}</p>
            <DigestResult digest={digest} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default History;