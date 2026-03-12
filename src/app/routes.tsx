import { createBrowserRouter } from 'react-router';
import { Layout } from './components/Layout';
import { DashboardPage } from './components/DashboardPage';
import { BeneficiariesPage } from './components/BeneficiariesPage';
import { ResourceAllocationPage } from './components/ResourceAllocationPage';
import { GeoMappingPage } from './components/GeoMappingPage';
import { SMSNotificationPage } from './components/SMSNotificationPage';
import { ReportsPage } from './components/ReportsPage';
import { SettingsPage } from './components/SettingsPage';
import { NotFoundPage } from './components/NotFoundPage';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Layout,
    children: [
      { index: true, Component: DashboardPage },
      { path: 'beneficiaries', Component: BeneficiariesPage },
      { path: 'resource-allocation', Component: ResourceAllocationPage },
      { path: 'geo-mapping', Component: GeoMappingPage },
      { path: 'sms-notification', Component: SMSNotificationPage },
      { path: 'reports', Component: ReportsPage },
      { path: 'settings', Component: SettingsPage },
      { path: '*', Component: NotFoundPage },
    ],
  },
]);
