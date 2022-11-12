// component
import Iconify from '../../components/Iconify';

// ----------------------------------------------------------------------

const getIcon = (name) => <Iconify icon={name} width={22} height={22} />;

const navConfig = [
  {
    title: 'dashboard',
    path: '/dashboard/app',
    icon: getIcon('eva:pie-chart-2-fill'),
  },
  {
    title: 'users',
    path: '/dashboard/user',
    icon: getIcon('eva:people-fill'),
  },
  {
    title: 'temperature',
    path: '/dashboard/temperature',
    icon: getIcon('carbon:temperature-celsius'),
  },
  {
    title: 'accelerometer',
    path: '/dashboard/accelerometer',
    icon: getIcon('fluent:gauge-20-regular'),
  },

  {
    title: 'gyroscope',
    path: '/dashboard/gyroscope',
    icon: getIcon('icon-park:one-third-rotation'),
  },
  {
    title: 'Upload CSV',
    path: '/dashboard/upload-csv',
    icon: getIcon('ph:file-csv'),
  },
  // {
  //   title: 'Not found',
  //   path: '/404',
  //   icon: getIcon('eva:alert-triangle-fill'),
  // },
];

export default navConfig;
