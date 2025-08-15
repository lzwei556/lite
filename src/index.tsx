import ReactDOM from 'react-dom/client';
import { persistor, store } from './store';
import { PersistGate } from 'redux-persist/integration/react';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { StoreContext } from 'redux-react-hook';
import AppRouter from './routers';
import { LocaleProvider } from './localeProvider';
import { AppProvider } from './config';
import { configResponsive } from 'ahooks';

configResponsive({
  xs: 0,
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
  xxl: 1400
});

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLDivElement);
root.render(
  <StoreContext.Provider value={store}>
    <PersistGate loading={null} persistor={persistor}>
      <LocaleProvider>
        <AppProvider>
          <AppRouter />
        </AppProvider>
      </LocaleProvider>
    </PersistGate>
  </StoreContext.Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
