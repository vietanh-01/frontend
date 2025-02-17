import { useState, useEffect } from 'react'
import ReactPaginate from 'react-paginate';
import {toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getMethod ,deleteMethod} from '../../services/request';
import Swal from 'sweetalert2';
import {formatMoney} from '../../services/money';
import UserInforModal from '../admin/userinformodal';

var token = localStorage.getItem("token");


var size = 10;
var url = '';
const AdminDeductionHistory = ()=>{
    const [items, setItems] = useState([]);
    const [itemUser, setItemUser] = useState([]);
    const [pageCount, setpageCount] = useState(0);
    const [user, setUser] = useState({});


    useEffect(()=>{
        const getHistoryPay= async() =>{
            var response = await getMethod('/api/deduction-history/admin/all-DeductionHistory?size='+size+'&sort=id,desc&page='+0);
            var result = await response.json();
            setItems(result.content)
            setpageCount(result.totalPages)
            url = '/api/deduction-history/admin/all-DeductionHistory?size='+size+'&sort=id,desc&page='
        };
        getHistoryPay();
    }, []);



    const handlePageClick = async (data)=>{
        var currentPage = data.selected
        var response = await getMethod(url+currentPage)
        var result = await response.json();
        setItems(result.content)
        setpageCount(result.totalPages)
    }

    async function search() {
        var search = document.getElementById("inputsearch").value
        var from = document.getElementById("from").value
        var to = document.getElementById("to").value
        var ls = '/api/deduction-history/admin/all-DeductionHistory?size='+size+'&search='+search+'&sort=id,desc';
        if(from != "" && to != ""){
            ls += '&start='+from+'&end='+to
        }
        ls += '&page='
        url = ls
        var response = await getMethod(ls+0);
        var result = await response.json();
        setItems(result.content)
        setpageCount(result.totalPages)
    }

    const getHistoryPayUser= async(user) =>{
        var response = await getMethod('/api/deduction-history/admin/find-DeductionHistory-by-user?userId='+user.id);
        var result = await response.json();
        setItemUser(result)
    };

    return (
        <>
            <div class="headerpageadmin d-flex justify-content-between align-items-center p-3 bg-light border">
                <strong class="text-left"><i className='fa fa-users'></i> Quản Lý Lịch Sử Trừ Tiền</strong>
                <div class="search-wrapper d-flex align-items-center">
                    <div className='searchdivadmin'>
                        <i className='fa fa-search'></i>
                        <input id='inputsearch' placeholder='Nhập email hoặc tên đăng nhập'/>
                    </div>
                    <div className='d-flex divngayadmin'>
                        <label>Từ ngày: </label><input id='from' type='date' className=''/>
                    </div>
                    <div className='d-flex divngayadmin'>
                        <label>Đến ngày: </label><input id='to' type='date' className=''/>
                    </div>
                    <button onClick={()=>search()} className='btn-search-header'>Lọc</button>
                </div>
            </div>
            <div class="tablediv">
                <div class="headertable">
                    <span class="lbtable">Danh sách lịch sử trừ tiền</span>
                </div>
                <div class="divcontenttable">
                    <table class="table table-bordered">
                        <thead>
                            <tr>
                                <th>Id</th>
                                <th>Tiền trừ</th>
                                <th>Mã tin</th>
                                <th>Tiêu đề tin</th>
                                <th>Thời gian trừ</th>
                                <th>User</th>
                                <th class="sticky-col">Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((item=>{
                                    return  <tr>
                                    <td>{item.id}</td>
                                    <td>{formatMoney(item.deductedAmount)}</td>
                                    <td>{item.realEstateId}</td>
                                    <td>{item.realEstateTitle}</td>
                                    <td>{item.createdTime}, {item.createdDate}</td>
                                    <td data-bs-toggle="modal" data-bs-target="#chiTietUser" onClick={()=>setUser(item.user)} className='pointer blue-text'>{item.user.username}</td>
                                    <td class="sticky-col">
                                        <button onClick={()=>getHistoryPayUser(item.user)} data-bs-toggle="modal" data-bs-target="#listHistory" class="edit-btn">Chi tiết</button>
                                    </td>
                                </tr>
                            }))}
                        </tbody>
                    </table>
                    <ReactPaginate 
                        marginPagesDisplayed={2} 
                        pageCount={pageCount} 
                        onPageChange={handlePageClick}
                        containerClassName={'pagination'} 
                        pageClassName={'page-item'} 
                        pageLinkClassName={'page-link'}
                        previousClassName='page-item'
                        previousLinkClassName='page-link'
                        nextClassName='page-item'
                        nextLinkClassName='page-link'
                        breakClassName='page-item'
                        breakLinkClassName='page-link' 
                        previousLabel='Trang trước'
                        nextLabel='Trang sau'
                        activeClassName='active'/>
                </div>
            </div>
            <UserInforModal user={user} />

            <div class="modal fade" id="listHistory" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="false">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLabel">Danh sách nạp</h5> <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button></div>
                        <div class="modal-body row">
                            <table class="table table-bordered">
                                <thead>
                                    <tr>
                                        <th>Id</th>
                                        <th>Tiền trừ</th>
                                        <th>Mã tin</th>
                                        <th>Tiêu đề tin</th>
                                        <th>Thời gian trừ</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {itemUser.map((item=>{
                                            return  <tr>
                                            <td>{item.id}</td>
                                            <td>{formatMoney(item.deductedAmount)}</td>
                                            <td>{item.realEstateId}</td>
                                            <td>{item.realEstateTitle}</td>
                                            <td>{item.createdTime}, {item.createdDate}</td>
                                        </tr>
                                    }))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default AdminDeductionHistory;