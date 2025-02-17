import Footer from '../../layout/user/footer/footer'
import zalo from '../../assest/images/zalo.png'
import banner1 from '../../assest/images/banner1.png'
import banner2 from '../../assest/images/banner2.jpg'
import {getMethod, postMethod} from '../../services/request'
import {formatPrice, formatPriceLT} from '../../services/money'
import {formatDate} from '../../services/dateservice'
import { useState, useEffect } from 'react'
import { Parser } from "html-to-react";
import ReactPaginate from 'react-paginate';
import {toast } from 'react-toastify';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination } from 'swiper/modules';
import SearchComponent from './searchcomponent';
import ReportRealEstate from './report';


function ChiTietTinDang(){
    const [item, setItem] = useState(null);
    const [checkFavorite, setCheckFavorite] = useState(false);
    const [realEstateSamePrice, setRealEstateSamePrice] = useState([]);
    useEffect(()=>{
        const getItem = async() =>{
            var uls = new URL(document.URL)
            var id = uls.searchParams.get("id");
            if(id == null){window.location.href = '/'}
            var response = await getMethod('/api/real-estate/public/find-by-id-public?id='+id);
            var result = await response.json();
            setItem(result)

            var pr = result.price / result.acreage
            var response = await getMethod('/api/real-estate/public/same-price?id='+id+'&price='+pr);
            var result = await response.json();
            setRealEstateSamePrice(result)
        };
        getItem();
        const getCheckFavorite = async() =>{
            var uls = new URL(document.URL)
            var id = uls.searchParams.get("id");
            if(id == null){window.location.href = '/'}
            var response = await getMethod('/api/favorite/all/check-favorite?id='+id);
            var result = await response.text();
            setCheckFavorite(result)
        };
        getCheckFavorite();
    }, []);
  

    function copyCurrentUrl() {
        const currentUrl = window.location.href; // Lấy URL hiện tại
        navigator.clipboard.writeText(currentUrl) // Sao chép vào clipboard
          .then(() => {
            toast.success("URL đã được sao chép");
          })
          .catch(err => {
            console.error('Lỗi khi sao chép URL: ', err);
          });
    }

    async function addFavorite() {
        const response = await postMethod('/api/favorite/all/add?id='+item.id)
        if (response.status < 300) {
            var result = await response.text();
            toast.success(result);
            var tagi = document.getElementById("yeuthichchitiet")
            if(tagi.classList.contains("active")){
                tagi.classList.remove('active');
            }
            else{
                tagi.classList.add('active');
            }
        }
        else {
            toast.error("Có lỗi xảy ra")
        }
    }


    return(
    <>
     <div class="contentmain">
        <div class="container containerdetail">
            <div class="row">
                <div class="col-sm-9">
                    <div class="listimagedetail" id="listimagedetail">
                        <div id="carouselExampleIndicators" class="carousel slide" data-bs-ride="carousel">
                            <div class="carousel-inner">
                                <div className='carousel-item active'>
                                    <img src={item?.image} class="d-block w-100 imgdetaills" alt="..."/>
                                </div>
                                {item?.realEstateImages.map((item, index) => (
                                <div className='carousel-item'>
                                    <img src={item.image} class="d-block w-100 imgdetaills" alt="..."/>
                                </div>
                                ))}
                            </div>
                            <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="prev">
                              <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                              <span class="visually-hidden">Previous</span>
                            </button>
                            <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="next">
                              <span class="carousel-control-next-icon" aria-hidden="true"></span>
                              <span class="visually-hidden">Next</span>
                            </button>
                        </div>
                    </div>

                    <div class="diachibdsdetail">
                        <span id="loaitindang"></span><span></span><span id="diachict"> {item?.ward.name} / {item?.ward.district.name} / {item?.ward.district.province.name}</span>
                    </div>
                    <h3 class="tieudedetail" id="tieudedetail">{item?.title}</h3>
                    <span class="tenduandetail" id="daxacthucdt"></span>
                    <span class="tenduandetail" id="tenduandetail">{item?.projectName}</span>
                    <div class="thongtinchitiet">
                        <div class="row">
                            <div class="col-sm-3 col-6 thongtinchitiet-content">
                                <span class="lbmucgia">Mức giá</span>
                                <span class="lbgia" id="mucgiact">{formatPrice(item==null?0:item.price)}</span>
                                <span class="lbgiamv" id="giametv">~{item==null?'':formatPriceLT(Number(item.price / item.acreage).toString().split(".")[0])}/m²</span>
                            </div>
                            <div class="col-sm-3 col-6 thongtinchitiet-content">
                                <span class="lbmucgia">Diện tích</span>
                                <span class="lbgia" id="dientichct">{item?.acreage} m²</span>
                                <span class="lbgiamv" id="sotangct">{item ==null?'':item.numFloors == 0 ?'':item.numFloors+' tầng'}</span>
                            </div>
                            <div class="col-sm-6 col-12 thongtinchitiet-right">
                                <button onClick={copyCurrentUrl} type="button" class="btnempty" data-bs-toggle="tooltip" data-bs-placement="top" title="Chia sẻ">
                                    <i class="fa fa-share"></i>
                                </button>
                                <button type="button" class="btnempty" data-bs-toggle="tooltip" data-bs-placement="top" title="Báo cáo tin đăng">
                                    <i class="fa fa-warning" data-bs-toggle="modal" data-bs-target="#exampleModal"></i>
                                </button>
                                <button type="button" id="btnyeuthichct" class="btnempty" data-bs-toggle="tooltip" data-bs-placement="top" title="Yêu thích">
                                    <i onClick={addFavorite} id="yeuthichchitiet" className={checkFavorite=="false"?'fa fa-heart heartdetail':'fa fa-heart heartdetail active'}></i>
                                </button>
                            </div>
                        </div>
                    </div>
                    <h4 class="ttmota">Thông tin mô tả</h4>
                    <div class="noidungmota" id="noidungmota" dangerouslySetInnerHTML={{__html:item?.description}}>
                    </div>
                    <h4 class="ttmota">Đặc điểm bất động sản</h4>
                    <div class="row">
                        <div class="col-sm-6">
                            <table class="table">
                                <tr><th class="thtienich">Diện tích</th><td id="trdientich">{item?.acreage} m²</td></tr>
                                <tr><th class="thtienich">Mặt tiền</th><td id="trmattien">{item?.facade} m</td></tr>
                                <tr><th class="thtienich">Số tầng</th><td id="trsotang">{item?.numFloors}</td></tr>
                                <tr><th class="thtienich">Số toilet</th><td id="trsotoilet">{item?.toiletNumber}</td></tr>
                            </table>
                        </div>
                        <div class="col-sm-6">
                            <table class="table">
                                <tr><th class="thtienich">Mức giá</th><td id="trmucgia">{formatPrice(item==null?0:item.price)}</td></tr>
                                <tr><th class="thtienich">Đường vào</th><td id="trduongvao">{item?.road}</td></tr>
                                <tr><th class="thtienich">Số phòng ngủ</th><td id="trsophongngu">{item?.roomNumber}</td></tr>
                                <tr><th class="thtienich">Pháp lý</th><td id="trphaply">{item?.juridical.name}</td></tr>
                            </table>
                        </div>
                    </div>
                    <table class="table tableduanlk">
                        <thead class="theadgray">
                            <tr>
                                <th>Các dự án cùng khoảng giá</th>
                                <th>Giá bán phổ biến nhất</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                        {realEstateSamePrice.map((item=>{
                            return <tr>
                                <td><a href={'chi-tiet-tin-dang?id='+item.id} class="linkduanlk">{item.title}</a></td>
                                <td>{formatPriceLT(Number(item.price / item.acreage).toString().split(".")[0])} <span class="giatienlk">/m²</span></td>
                            </tr>
                        }))}
                        </tbody>
                    </table>

                    <h4 class="ttmota">Xem trên bản đồ</h4>
                    <div id="googlemap" dangerouslySetInnerHTML={{__html:item?.linkMap}}>
                    </div>
                    </div>
                <div class="col-sm-3">
                    <div class="ttlienhe">
                        <div class="tenviettat" id="tenviettat">{lastName(item==null?'':item.user.fullname == null?item.user.email:item.user.fullname)}</div>
                        <span class="spdangboi">Được đăng bởi</span>
                        <span class="nguoidang" id="nguoidangbv">{item==null?'':item.user.fullname == null?item.user.email:item.user.fullname}</span>
                        <button class="btnsdtdetail" id="btnsdtdetail">{formatPhone(item==null?'':item.user.phone)}</button>
                        <button onClick={()=>window.location.href='https://zalo.me/'+item?.user.phone} class="btnchatzalo" id="btnchatzalo"><img src={zalo} class="zaloicon"/>Chat qua zalo</button>
                        <button onClick={()=>window.location.href='chat?user='+item?.user.id+'&email='+item?.user.email} id="btnxemthongtin" class="btnchatzalo">Nhắn tin trên website</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <ReportRealEstate/>
    </>
    );
}

function lastName(fullName){
    const words = fullName.split(" ");
    const lastName = words[words.length - 1];
    const firstCharOfLastName = lastName.charAt(0);
    return firstCharOfLastName;
}

function formatPhone(phoneNumber){
    const part1 = phoneNumber.substring(0, 4);  // Lấy 4 ký tự đầu tiên
    const part2 = phoneNumber.substring(4, 7);  // Lấy 3 ký tự tiếp theo
    const part3 = phoneNumber.substring(7);     // Lấy tất cả các ký tự còn lại
    const formattedPhoneNumber = `${part1} ${part2} ${part3}`;
    return formattedPhoneNumber;
}

export default ChiTietTinDang;
