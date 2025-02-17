import logo from '../../../assest/images/logo.png';
import { useState, useEffect } from 'react'
import React, { createContext, useContext } from 'react';
import {getMethod, postMethod} from "../../../services/request"
import {formatMoney} from "../../../services/money"

export const HeaderContext = createContext();


var token = localStorage.getItem("token");
function SideBar (){
  const [user, setUser] = useState({});
  const [address, setAddress] = useState([]);
  const [totalRealEstate, setTotalRealEstate] = useState(0);
  useEffect(()=>{
    const getUser = async() =>{
      var response = await postMethod("/api/user/user/user-logged")
      var result = await response.json();
      setUser(result)
    };
    getUser();
    const getTotal = async() =>{
      var response = await getMethod("/api/real-estate/user/count-real-estate")
      var result = await response.text();
      setTotalRealEstate(result)
    };
    getTotal();
  }, []);

  import('../styles/styleuser.scss');

  function logout(){
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.replace('login')
  }

  

return(
  <>
  <div class="thongtintaikhoan">
    <img src={user.avatar} id="avatartaikhoan" class="usertaikhoan"/>
    <span class="usernametaikhoan" id="usernametaikhoan">{user.fullname == null?user.username:user.fullname}</span>
    <div class="chitiettttaikhoan">
        <span class="sodutk">Số dư: <span class="tongsodu" id="tongsodu">{formatMoney(user.amount)}</span></span>
        <span class="sodutk">Tin đăng: <span class="tongsodu" id="sotindang">{totalRealEstate} tin</span></span>
        <span class="sodutk">Mã TK: <span class="tongsodu" id="mataikhoan">{user.id}</span></span>
        <button class="btnnaptien" onClick={()=>window.location.href='naptien'}>Nạp tiền</button>
    </div>
  </div>
  <ul class="nav nav-pills flex-column mb-sm-auto mb-0 align-items-center align-items-sm-start">
    <li>
        <a href="#submenu3" data-bs-toggle="collapse" class="nav-link">
            <i class="fa fa-list"></i> Quản lý tin đăng <i class="fas fa-chevron-down iconsmall"></i></a>
        <ul class="collapse flex-column" id="submenu3" data-bs-parent="#menu">
            <li><a href="tincuatoi" class="nav-link"> Tin đăng</a></li>
            <li><a href="yeuthich" class="nav-link"> Tin yêu thích</a></li>
            <li><a href="dangtin" class="nav-link"> Đăng tin</a></li>
        </ul>
    </li>
    <li>
        <a href="#lichsugd" data-bs-toggle="collapse" class="nav-link">
            <i class="fa fa-history"></i> Lịch sử giao dịch <i class="fas fa-chevron-down iconsmall"></i></a>
        <ul class="collapse flex-column" id="lichsugd" data-bs-parent="#lichsugd">
            <li><a href="lichsunap" class="nav-link"> Lịch sử nạp</a></li>
            <li><a href="lichsutru" class="nav-link"> Lịch sử trừ tiền</a></li>
        </ul>
    </li>
    <li>
        <a href="#taikhoan" data-bs-toggle="collapse" class="nav-link">
            <i class="fa fa-user"></i> Tài khoản <i class="fas fa-chevron-down iconsmall"></i></a>
        <ul class="collapse flex-column" id="taikhoan" data-bs-parent="#taikhoan">
            <li><a href="taikhoan" class="nav-link"> Tài khoản</a></li>
            <li><a href="doimatkhau" class="nav-link"> Đổi mật khẩu</a></li>
            <li><a href="#" onClick={logout} class="nav-link"> Đăng xuất</a></li>
        </ul>
    </li>
    <li><a href="chat" class="nav-link"><i class="fas fa-message"></i> Chat</a></li>
    <li><a href="baogia" class="nav-link"><i class="fas fa-dollar-sign"></i> Báo giá</a></li>
    <li><a href="huongdan" class="nav-link"><i class="fa fa-newspaper"></i> Hướng dẫn</a></li>
  </ul>
  </>
);

    
}

export default SideBar;