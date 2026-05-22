import { lazy } from "react";
import { Route } from "react-router-dom";

const Reports = lazy(() => import('features/report'));
const ReportList = lazy(() => import('features/report/list'));
const Report = lazy(() => import('features/report/detail'));

export const reportsRoutes = (
  <Route path='reports' element={<Reports />}>
    <Route index element={<ReportList />} />
    <Route path=':id' element={<Report />} />
  </Route>
);
