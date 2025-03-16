import ReactDOM from 'react-dom/client';
import './index.css'; 
import App from './App';
import * as Sentry from '@sentry/react';
import "./utils/sentry"

const AppWrapper = () => {
  return (
    <Sentry.ErrorBoundary fallback={<div>An error has occurred</div>}>
        <App />
    </Sentry.ErrorBoundary>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(<AppWrapper />);
