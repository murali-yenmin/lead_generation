import { ErrorValidationProps } from '../interfaces/components';

export const ErrorValidation = ({
  errors,
  name = '',
  sizeMax,
  sizeMin,
  matchField,
}: ErrorValidationProps) => {
  const message = () => {
    if (errors?.type === 'required') {
      return `Please enter a ${name}`;
    } else if (errors?.type === 'pwd_length') {
      return `Password should reach atleast medium strength`;
    } else if (errors?.type === 'oneOf') {
      if (matchField) {
        let spacedString = matchField.replace(/([a-z])([A-Z])/g, '$1 $2');
        let lowerCased = spacedString.toLowerCase();
        return `${
          lowerCased.charAt(0).toUpperCase() + lowerCased.slice(1)
        } and ${name?.toLowerCase()} must match`;
      } else {
        return errors.message;
      }
    } else if (errors?.type === 'email') {
      return `Please enter a valid ${name?.toLowerCase()}`;
    } else if (errors?.type === 'min') {
      return `Please enter a ${name.toLowerCase()} that is at least ${sizeMin} characters long`;
    } else if (errors?.type === 'max') {
      return `Please enter a ${name.toLowerCase()} that is no more than ${sizeMax} characters long`;
    } else if (errors?.type === 'select') {
      return `Please select a ${name}`;
    } else if (errors?.type === 'choose') {
      return `Please choose the ${name}`;
    } else if (errors?.type === 'custom') {
      return errors.message;
    } else if (errors?.type === 'matches') {
      return errors.message;
    } else if (errors?.type === 'typeError') {
      return errors.message;
    } else if (errors?.type === 'nullable') {
      return `Please enter a ${name}`;
    } else if (errors?.type === 'optionality') {
      return errors.message;
    }
  };

  return (
    <div className="error-container">
      <WarningSvg />
      <span className="error-message">{message()}</span>
    </div>
  );
};

export default ErrorValidation;

// sample calling
// {error && <ErrorValidation errors={error} name={label?.toLowerCase()} sizeMax={sizeMax} sizeMin={sizeMin} />}

export const WarningSvg = () => {
  return (
    <svg width="16" height="16" viewBox="0 0 11 11" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M0.695312 5.58889C0.695312 8.35486 2.92937 10.5889 5.69534 10.5889C8.46131 10.5889 10.6954 8.35486 10.6954 5.58889C10.6954 2.82292 8.46131 0.588867 5.69534 0.588867C2.92937 0.588867 0.695313 2.82292 0.695312 5.58889ZM5.69534 9.79104C3.3549 9.79104 1.49319 7.92933 1.49319 5.58889C1.49319 3.24845 3.3549 1.38674 5.69534 1.38674C8.03578 1.38674 9.89749 3.24846 9.89749 5.58889C9.89749 7.92933 8.03578 9.79104 5.69534 9.79104Z"
        fill="#D20400"
      />
      <path
        d="M6.06765 6.43997C6.06765 6.01444 6.06765 5.58891 6.06765 5.16337C6.06765 4.9506 5.96127 4.84422 5.7485 4.79103C5.58893 4.73784 5.37616 4.84422 5.32297 5.0038C5.32297 5.05699 5.26978 5.11018 5.26978 5.16337C5.26978 6.01444 5.26978 6.81232 5.26978 7.66338C5.32297 7.92934 5.48254 8.08892 5.69531 8.08892C5.90808 8.08892 6.06765 7.92934 6.06765 7.71658C6.06765 7.29104 6.06765 6.86551 6.06765 6.43997Z"
        fill="#D20400"
      />
      <path
        d="M5.69525 3.2485C5.42929 3.2485 5.16333 3.46127 5.16333 3.78042C5.16333 4.09957 5.3761 4.31233 5.69525 4.31233C5.96121 4.31233 6.22717 4.09957 6.22717 3.78042C6.22717 3.51446 5.96121 3.2485 5.69525 3.2485Z"
        fill="#D20400"
      />
    </svg>
  );
};
