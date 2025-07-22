import { OutsideClickProps } from "../interfaces/functions";

export const OutsideClick = (props: OutsideClickProps) => {
  const { wrapperRef, setIsOpen } = props;

  function handleClickOutside(event: MouseEvent) {
    if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  }
  // Bind the event listener
  document.addEventListener("mousedown", (e) => handleClickOutside(e));

  return () => {
    document.addEventListener("mousedown", (e) => handleClickOutside(e));
  };
};

export default OutsideClick;
