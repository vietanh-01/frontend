import layoutAdmin from '../layout/admin/Layout'
import layoutLogin from '../layout/user/loginlayout/login'

//admin
import homeAdmin from '../pages/admin/index'
import userAdmin from '../pages/admin/user'
import AdminCategory from '../pages/admin/category'



//public
import login from '../pages/public/login'
import index from '../pages/public/index'

//user
import taikhoan from '../pages/user/taikhoan'



const publicRoutes = [
    { path: "/", component: index},
    { path: "/index", component: index},
    { path: "/login", component: login, layout: layoutLogin },
];

const userRoutes = [
    { path: "/tai-khoan", component: taikhoan },
];


const adminRoutes = [
    { path: "/admin/index", component: homeAdmin, layout: layoutAdmin },
    { path: "/admin/user", component: userAdmin, layout: layoutAdmin },
    { path: "/admin/category", component: AdminCategory, layout: layoutAdmin },
];



export { publicRoutes, adminRoutes, userRoutes};
