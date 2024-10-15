import lich from '../../assest/images/lich.png'
import avatar from '../../assest/images/user.svg'
import { useState, useEffect } from 'react'
import { useLocation, Link } from 'react-router-dom';
function Header({ children }){
     // Ensure useLocation is called at the top level of the component
     const location = useLocation();

     // Function to check if the current path matches the given pathname
     const isActive = (pathname) => {
         return location.pathname === pathname ? 'activenavbar' : '';
     };
     
    const [isCssLoaded, setCssLoaded] = useState(false);
    useEffect(()=>{
        import('../admin/layout.scss').then(() => setCssLoaded(true));
    }, []);
    if (!isCssLoaded) {
        return <></>
    }


    function openClose(){
        document.getElementById("sidebar").classList.toggle("toggled");
        document.getElementById("page-content-wrapper").classList.toggle("toggled");
        document.getElementById("navbarmain").classList.toggle("navbarmainrom");
    }

    return(
        <div class="d-flex" id="wrapper">
        <nav id="sidebar" class="bg-dark">
            <div class="sidebar-header p-3 text-white">
                <h3>Admin <i class="fa fa-bars pointer" id="iconbaradmin" onClick={openClose}></i></h3> 
            </div>
            <ul class="list-unstyled components">
                <li className={isActive("/admin/index")}>
                    <a href="index" class="text-white text-decoration-none">
                        <i class="fa fa-home"></i> Trang chủ
                    </a>
                </li>
                <li className={isActive("/admin/user")}>
                    <a href="#coltaikhoan" data-bs-toggle="collapse" aria-expanded="false" class="dropdown-toggle text-white text-decoration-none">
                        <i class="fa fa-user"></i> Tài khoản
                    </a>
                    <ul class="collapse list-unstyleds" id="coltaikhoan">
                        <li class="nav-item">
                            <a href="user" class="text-white text-decoration-none ps-4"><i class="fa fa-list"></i> Danh sách tài khoản</a>
                        </li>
                        <li class="nav-item">
                            <a href="#" class="text-white text-decoration-none ps-4"><i class="fa fa-plus"></i> Thêm tài khoản</a>
                        </li>
                    </ul>
                </li>
                <li class="nav-item">
                    <a href="#colbaiviet" data-bs-toggle="collapse" aria-expanded="false" class="dropdown-toggle text-white text-decoration-none">
                        <i class="fa fa-newspaper"></i> Bài viết
                    </a>
                    <ul class="collapse list-unstyleds" id="colbaiviet">
                        <li class="nav-item">
                            <a href="#" class="text-white text-decoration-none ps-4"><i class="fa fa-list"></i> Danh sách tin đăng</a>
                        </li>
                        <li class="nav-item">
                            <a href="#" class="text-white text-decoration-none ps-4"><i class="fa fa-plus"></i> Thêm bài viết</a>
                        </li>
                    </ul>
                </li>
                <li className={isActive("/admin/category")}>
                    <a href="category" class="text-white text-decoration-none">
                        <i class="fa fa-list"></i> Danh mục
                    </a>
                </li>
                <li class="nav-item">
                    <a href="#dashboardSubmenu" data-bs-toggle="collapse" aria-expanded="false" class="dropdown-toggle text-white text-decoration-none">
                        <i class="fa fa-home"></i> Tin đăng BĐS
                    </a>
                    <ul class="collapse list-unstyleds" id="dashboardSubmenu">
                        <li class="nav-item">
                            <a href="#" class="text-white text-decoration-none ps-4"><i class="fa fa-list"></i> Danh sách tin đăng</a>
                        </li>
                        <li class="nav-item">
                            <a href="#" class="text-white text-decoration-none ps-4"><i class="fa fa-plus"></i> Đăng tin</a>
                        </li>
                    </ul>
                </li>
                <li class="nav-item">
                    <a href="#dashboardSubmenu1" data-bs-toggle="collapse" aria-expanded="false" class="dropdown-toggle text-white text-decoration-none">
                        <i class="fa-solid fa-chart-line"></i> Thống kê
                    </a>
                    <ul class="collapse list-unstyleds" id="dashboardSubmenu1">
                        <li class="nav-item">
                            <a href="#" class="text-white text-decoration-none ps-4"><i class="fa fa-clock"></i> Lịch sử nạp tiền</a>
                        </li>
                        <li class="nav-item">
                            <a href="#" class="text-white text-decoration-none ps-4"><i class="fa fa-clock"></i> Lịch sử trừ tiền</a>
                        </li>
                        <li class="nav-item">
                            <a href="#" class="text-white text-decoration-none ps-4"><i class="fa fa-chart-line"></i> Doanh thu năm</a>
                        </li>
                    </ul>
                </li>
                <li>
                    <a href="#eCommerce" class="text-white text-decoration-none">
                        <i class="fa fa-sign-out"></i> Đăng xuất
                    </a>
                </li>
            </ul>
        </nav>

        <div id="page-content-wrapper" class="w-100">
            <nav id='navbarmain' class="navbar navbar-expand-lg navbar-light bg-light border-bottom">
                <div class="container-fluid">
                    <button class="btn btn-link" id="menu-toggle"><i class="fas fa-bars" onClick={openClose}></i></button>
                    <div class="dropdown ms-auto">
                        <a class="nav-link dropdown-toggle position-relative" href="#" role="button" id="notificationDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                            <i class="fa-solid fa-bell"></i>
                            <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                                4
                            </span>
                        </a>
                        <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="notificationDropdown">
                            <li><a class="dropdown-item" href="#">New comment on your post</a></li>
                            <li><a class="dropdown-item" href="#">New user registered</a></li>
                            <li><a class="dropdown-item" href="#">System update available</a></li>
                            <li><hr class="dropdown-divider"/></li>
                            <li><a class="dropdown-item" href="#">View all notifications</a></li>
                        </ul>
                    </div>
            
                    <div class="dropdown ms-3">
                        <a class="dropdown-toggle d-flex align-items-center text-decoration-none" href="#" role="button" id="userDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                            <span class="navbar-text me-2">Thomas Anree</span>
                            <img src="https://via.placeholder.com/30" class="rounded-circle" alt="User Avatar"/>
                        </a>
                        <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
                            <li><a class="dropdown-item" href="#">Update Info</a></li>
                            <li><a class="dropdown-item" href="#">Logout</a></li>
                        </ul>
                    </div>
                </div>
            </nav>
            <div class="container-fluid py-4" id='mainpageadmin'>
                {children}
            </div>
        </div>
    </div>
    );
}

async function checkAdmin(){
    var token = localStorage.getItem("token");
    var url = 'http://localhost:8080/api/admin/check-role-admin';
    const response = await fetch(url, {
        headers: new Headers({
            'Authorization': 'Bearer ' + token
        })
    });
    if (response.status > 300) {
        window.location.replace('../login')
    }
}


function logout(){
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.replace('../login')
}

export default Header;