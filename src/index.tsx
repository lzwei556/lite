import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { LocaleProvider } from './localeProvider';
import { configResponsive } from 'ahooks';
import { Main } from './main';
import { AppProvider } from 'providers/app';

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
  <LocaleProvider>
    <AppProvider>
      <Main />
    </AppProvider>
  </LocaleProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
