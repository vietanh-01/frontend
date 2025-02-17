import logomini from '../../assest/images/logomini.svg'
import { useState, useEffect } from 'react'
import { Parser } from "html-to-react";
import ReactPaginate from 'react-paginate';
import {toast } from 'react-toastify';
import Select from 'react-select';
import {getMethod, postMethod, deleteMethod} from '../../services/request';
import Swal from 'sweetalert2'
import { formatPrice } from '../../services/money';

var size = 10
var url = '';
function TinCuaToi(){
    const [items, setItems] = useState([]);
    const [pageCount, setpageCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);
    const [selectedDay, setSelectedDay] = useState(null);
    const [extendedDate, setExtendedDate] = useState("Chưa chọn");
    const [realestate, setRealestate] = useState({});
  
    useEffect(()=>{
        const getBds = async() =>{
            var response = await getMethod('/api/real-estate/all/my-real-estate?&size='+size+'&sort=id,desc&page='+0)
            var result = await response.json();
            setItems(result.content)
            setpageCount(result.totalPages)
            url = '/api/real-estate/all/my-real-estate?&size='+size+'&sort=id,desc&page='
        };
        getBds();
    }, []);

    
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
        var response = await deleteMethod('/api/real-estate/all/delete?id=' + id)
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

    async function filterBds(){
        var status = document.getElementById("trangthai").value
        var curUrl = '/api/real-estate/all/my-real-estate?&size='+size+'&sort=id,desc&status='+status+'&page=';
        if(status == ""){
            curUrl = '/api/real-estate/all/my-real-estate?&size='+size+'&sort=id,desc&page=';
        }
        var response = await getMethod(curUrl+0)
        var result = await response.json();
        setItems(result.content)
        setpageCount(result.totalPages)
        url = curUrl;
    }

    const handleRadioChange = (day) => {
        setSelectedDay(day);
    
        // Tính ngày gia hạn
        const currentDate = new Date(realestate.expiredDate);
        
        currentDate.setDate(currentDate.getDate() + day);
        setExtendedDate(currentDate.toLocaleDateString());
    };
    
    async function extendDay() {
        if(selectedDay == null){
            toast.warning("Hãy chọn số ngày muốn gia hạn");
            return;
        }
        var response = await postMethod("/api/real-estate/user/extend-expired-date?id="+realestate.id+'&numDay='+selectedDay)
        if(response.status < 300){
            Swal.fire({
                title: "Thông báo",
                text: "Gia hạn tin thành công",
                preConfirm: () => {
                    window.location.reload();
                }
            });
        }
        else{
            if(response.status == 417){
                var result = await response.json();
                toast.error(result.defaultMessage)
            }
            else{
                toast.error("Có lỗi xảy ra")
            }
        }
    }

    return(
        <>
             <div class="blockcontent">
                <h3>Bất Động Sản Đã Đăng</h3>
                {/* <div class="ghichuql">
                    <p>Nếu bạn đã nạp tiền mà chưa được xác nhận trong hệ thống, hãy liên hệ với chúng tôi</p>
                    <a href="lienhe">Liên hệ</a>
                </div> */}
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
                    <a href='dangtin' class="btn btn-primary ms-2"><i className='fa fa-plus'></i></a>
                </div>
            </div>
                <div class="table-responsive divtale">
                    <table class="table table-bordered table-striped" width="100%">
                        <thead>
                            <tr>
                                <th>Mã tin</th>
                                <th>Ảnh</th>
                                <th>Tiêu đề</th>
                                <th>Giá</th>
                                <th>Ngày đăng</th>
                                <th>Ngày hết hạn</th>
                                <th>Trạng thái</th>
                                <th className='sticcol'>Chức năng</th>
                            </tr>
                        </thead>
                        <tbody id="listhistory">
                            {items.map((item=>{
                                return <tr>
                                    <td>{item.id}</td>
                                    <td><img className='imgtable' src={item.image}/></td>
                                    <td><a className='pointer' target='_blank' href={'chi-tiet-tin-dang?id='+item.id}>{item.title}</a></td>
                                    <td>{formatPrice(item.price)}</td>
                                    <td>{item.createdTime}, {item.createdDate}</td>
                                    <td>{item.expiredDate}<br/><a onClick={()=>setRealestate(item)} data-bs-toggle="modal" data-bs-target="#staticBackdrop" href='#'>Gia hạn</a></td>
                                    <td>{item.status}</td>
                                    <td className='sticcol'>
                                        <a href={"dangtin?id="+item.id} class="edit-btn"><i className='fa fa-edit'></i></a>
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
            <div class="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="staticBackdropLabel">Gia hạn tin đăng</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                    <div className="">
                        <h4>Gia hạn thêm ngày</h4>
                        <span>Gia hạn 7 ngày bạn sẽ mất 30.000đ, 14 ngày sẽ mất 60.000đ,...</span>
                        <div className="btn-group-toggle">
                            {[7, 14, 21, 28].map((day) => (
                            <label
                                key={day}
                                className={`btn btn-outline-primary custom-radio-btn ${
                                selectedDay === day ? "active" : ""
                                }`}
                            >
                                <input
                                type="radio"
                                name="days"
                                checked={selectedDay === day}
                                onChange={() => handleRadioChange(day)}
                                autoComplete="off"
                                />
                                {day} ngày
                                <span className="checkmark">✔</span>
                            </label>
                            ))}
                        </div>
                        <div className="mt-3">
                            <p>Ngày hết hạn: <span id="extended-date">{extendedDate}</span></p>
                        </div>
                    </div>
                    </div>
                    <div class="modal-footer">
                        <button onClick={extendDay} type="button" class="btn btn-primary">Đồng ý</button>
                    </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default TinCuaToi;
