import { useState, useEffect } from 'react'
import { Parser } from "html-to-react";
import ReactPaginate from 'react-paginate';
import {toast } from 'react-toastify';
import Select from 'react-select';
import {getMethod, postMethod, postMethodPayload} from '../../services/request';
import Swal from 'sweetalert2'


function ReportRealEstate(){
    const [noiDungPhanHoi, setNoiDungPhanHoi] = useState(["Địa chỉ không đúng","Giá bán không đúng","Trùng với tin rao khác","Không liên lạc được"
        ,"Tin không có thật", "Bất động sản đã bán"
    ]);
    const [selectedNoiDung, setSelectedNoiDung] = useState([]);
    useEffect(()=>{
    }, []);

    
    const setListCate = (selectedOptions) => {
        setSelectedNoiDung(selectedOptions);
    };

    const options = noiDungPhanHoi.map((item) => ({
        label: item,
        value: item
    }));

    async function guiBaoCao() {
        var uls = new URL(document.URL)
        var id = uls.searchParams.get("id");
        console.log(selectedNoiDung);
        var arr = []
        for(var i=0; i< selectedNoiDung.length; i++){
            arr.push(selectedNoiDung[i].label)
        }
        var report = {
            "content": document.getElementById("phanhoikhac").value,
            "fullName":document.getElementById("fullname").value,
            "email":document.getElementById("email").value,
            "phone":document.getElementById("phone").value,
            "reason":arr.join(', '),
            "realEstate":{
                "id":id
            },
        }
    
        const response = await postMethodPayload('/api/report/public/add',report)
        if(response.status < 300){
            Swal.fire({
                title: "Thông báo",
                text: "Gửi báo cáo thành công",
                preConfirm: () => {
                    window.location.reload();
                }
            });
        }
        else{
            toast.error("Gửi thất bại")
        }
    }
  
    return(
        <>
            <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">Báo cáo tin rao có thông tin không đúng</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body modalphanhoi">
                        <label class="lbphanhoi">Chọn nội dung phản hồi</label>
                        <Select
                            className="select-container" 
                            isMulti
                            value={selectedNoiDung}
                            onChange={setListCate}
                            options={options}
                            getOptionLabel={(option) => option.label} 
                            getOptionValue={(option) => option.value}    
                            closeMenuOnSelect={false}
                            name='category'
                            placeholder="Chọn loại bất động sản"
                        />
                        <label class="lbphanhoi">Phản hồi khác</label>
                        <textarea class="form-control" id="phanhoikhac" cols="30" rows="3"></textarea>
                        <label class="lbphanhoi">Thông tin của bạn</label>
                        <input class="form-control" id="fullname" placeholder="Họ và tên"/>
                        <input class="form-control" id="phone" placeholder="Số điện thoại"/>
                        <input class="form-control" id="email" placeholder="Email"/>
                    </div>
                    <div class="modal-footer">
                    <button onClick={guiBaoCao} class="btn btn-danger form-control">Gửi</button>
                    </div>
                </div>
                </div>
            </div>
        </>
    );
}

export default ReportRealEstate;
