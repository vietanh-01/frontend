import logomini from '../../assest/images/logomini.svg'
import { useState, useEffect } from 'react'
import { Parser } from "html-to-react";
import ReactPaginate from 'react-paginate';
import {toast } from 'react-toastify';
import Select from 'react-select';
import {getMethod, postMethod, deleteMethod} from '../../services/request';
import Swal from 'sweetalert2'
import { formatPrice } from '../../services/money';

function TinYeuThich(){
    const [items, setItems] = useState([]);
    useEffect(()=>{
        const getPay = async() =>{
            var response = await getMethod('/api/favorite/all/my-favorite')
            var result = await response.json();
            setItems(result)
        };
        getPay();
    }, []);

    async function deleteFavorite(id) {
        var con = window.confirm("Xác nhận xóa tin yêu thích?")
        if(con == false){
            return;
        }
        var response = await deleteMethod("/api/favorite/all/delete?id="+id)
        if(response.status < 300){
            toast.success("Xóa tin yêu thích thành công");
            var response = await getMethod('/api/favorite/all/my-favorite')
            var result = await response.json();
            setItems(result)
        }
        else{
            toast.error("Có lỗi xảy ra")
        }
    }
  
    return(
        <>
             <div class="blockcontent">
                <h3>Tin đã lưu</h3>
                <div class="ghichuql">
                    <p></p>
                </div>
                <div class="table-responsive divtale">
                    <table class="table table-bordered table-striped" width="100%">
                        <thead>
                            <tr>
                                <th class="nowrap">Mã tin</th>
                                <th class="nowrap">Tin đăng</th>
                                <th class="nowrap">Địa chỉ</th>
                                <th class="nowrap">Giá</th>
                                <th class="nowrap">Xóa</th>
                            </tr>
                        </thead>
                        <tbody id="listhistory">
                            {items.map((item=>{
                                return <tr>
                                    <td>{item.id}</td>
                                    <td><a target='_blank' href={'chi-tiet-tin-dang?id='+item.realEstate.id} className='pointer'>{item.realEstate.title}</a></td>
                                    <td>{item.realEstate.wards.name} / {item.realEstate.wards.districts.name} / {item.realEstate.wards.districts.province.name}</td>
                                    <td>{formatPrice(item.realEstate.price)}</td>
                                    <td><button onClick={()=>deleteFavorite(item.id)} className='btn btn-primary'><i className='fa fa-remove'></i></button></td>
                                </tr>
                            }))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}

export default TinYeuThich;
