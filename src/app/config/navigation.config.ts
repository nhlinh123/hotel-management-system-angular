export const NAVIGATION_ROUTES = {
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  HOTELS: '/hotels',
  ROOMS: '/rooms',
  USERS: '/users',
  BOOKINGS: '/bookings'
} as const;

export const NAVIGATION_MENU = [
  {
    label: 'Dashboard',
    route: NAVIGATION_ROUTES.DASHBOARD,
    icon: 'dashboard'
  },
  {
    label: 'Hotels',
    route: NAVIGATION_ROUTES.HOTELS,
    icon: 'hotel'
  },
  {
    label: 'Rooms',
    route: NAVIGATION_ROUTES.ROOMS,
    icon: 'door_front'
  },
  {
    label: 'Bookings',
    route: NAVIGATION_ROUTES.BOOKINGS,
    icon: 'calendar_month'
  },
  {
    label: 'Users',
    route: NAVIGATION_ROUTES.USERS,
    icon: 'people'
  }
] as const;
