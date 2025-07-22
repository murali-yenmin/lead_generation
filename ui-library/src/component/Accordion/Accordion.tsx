import { useState } from 'react';
import { AccordionProps } from '../../interfaces/components';

export const Accordion = ({ items, defaultOpen, id = '' }: AccordionProps) => {
  const [openIndex, setOpenIndex] = useState<number | null>(defaultOpen ?? null);

  const toggleAccordion = (index: number) => {
    setOpenIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  return (
    <div className="accordion">
      {items.map((item, index) => (
        <div
          key={index}
          id={`accordion-item-${index}${id ? `-${id}` : ''}`}
          className="accordion-item"
        >
          <button
            className={`accordion-header ${openIndex === index ? 'active' : ''}`}
            onClick={() => toggleAccordion(index)}
          >
            {item.title}
            {item?.icon ? (
              item.icon
            ) : (
              <span className="arrow">{openIndex === index ? '-' : '+'}</span>
            )}
          </button>
          <div className={`accordion-content ${openIndex === index ? 'open' : ''}`}>
            {item.content}
          </div>
        </div>
      ))}
    </div>
  );
};
