import { useToast } from 'vuestic-ui';

export function useNotification() {
  const { init } = useToast();

  const showError = (error: Error | string) => {
    if (error instanceof Error) {
      init({
        message: error.message,
        color: 'danger',
        position: 'bottom-right',
      });
    } else {
      init({ message: error, color: 'danger', position: 'bottom-right' });
    }
  };

  const showSuccess = (message: string) => {
    init({ message, color: 'success', position: 'bottom-right' });
  };

  const showWarning = (message: string) => {
    init({ message, color: 'warning', position: 'bottom-right' });
  };

  return {
    showSuccess,
    showWarning,
    showError,
  };
}
