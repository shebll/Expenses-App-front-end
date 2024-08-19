/* prettier-ignore-start */

/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file is auto-generated by TanStack Router

import { createFileRoute } from '@tanstack/react-router'

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as RegisterImport } from './routes/register'
import { Route as LoginImport } from './routes/login'
import { Route as AuthenticatedImport } from './routes/_authenticated'
import { Route as AuthenticatedAnalyticsImport } from './routes/_authenticated/analytics'

// Create Virtual Routes

const AuthenticatedIndexLazyImport = createFileRoute('/_authenticated/')()
const AuthenticatedLogsLazyImport = createFileRoute('/_authenticated/logs')()

// Create/Update Routes

const RegisterRoute = RegisterImport.update({
  path: '/register',
  getParentRoute: () => rootRoute,
} as any)

const LoginRoute = LoginImport.update({
  path: '/login',
  getParentRoute: () => rootRoute,
} as any)

const AuthenticatedRoute = AuthenticatedImport.update({
  id: '/_authenticated',
  getParentRoute: () => rootRoute,
} as any)

const AuthenticatedIndexLazyRoute = AuthenticatedIndexLazyImport.update({
  path: '/',
  getParentRoute: () => AuthenticatedRoute,
} as any).lazy(() =>
  import('./routes/_authenticated/index.lazy').then((d) => d.Route),
)

const AuthenticatedLogsLazyRoute = AuthenticatedLogsLazyImport.update({
  path: '/logs',
  getParentRoute: () => AuthenticatedRoute,
} as any).lazy(() =>
  import('./routes/_authenticated/logs.lazy').then((d) => d.Route),
)

const AuthenticatedAnalyticsRoute = AuthenticatedAnalyticsImport.update({
  path: '/analytics',
  getParentRoute: () => AuthenticatedRoute,
} as any)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/_authenticated': {
      id: '/_authenticated'
      path: ''
      fullPath: ''
      preLoaderRoute: typeof AuthenticatedImport
      parentRoute: typeof rootRoute
    }
    '/login': {
      id: '/login'
      path: '/login'
      fullPath: '/login'
      preLoaderRoute: typeof LoginImport
      parentRoute: typeof rootRoute
    }
    '/register': {
      id: '/register'
      path: '/register'
      fullPath: '/register'
      preLoaderRoute: typeof RegisterImport
      parentRoute: typeof rootRoute
    }
    '/_authenticated/analytics': {
      id: '/_authenticated/analytics'
      path: '/analytics'
      fullPath: '/analytics'
      preLoaderRoute: typeof AuthenticatedAnalyticsImport
      parentRoute: typeof AuthenticatedImport
    }
    '/_authenticated/logs': {
      id: '/_authenticated/logs'
      path: '/logs'
      fullPath: '/logs'
      preLoaderRoute: typeof AuthenticatedLogsLazyImport
      parentRoute: typeof AuthenticatedImport
    }
    '/_authenticated/': {
      id: '/_authenticated/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof AuthenticatedIndexLazyImport
      parentRoute: typeof AuthenticatedImport
    }
  }
}

// Create and export the route tree

export const routeTree = rootRoute.addChildren({
  AuthenticatedRoute: AuthenticatedRoute.addChildren({
    AuthenticatedAnalyticsRoute,
    AuthenticatedLogsLazyRoute,
    AuthenticatedIndexLazyRoute,
  }),
  LoginRoute,
  RegisterRoute,
})

/* prettier-ignore-end */

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/_authenticated",
        "/login",
        "/register"
      ]
    },
    "/_authenticated": {
      "filePath": "_authenticated.tsx",
      "children": [
        "/_authenticated/analytics",
        "/_authenticated/logs",
        "/_authenticated/"
      ]
    },
    "/login": {
      "filePath": "login.tsx"
    },
    "/register": {
      "filePath": "register.tsx"
    },
    "/_authenticated/analytics": {
      "filePath": "_authenticated/analytics.tsx",
      "parent": "/_authenticated"
    },
    "/_authenticated/logs": {
      "filePath": "_authenticated/logs.lazy.tsx",
      "parent": "/_authenticated"
    },
    "/_authenticated/": {
      "filePath": "_authenticated/index.lazy.tsx",
      "parent": "/_authenticated"
    }
  }
}
ROUTE_MANIFEST_END */
