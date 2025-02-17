import logomini from '../../assest/images/logomini.svg'
import { useState, useEffect } from 'react'
import { Parser } from "html-to-react";
import ReactPaginate from 'react-paginate';
import {toast } from 'react-toastify';
import Select from 'react-select';
import {getMethod, postMethod, postMethodPayload} from '../../services/request';
import Swal from 'sweetalert2'
import { formatMoney } from '../../services/money';

function LichSuNap(){
    const [items, setItems] = useState([]);
    useEffect(()=>{
        const getPay = async() =>{
            var response = await getMethod('/api/history-pay/all/my-history-pay')
            var result = await response.json();
            setItems(result)
        };
        getPay();
    }, []);
  
    return(
        <>
             <div class="blockcontent">
                <h3>Lịch sử nạp tiền</h3>
                <div class="ghichuql">
                    <p>Nếu bạn đã nạp tiền mà chưa được xác nhận trong hệ thống, hãy liên hệ với chúng tôi</p>
                    <a href="lienhe">Liên hệ</a>
                </div>
                <div class="table-responsive divtale">
                    <table class="table table-bordered table-striped" width="100%">
                        <thead>
                            <tr>
                                <th class="nowrap">Ngày nạp</th>
                                <th class="nowrap">Mã giao dịch</th>
                                <th class="nowrap">Phương thức</th>
                                <th class="nowrap">Số tiền</th>
                                <th class="nowrap">Trạng thái</th>
                            </tr>
                        </thead>
                        <tbody id="listhistory">
                            {items.map((item=>{
                                return <tr>
                                    <td>{item.createdTime}, {item.createdDate}</td>
                                    <td>{item.requestId}</td>
                                    <td>{item.payType}</td>
                                    <td>{formatMoney(item.totalAmount)}</td>
                                    <td>Đã thanh toán</td>
                                </tr>
                            }))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}

export default LichSuNap;
