function DigestResult({ digest }) {
  if (!digest) return null;

  return (
    <div className="digest-result">
      <section>
        <h2>Decisions</h2>
        {digest.decisions.length === 0 ? (
          <p className="empty">No clear decisions found.</p>
        ) : (
          <ul>
            {digest.decisions.map((decision, i) => (
              <li key={i}>{decision}</li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2>Action Items</h2>
        {digest.actionItems.length === 0 ? (
          <p className="empty">No action items found.</p>
        ) : (
          <ul className="action-items">
            {digest.actionItems.map((item, i) => (
              <li key={i}>
                <input type="checkbox" id={`item-${i}`} />
                <label htmlFor={`item-${i}`}>
                  {item.task} <span className="owner">— {item.owner}</span>
                </label>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2>Open Questions</h2>
        {digest.openQuestions.length === 0 ? (
          <p className="empty">No open questions found.</p>
        ) : (
          <ul>
            {digest.openQuestions.map((question, i) => (
              <li key={i}>{question}</li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

export default DigestResult;