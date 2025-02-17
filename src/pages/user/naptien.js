import logomini from '../../assest/images/logomini.svg'
import { useState, useEffect } from 'react'
import { Parser } from "html-to-react";
import ReactPaginate from 'react-paginate';
import {toast } from 'react-toastify';
import Select from 'react-select';
import {getMethod, postMethod, postMethodPayload} from '../../services/request';
import Swal from 'sweetalert2'
import { formatMoney } from '../../services/money';
import { useLocation, Link } from 'react-router-dom';

async function khoiTaoLink(event) {
    event.preventDefault();
    var tien =  document.getElementById("inputmoney").value;
    tien =  tien.replace(".", "");
    if(isNaN(tien)){
        alert("input không được chứa kí tự đặc biệt")
        return;
    }
    const baseUrl = window.location.protocol+"//"+window.location.host
    var returnurl = baseUrl+'/thanhcong';
    var payload = {
        "amount":tien,
        "content":"Nạp tiền website batdongsan",
        "returnUrl":returnurl,
        "notifyUrl":returnurl
    }
    const res = await postMethodPayload('/api/payment/all/create-url', payload);
    if(res.status < 300){
        var urlReturn = await res.json();
        window.open(urlReturn.url, '_blank');
    }
    else{
        toast.error("Tạo link thanh toán thất bại")
    }
};

function NapTien(){
    const [user, setUser] = useState({});
    useEffect(()=>{
        const getUser = async() =>{
            var response = await postMethod("/api/user/user/user-logged")
            var result = await response.json();
            setUser(result)
          };
          getUser();
    }, []);

    function setTien(e){
        var tien = e.target.value
        document.getElementById("inputmoney").value = tien
    }
  
    return(
        <>
             <div class="blockcontent">
                <h3>Nạp tiền vào tài khoản</h3>
                <hr/>
                <div class="row">
                    <div class="col-sm-9">
                        <p style={{fontSize:"20px"}}>Chọn số tiền cần nạp</p>
                        <p style={{fontSize:"14px"}}>Chọn nhanh số tiền cần nạp</p>
                        <div class="row">
                            <div class="col-md-2">
                                <input onClick={(e)=>setTien(e)} id="50" type="radio" value="50.000" name="chontien"/>
                                <label for="50" class="pointer text-black">50.000đ</label>
                            </div>
                            <div class="col-md-2">
                                <input onClick={(e)=>setTien(e)} id="100" type="radio" value="100.000" name="chontien"/>
                                <label for="100" class="pointer text-black">100.000đ</label>
                            </div>
                            <div class="col-md-2">
                                <input onClick={(e)=>setTien(e)} id="200" type="radio" value="200.000" name="chontien"/>
                                <label for="200" class="pointer text-black">200.000đ</label>
                            </div>
                            <div class="col-md-2">
                                <input onClick={(e)=>setTien(e)} id="500" type="radio" value="500.000" name="chontien"/>
                                <label for="500" class="pointer text-black">500.000đ</label>
                            </div>
                            <div class="col-md-2">
                                <input onClick={(e)=>setTien(e)} id="1000" type="radio" value="1000.000" name="chontien"/>
                                <label for="1000" class="pointer text-black">1000.000đ</label>
                            </div>
                            <div class="col-md-2">
                                <input onClick={(e)=>setTien(e)} id="2000" type="radio" value="2000.000" name="chontien"/>
                                <label for="2000" class="pointer text-black">2000.000đ</label>
                            </div>
                        </div><br/>
                        <p>Hoặc nhập số tiền cần nạp</p>
                        <input id="inputmoney" style={{height:"30px"}} value="50.000"/><span class="vndinput"> VNĐ</span><br/>
                        <br/><button onClick={khoiTaoLink} class="btn btn-primary btntieptuc">Tiếp tục</button><br/><br/>
                        <div class="ghichuql">
                            <p>Lưu ý quan trọng: Trong quá trình thanh toán, bạn vui lòng KHÔNG ĐÓNG TRÌNH DUYỆT.</p>
                            <p>Nếu gặp khó khăn trong quá trình thanh toán, xin liên hệ 0917686101 để chúng tôi hỗ trợ bạn.</p>
                        </div>
                    </div>
                    <div class="col-sm-3">
                        <div class="divsodu">
                            <p>Số dư tài khoản</p>
                            <strong id="sodu" class="btntiencon">{formatMoney(user?.amount)}</strong>
                        </div><br/>
                        <a href="lichsunap" class="btn btn-secondary form-control">Lịch sử nạp tiền</a>
                    </div>
                </div>
            </div>
        </>
    );
}

export default NapTien;
