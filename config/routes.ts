export default [
    {
        path: '/auth',
        name: 'auth',
        component: './Auth',
    },
    {
        path: '/',
        component: '@/layouts',
        routes: [
            {
                path: '/home',
                name: 'home',
                component: './Home',
            },
            {
                name: 'syncConfig',
                path: '/syncConfig',
                component: '@/components/SyncConfig',
            },
            {
                name: 'notificationConfig',
                path: '/notificationConfig',
                component: '@/components/NotificationConfig'
            },
            {
                name: 'creationConfig',
                path: '/creationConfig',
                component: '@/components/CreationConfig'
            }
        ]
    },
];
