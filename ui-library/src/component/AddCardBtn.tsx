import { AddCardBtnProps } from '../interfaces/formFields';
export const AddCardBtn = (cardInfo: Readonly<AddCardBtnProps>) => {
  const { name, onClick } = cardInfo;
  return (
    <>
      <button className="addCardBtn" onClick={onClick}>
        <span>+</span>
        {name}
      </button>
    </>
  );
};
