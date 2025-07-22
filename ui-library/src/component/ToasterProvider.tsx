import { Toaster } from 'react-hot-toast';

export const ToasterProvider = () => {
  return (
    <Toaster
      position="top-right"
      reverseOrder={false}
      containerStyle={{ top: '90px' }}
      toastOptions={{
        success: {
          iconTheme: {
            primary: '#fff',
            secondary: '#34c38f',
          },
          style: {
            background: '#fff',
            color: '#000',
            alignItems: 'baseline',
          },
        },
        error: {
          iconTheme: {
            primary: 'white',
            secondary: '#f46a6a',
          },
          style: {
            background: '#f46a6a',
            color: '#fff',
            alignItems: 'baseline',
          },
        },
      }}
    />
  );
};
