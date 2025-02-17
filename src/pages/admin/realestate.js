import { useState, useEffect } from 'react'
import ReactPaginate from 'react-paginate';
import {toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import $ from 'jquery'; 
import Swal from 'sweetalert2'
import {getMethod,postMethodPayload, postMethod, deleteMethod} from '../../services/request';
import {formatMoney, formatPrice} from '../../services/money';


var size = 10
var url = '';
const AdminRealEstate = ()=>{
    const [items, setItems] = useState([]);
    const [pageCount, setpageCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);

    useEffect(()=>{
        const getBds = async() =>{
            var response = await getMethod('/api/real-estate/admin/all?&size='+size+'&sort=id,desc&page='+0)
            var result = await response.json();
            setItems(result.content)
            setpageCount(result.totalPages)
            url = '/api/real-estate/admin/all?&size='+size+'&sort=id,desc&page='
        };
        getBds();
    }, []);


    async function filterBds(){
        var status = document.getElementById("trangthai").value
        var curUrl = '/api/real-estate/admin/all?&size='+size+'&sort=id,desc&status='+status+'&page=';
        if(status == ""){
            curUrl = '/api/real-estate/admin/all?&size='+size+'&sort=id,desc&page=';
        }
        var response = await getMethod(curUrl+0)
        var result = await response.json();
        setItems(result.content)
        setpageCount(result.totalPages)
        url = curUrl;
    }

    const handlePageClick = async (data)=>{
        var currentPage = data.selected
        var response = await getMethod(url+currentPage)
        var result = await response.json();
        setItems(result.content)
        setpageCount(result.totalPages)
        setCurrentPage(currentPage);
    }

    async function deleteRealEstate(id) {
        var con = window.confirm("Xác nhận hành động?");
        if (con == false) {
            return;
        }
        var response = await deleteMethod('/api/real-estate/admin/delete?id=' + id)
        if (response.status < 300) {
            toast.success("Xóa thành công");
            loadBdsCurrentPage();
        } else {
            toast.error("Thất bại");
        }
    }

    async function loadBdsCurrentPage() {
        var response = await getMethod(url+currentPage)
        var result = await response.json();
        setItems(result.content)
        setpageCount(result.totalPages)
    }
    

    async function updateAccuracy(e, id) {
        const stt = e.target.checked;
        var check = window.confirm("Xác nhận cập nhật xác thực");
        if(check == false){
            e.target.checked == true?e.target.checked=false:e.target.checked=true
            return;
        }
        const response = await postMethod('/api/real-estate/admin/accuracy?id=' + id)
        if (response.status < 300) {
            toast.success("Thành công");
            loadBdsCurrentPage();
        } else {
            toast.error("Thất bại");
        }
    }

    async function updateStatus(e, id) {
        const response = await postMethod('/api/real-estate/admin/update-status?id=' + id+'&status='+e.target.value)
        if (response.status < 300) {
            toast.success("Thành công");
            loadBdsCurrentPage();
        } else {
            toast.error("Thất bại");
        }
    }
    
    return (
        <>
            <div class="headerpageadmin d-flex justify-content-between align-items-center p-3 bg-light border">
                <strong class="text-left"><i className='fa fa-users'></i> Quản Lý Bất Động Sản</strong>
                <div class="search-wrapper d-flex align-items-center">
                    <div class="search-container">
                        <select onChange={filterBds} id='trangthai' class="form-control">
                            <option value="">Tất cả trạng thái</option>
                            <option value='VI_PHAM'>Vi Phạm</option>
                            <option value='DANG_HIEN_THI'>Đang hiển thị</option>
                        </select>
                    </div>
                    <button data-bs-toggle="modal" data-bs-target="#addtk" class="btn btn-primary ms-2"><i className='fa fa-plus'></i></button>
                </div>
            </div>
            <div class="tablediv">
                <div class="headertable">
                    <span class="lbtable">Danh sách bất động sản</span>
                </div>
                <div class="divcontenttable">
                    <table id="example" class="table table-bordered">
                        <thead>
                            <tr>
                                <th>Id</th>
                                <th>Ảnh</th>
                                <th>Tiêu đề</th>
                                <th>Ngày tạo</th>
                                <th>Ngày hết hạn</th>
                                <th>Giá tiền</th>
                                <th>Pháp lý</th>
                                <th>Địa chỉ</th>
                                <th>Danh mục</th>
                                <th>Trạng thái</th>
                                <th>Xác thực</th>
                                <th style={{minWidth:'120px'}}>Chức năng</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((item=>{
                                return  <tr>
                                    <td>{item.id}</td>
                                    <td><img src={item.image} className='imgtable'/></td>
                                    <td><a target='_blank' href={'/chi-tiet-tin-dang?id='+item.id} className='pointer'>{item.title}</a></td>
                                    <td>{item.createdTime}, {item.createdDate}</td>
                                    <td>{item.expiredDate}</td>
                                    <td>{formatPrice(item.price)}</td>
                                    <td>{item.juridical?.name}</td>
                                    <td>{item.wards?.name}<br/>{item.wards?.districts.name}<br/>{item.wards?.districts.province.name}</td>
                                    <td>{
                                        item.realEstateCategories.map((recategory=>{
                                            return <span>{recategory.category.name}<br/></span>
                                        }))
                                        }
                                    </td>
                                    <td>
                                        <select onChange={(e)=>updateStatus(e, item.id)} className='form-control' style={{minWidth:'100px'}}>
                                            <option value='VI_PHAM' selected={item.status =='VI_PHAM'}>Vi Phạm</option>
                                            <option value='DANG_HIEN_THI' selected={item.status =='DANG_HIEN_THI'}>Đang hiển thị</option>
                                        </select>
                                    </td>
                                    <td>
                                        <label class="checkbox-custom"> 
                                            <input checked={item.accuracy} id="primaryBlog" type="checkbox" onChange={(e)=>updateAccuracy(e, item.id)}/>
                                            <span class="checkmark-checkbox"></span>
                                        </label>
                                    </td>
                                    <td class="sticky-col">
                                        <button onClick={()=>deleteRealEstate(item.id)} class="delete-btn"><i className='fa fa-trash'></i></button>
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

        </>
    );
}

export default AdminRealEstate;