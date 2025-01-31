import user from './user.js'
import contact from './contact.js'

// Array of routes to be used in the app
const routes = [
    {
        path: '/user',
        route: user
    },
    {
        path: '/contact',
        route: contact
    }
]

export default routes;