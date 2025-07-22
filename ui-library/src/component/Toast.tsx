// toastUtils.ts
import { toast, Toast } from 'react-hot-toast';

export const toastSuccess = (message: string) => {
  toast.custom((t: Toast) => (
    <div className={`toast-container success ${t.visible ? 'animate-enter' : 'animate-leave'}`}>
      <div className="icon">✅</div>
      <div className="content">
        <div className="title">Success</div>
        <div className="message">{message}</div>
      </div>
      <button className="close-btn" onClick={() => toast.dismiss(t.id)}>
        Close
      </button>
      <div className="toast-progress" />
    </div>
  ));
};

export const toastError = (message: string) => {
  toast.custom((t: Toast) => (
    <div className={`toast-container error ${t.visible ? 'animate-enter' : 'animate-leave'}`}>
      <div className="icon">❌</div>
      <div className="content">
        <div className="title">Error</div>
        <div className="message">{message}</div>
      </div>
      <button className="close-btn" onClick={() => toast.dismiss(t.id)}>
        Close
      </button>
      <div className="toast-progress" />
    </div>
  ));
};
