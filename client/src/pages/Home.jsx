import { useState } from 'react';
import { Link } from 'react-router-dom';
import NotesInput from '../components/NotesInput';
import DigestResult from '../components/DigestResult';
import { generateDigest } from '../api';

function Home() {
  const [notes, setNotes] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [digest, setDigest] = useState(null);
  const [error, setError] = useState(null);

  const handleGenerate = async () => {
    setIsLoading(true);
    setError(null);
    setDigest(null);

    try {
      const result = await generateDigest(notes);
      setDigest(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="home">
      <div className="header-row">
        <div>
          <h1>Meeting Digest</h1>
          <p className="subtitle">Turn messy notes into decisions, action items, and open questions.</p>
        </div>
        <Link to="/history" className="back-link">View history →</Link>
      </div>
      <NotesInput
        notes={notes}
        onNotesChange={setNotes}
        onGenerate={handleGenerate}
        isLoading={isLoading}
      />
      {error && <p className="error">{error}</p>}
      <DigestResult digest={digest} />
    </div>
  );
}

export default Home;