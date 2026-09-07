const MIN_LENGTH = 20;

function NotesInput({ notes, onNotesChange, onGenerate, isLoading }) {
  const isTooShort = notes.trim().length > 0 && notes.trim().length < MIN_LENGTH;

  return (
    <div className="notes-input">
      <label htmlFor="notes">Paste your meeting notes or transcript</label>
      <textarea
        id="notes"
        value={notes}
        onChange={(e) => onNotesChange(e.target.value)}
        placeholder="e.g. Sarah will follow up with the vendor by Friday. We decided to push the launch to next quarter..."
        rows={10}
      />
      {isTooShort && (
        <p className="hint">Add a bit more detail (at least {MIN_LENGTH} characters) for a useful digest.</p>
      )}
      <button
        onClick={onGenerate}
        disabled={isLoading || notes.trim().length < MIN_LENGTH}
      >
        {isLoading ? 'Generating...' : 'Generate Digest'}
      </button>
    </div>
  );
}

export default NotesInput;