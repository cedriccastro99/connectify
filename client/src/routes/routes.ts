import React from 'react';
import { Home, Users, Contact, BookUser } from 'lucide-react'

export const routes = [
    {
        path: '/',
        component: React.lazy(() => import('@/pages/Home')),
        title: 'Home',
        icon: Home,
        protected: true,
        in_sidebar: true
    },
    {
        path: '/users',
        component: React.lazy(() => import('@/pages/Users')),
        title: 'Users',
        icon: Users,
        protected: true,
        in_sidebar: true
    },
    {
        path: '/contacts',
        component: React.lazy(() => import('@/pages/Contacts')),
        title: 'Contacts',
        icon: Contact,
        protected: true,
        in_sidebar: true
    },
    {
        path: '/shared-contacts',
        component: React.lazy(() => import('@/pages/SharedContacts')),
        title: 'Shared Contacts',
        icon: BookUser,
        protected: true,
        in_sidebar: true
    },
    {
        path: '/',
        component: React.lazy(() => import('@/pages/Login')),
        title: 'Login',
        protected: false,
        in_sidebar: false
    },
    {
        path: '/forgot-password',
        component: React.lazy(() => import('@/pages/ForgotPassword')),
        title: 'Forgot Password',
        protected: false,
        in_sidebar: false
    }
]