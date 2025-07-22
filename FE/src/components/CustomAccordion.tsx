import { CustomAccordionProps } from '../interfaces/components';
import { useState } from 'react';

const CustomAccordion = ({
  data,
  radioBtn = true,
  setSelectedId,
  selectedValue,
}: {
  data: CustomAccordionProps[];
  radioBtn?: boolean;
  setSelectedId?: (e: string) => void;
  selectedValue?: string | null;
}) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <>
      {data?.map((list: CustomAccordionProps, index: number) => {
        return (
          <div
            key={index}
            className={`accordion ${
              selectedValue === list.id ? 'active' : openIndex === index ? 'active' : ''
            }`}
          >
            <button
              type="button"
              className="accordion-header"
              onClick={() => {
                setOpenIndex(index);
                if (setSelectedId) {
                  setSelectedId(list?.id);
                }
              }}
            >
              {radioBtn && (
                <div className="accordion-icon">
                  <span></span>
                </div>
              )}
              <h6>{list?.title}</h6>
            </button>
            <div className="accordion-body">{list?.content}</div>
          </div>
        );
      })}
    </>
  );
};

export default CustomAccordion;
