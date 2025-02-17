import logomini from '../../assest/images/logomini.svg'
import hd1 from '../../assest/images/hd1.png'
import hd2 from '../../assest/images/hd2.png'
import hd from '../../assest/images/hd.png'
import uploadimg from '../../assest/images/upload.png'
import { useState, useEffect } from 'react'
import { Parser } from "html-to-react";
import ReactPaginate from 'react-paginate';
import {toast } from 'react-toastify';
import Select from 'react-select';
import {deleteMethod, getMethod, postMethod, postMethodPayload, uploadMultipleFile, uploadSingleFile} from '../../services/request';
import Swal from 'sweetalert2'
import { formatMoney } from '../../services/money';
import { Editor } from '@tinymce/tinymce-react';
import React, { useRef } from 'react';



var linkbanner = '';
var description = '';
const listFile = [];

async function dangTinBds() {
    document.getElementById("loading").style.display = 'block'
    var uls = new URL(document.URL)
    var id = uls.searchParams.get("id");
    var ims = await uploadSingleFile(document.getElementById("anhbiass"))
    if(ims != null){
        linkbanner = ims
    }
    var listLink = await uploadMultipleFile(listFile);
    const danhmuclist = document.getElementById("danhmuclist");
    const listcate = Array.from(danhmuclist.selectedOptions).map(option => option.value);

    var payload = {
        "id": id,
        "title": document.getElementById("tieude").value,
        "description":description,
        "image":linkbanner,
        "price":document.getElementById("giatien").value,
        "acreage":document.getElementById("dientich").value,
        "juridical":{
            "id":document.getElementById("phaply").value
        },
        "roomNumber":document.getElementById("sophong").value,
        "toiletNumber":document.getElementById("sovesinh").value,
        "projectName":document.getElementById("tenduan").value,
        "linkMap":document.getElementById("linkggmap").value,
        "facade":document.getElementById("facade").value,
        "numFloors":document.getElementById("numFloors").value,
        "road":document.getElementById("road").value,
        "categoryId":listcate,
        "wards":{
            "id":document.getElementById("xa").value
        },
        "listImages":listLink
    }
    const response = await postMethodPayload('/api/real-estate/all/create-update',payload)
    if (response.status < 300) {
        Swal.fire({
            title: "Thông báo",
            text: "Thêm/cập nhật tin đăng thành công!",
            preConfirm: () => {
                window.location.href = 'tincuatoi'
            }
        });
    }
    else {
        toast.error("Thêm/ sửa bài viết thất bại");
        document.getElementById("loading").style.display = 'none'
        if(response.status == 417){
            var result = await response.json();
            toast.warning(result.defaultMessage);
        }
    }
}


function DangTin(){
    const editorRef = useRef(null);
    const [user, setUser] = useState({});
    const [realestate, setRealestate] = useState({});
    const [phapLy, setPhapLy] = useState([]);
    const [categories, setCategories] = useState([]);
    const [province, setProvince] = useState([]);
    const [districs, setDistrics] = useState([]);
    const [wards, setWard] = useState([]);

    useEffect(()=>{
        const getUser = async() =>{
            var response = await postMethod("/api/user/user/user-logged")
            var result = await response.json();
            setUser(result)
        };
        getUser();
        const getRealState = async() =>{
            var uls = new URL(document.URL)
            var id = uls.searchParams.get("id");
            if(id != null){
                var response = await getMethod("/api/real-estate/public/find-by-id?id="+id)
                var result = await response.json();
                setRealestate(result)
                linkbanner = result.image
                description = result.description
                setDistrics(result.wards.districts.province.districts)
                for(var i=0; i< result.wards.districts.province.districts.length; i++){
                    if(result.wards.districts.province.districts[i].id == result.wards.districts.id){
                        setWard(result.wards.districts.province.districts[i].wards);
                        break;
                    }
                }
            }
        };
        getRealState();
        const getAddress = async() =>{
            var response = await getMethod("/api/address/public/province")
            var result = await response.json();
            setProvince(result)
        };
        getAddress();
        const getPhapLy = async() =>{
            var response = await getMethod("/api/juridical/public/findAll")
            var result = await response.json();
            setPhapLy(result)
        };
        getPhapLy();
        const getCategory = async() =>{
            var response = await getMethod("/api/category/public/find-all")
            var result = await response.json();
            setCategories(result)
        };
        getCategory();
    }, []);
    function handleEditorChange(content, editor) {
        description = content;
    }

    function loadHuyen(){
        var tinh = document.getElementById("tinh").value;
        for(var i=0; i<province.length; i++){
            if(province[i].id == tinh){
                setDistrics(province[i].districts)
                return;
            }
        }
    }
    function loadXa(){
        var huyen = document.getElementById("huyen").value;
        for(var j=0; j<districs.length; j++){
            if(districs[j].id == huyen){
                setWard(districs[j].wards)
                return;
            }
        }
    }

    function openChonAnh(){
        document.getElementById("choosefile").click();
    }

    async function deleteImage(id) {
        var con = window.confirm("Bạn muốn xóa ảnh này?");
        if (con == false) {
            return;
        }
        const response = await deleteMethod('/api/Real-Estate-Image/user/delete?id=' + id)
        if (response.status < 300) {
            toast.success("xóa ảnh thành công!");
            document.getElementById("imgdathem" + id).style.display = 'none';
        }
        if (response.status == 417) {
            var result = await response.json()
            toast.warning(result.defaultMessage);
        }
    }  
return(
<>
    <div class="blockcontent">
        <div class="row">
            <div class="col-sm-12">
                <div class="ghichuql">
                    <p>Khi đăng tin, bạn đã chấp nhận chính sách của chúng tôi, để tránh việc lợi dụng cập nhật thông tin
                        để đăng tin mới, chúng tôi sẽ thu phí ngay cả khi bạn cập nhật thông tin bài đăng.<br/>
                        Bạn hãy chắc chắn thông tin đã chính xác trước khi đăng tin.
                    </p>
                </div>
            </div>
            <div class="col-sm-6">
                <h3>Địa chỉ bất động sản</h3>
                <div class="row">
                    <div class="col-sm-4">
                        <label>Chọn tỉnh</label>
                        <select id="tinh" class="form-control" onChange={loadHuyen} data-live-search="true">
                            <option disabled selected>Chọn tỉnh thành</option>
                            {province.map((item=>{
                                return <option selected={realestate.wards?.districts.province.id == item.id} value={item.id}>{item.name}</option>
                            }))}
                        </select>
                    </div>
                    <div class="col-sm-4">
                        <label>Chọn huyện</label>
                        <select id="huyen" class="form-control" onChange={loadXa}>
                            <option disabled selected>Chọn quận/huyện</option>
                            {districs.map((item=>{
                                return <option selected={realestate.wards?.districts.id == item.id} value={item.id}>{item.name}</option>
                            }))}
                        </select>
                    </div>
                    <div class="col-sm-4">
                        <label>Chọn xã</label>
                        <select id="xa" class="form-control" onchange="hienThiDiaChiDaChon()">
                            {wards.map((item=>{
                                return <option selected={realestate.wards?.id == item.id} value={item.id}>{item.name}</option>
                            }))}
                        </select>
                    </div>
                </div>
                <label>Link google map <span data-bs-toggle="modal" data-bs-target="#hdganlink" class="pointer">(Hướng dẫn gắn link)</span></label>
                <input defaultValue={realestate?.linkMap} id="linkggmap" type="text" class="form-control"/>
                
                <br/><h3>Thông tin mô tả</h3>
                <label>Danh mục tin</label>
                <select id="danhmuclist" class="form-control" multiple>
                    {categories.map((item=>{
                        var checked = false;
                        if(realestate.realEstateCategories != undefined){
                            for(var j=0; j< realestate.realEstateCategories.length; j++){
                                if(realestate.realEstateCategories[j].category.id == item.id){
                                    checked = true;
                                    break;
                                }
                            }   
                        }
                        return <option selected={checked} value={item.id}>{item.name}</option>
                    }))}
                </select>
                <label>Tiêu đề</label>
                <input defaultValue={realestate?.title} id="tieude" type="text" class="form-control"/>
                <label>Tên dự án (nếu có)</label>
                <input defaultValue={realestate?.projectName} id="tenduan" type="text" class="form-control"/>
                <label>Giá tiền</label>
                <input defaultValue={realestate?.price} id="giatien" type="text" class="form-control"/>
                <div class="row">
                    <div class="col-3">
                        <label>Diện tích (m<sup>2</sup>)</label><br/>
                        <input defaultValue={realestate?.acreage} id="dientich" type="number" class="form-control"/>
                    </div>
                    <div class="col-3">
                        <label>Số phòng ngủ</label><br/>
                        <input defaultValue={realestate?.roomNumber} id="sophong" type="number" class="form-control"/>
                    </div>
                    <div class="col-3">
                        <label>Số phòng vệ sinh</label><br/>
                        <input defaultValue={realestate?.toiletNumber} id="sovesinh" type="number" class="form-control"/>
                    </div>
                    <div class="col-3">
                        <label>Pháp lý</label><br/>
                        <select class="form-control" id="phaply">
                            {phapLy.map((item=>{
                                return <option selected={item.id == realestate.juridical?.id} value={item.id}>{item.name}</option>
                            }))}
                        </select>
                    </div>
                </div>
                <div class="row">
                    <div class="col-4">
                        <label>Diện tích đường vào</label><br/>
                        <input defaultValue={realestate?.facade} id="facade" type="number" class="form-control"/>
                    </div>
                    <div class="col-4">
                        <label>Diện tích mặt tiền</label><br/>
                        <input defaultValue={realestate?.road} id="road" type="number" class="form-control"/>
                    </div>
                    <div class="col-4">
                        <label>Số tầng</label><br/>
                        <input defaultValue={realestate?.numFloors} id="numFloors" type="number" class="form-control"/>
                    </div>
                </div>
                <br/><label>Mô tả</label>
                <Editor name='editor' tinymceScriptSrc={'https://cdn.tiny.cloud/1/f6s0gxhkpepxkws8jawvfwtj0l9lv0xjgq1swbv4lgcy3au3/tinymce/6/tinymce.min.js'}
                                        onInit={(evt, editor) => editorRef.current = editor} 
                                        initialValue={realestate==null?'':realestate.description}
                                        onEditorChange={handleEditorChange}/>
            </div>
            <div class="col-md-6 chooseImage">
                <h3>Thông tin liên hệ</h3>
                <label>Họ tên</label>
                <input value={user.fullname} readonly disabled type="text" class="form-control"/>
                <label>Số điện thoại</label>
                <input value={user.phone} readonly disabled type="text" class="form-control"/><br/>
                <div class="row">
                    <div class="col-md-12">
                        <h3>Chọn ảnh</h3>
                        <label>Ảnh bìa</label>
                        <input id="anhbiass" type="file" class="form-control"/>
                        <br/><img style={{width:"100px"}} src={realestate.image} id="anhendathem"/>
                        <br/>
                        <div class="row">
                            <div class="col-md-12">
                                <div class="row" id="preview">
                                    <div class="col-md-12" id="chon-anhs">
                                        <div id="choose-image" class="choose-image"
                                            onClick={()=>openChonAnh()}>
                                            <p><img src={uploadimg} id="camera"/></p>
                                            <p id="numimage">Thêm ảnh</p>
                                        </div>
                                    </div>
                                </div>
                                <div class="row" id="listpreview">

                                </div>
                            </div>
                            <div id="divanhdathem" className={realestate.realEstateImages==undefined?'disnone':'row'}>
                                <div class="col-sm-12">
                                    <h4 style={{marginTop:"30px"}}>Ảnh đã thêm</h4>
                                </div>
                                {realestate.realEstateImages==undefined?'': 
                                    realestate.realEstateImages.map((item=>{
                                        return <div id={"imgdathem"+item.id} class="col-md-3 col-sm-6 col-6">
                                        <img  src={item.image} class="image-upload"/>
                                        <button onClick={()=>deleteImage(item.id)} type='button' class="btn btn-danger form-control">Xóa ảnh</button>
                                    </div>
                                })) }
                            </div>
                        </div>
                    </div>
                    <input type="file" id="choosefile" multiple accept="image/*" onChange={()=>previewImages()} style={{visibility:"hidden"}}/>
                    
                    <div class="col-md-12">
                        <div id="loading">
                            <div class="bar1 bar"></div>
                        </div><br/><br/>
                        <button class="btn btn-primary upload-submit" onClick={dangTinBds}>Đăng tin</button>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="modal fade" id="hdganlink" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
        <div class="modal-dialog modal-lg">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="staticBackdropLabel">Hướng dẫn gắn link google map</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body modalbodyscrol">
                <div>
                    Bước 1: Truy cập vào google map <br/><br/>
                    Bước 2: Nhập địa chỉ vào ô <strong>tim kiếm</strong> để tìm đến đích 1 địa điểm<br/><br/>
                    Bước 3: Click vào nút <strong>chia sẻ</strong> như hình bên dưới <br/><br/>
                    <img src={hd} class="huongdanimg"/><br/><br/>
                    Sau khi click nút chia sẻ sẽ ra hình bên dưới, chọn vào <strong>tab nhúng bản đồ</strong>
                    <img src={hd1} class="huongdanimg"/><br/><br/>
                    Chọn tab <strong>nhúng bản đồ</strong> sẽ ra hình bên dưới, Sau đó click vào <strong>sao chép HTML</strong> rồi dán vào input
                    <img src={hd2} class="huongdanimg"/><br/><br/>
                </div>
            </div>
          </div>
        </div>
    </div>
</>
);
}


function previewImages() {
    var files = document.getElementById("choosefile").files;
    for (var i = 0; i < files.length; i++) {
        listFile.push(files[i]);
    }

    var preview = document.querySelector('#preview');

    for (i = 0; i < files.length; i++) {
        readAndPreview(files[i]);
    }

    function readAndPreview(file) {

        var reader = new FileReader(file);

        reader.addEventListener("load", function() {
            document.getElementById("chon-anhs").className = 'col-sm-3';
            document.getElementById("chon-anhs").style.height = '100px';
            document.getElementById("chon-anhs").style.marginTop = '5px';
            document.getElementById("choose-image").style.height = '120px';
            document.getElementById("numimage").innerHTML = '';
            document.getElementById("camera").style.fontSize = '20px';
            document.getElementById("camera").style.marginTop = '40px';
            document.getElementById("camera").className = 'fas fa-plus';
            document.getElementById("choose-image").style.width = '90%';

            var div = document.createElement('div');
            div.className = 'col-md-3 col-sm-6 col-6';
            div.style.height = '120px';
            div.style.paddingTop = '5px';
            div.marginTop = '100px';
            preview.appendChild(div);

            var img = document.createElement('img');
            img.src = this.result;
            img.style.height = '85px';
            img.style.width = '90%';
            img.className = 'image-upload';
            img.style.marginTop = '5px';
            div.appendChild(img);

            var button = document.createElement('button');
            button.style.height = '30px';
            button.style.width = '90%';
            button.innerHTML = 'xóa'
            button.className = 'btn btn-warning';
            div.appendChild(button);

            button.addEventListener("click", function() {
                div.remove();
                console.log(listFile.length)
                for (i = 0; i < listFile.length; i++) {
                    if (listFile[i] === file) {
                        listFile.splice(i, 1);
                    }
                }
                console.log(listFile.length)
            });
        });

        reader.readAsDataURL(file);

    }

}
export default DangTin;
