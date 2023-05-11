const swaggerRoutes = new Set([
    '/docs/swagger-ui-init.js',
    '/docs/docs/swagger-ui-init.js',
    '/docs',
    '/docs/',
    '/docs-json',
    '/docs-yaml'
])


const fliterUndefined = (route) => route.route !== undefined;
const filterSwagger = (route) => !swaggerRoutes.has(route.route);
const extractRoutes = (route) => {
    return {
        route: route?.route?.path,
        method: route?.route?.stack[0]?.method
    }
}

export const getRouteList = (app) => {
    const server = app.getHttpServer();
    const router = server._events.request._router;
    const routesRegistrated = router.stack
        .map(extractRoutes)
        .filter(fliterUndefined)
        .filter(filterSwagger)

    return routesRegistrated;
} 