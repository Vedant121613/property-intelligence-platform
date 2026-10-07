import React, { useState } from 'react';
import { ChevronRight } from 'lucide-react';

export default function FAQAccordion({ faqs = [] }) {
  const [openIndices, setOpenIndices] = useState([0]); // First item open by default
  const [showAll, setShowAll] = useState(false);

  const toggleIndex = (index) => {
    setOpenIndices(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const displayedFaqs = showAll ? faqs : faqs.slice(0, 5);

  if (!faqs || faqs.length === 0) return null;

  return (
    <section className="faq-section">
      <h2 className="faq-header-title">Frequently Asked Questions</h2>
      <div className="faq-list">
        {displayedFaqs.map((faq, index) => {
          const isOpen = openIndices.includes(index);
          return (
            <div key={index} className={`faq-item ${isOpen ? 'open' : ''}`}>
              <button 
                type="button" 
                className="faq-question-btn"
                onClick={() => toggleIndex(index)}
                aria-expanded={isOpen}
              >
                <span>{faq.question}</span>
                <ChevronRight size={18} className="faq-icon" />
              </button>
              {isOpen && (
                <div className="faq-answer">
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {faqs.length > 5 && !showAll && (
        <button 
          type="button" 
          className="view-more-btn"
          onClick={() => setShowAll(true)}
        >
          View more
        </button>
      )}
    </section>
  );
}
