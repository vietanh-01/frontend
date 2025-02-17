import Footer from "../../layout/user/footer/footer";
import avatar from "../../assest/images/avatar.png";
import banner1 from "../../assest/images/banner1.png";
import banner2 from "../../assest/images/banner2.jpg";
import { getMethod, postMethodPayload } from "../../services/request";
import { formatPrice, formatPriceLT } from "../../services/money";
import { formatDate } from "../../services/dateservice";
import { useState, useEffect } from "react";
import { Parser } from "html-to-react";
import ReactPaginate from "react-paginate";
import { toast } from "react-toastify";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination } from "swiper/modules";
import SearchComponent from "./searchcomponent";

var sizepro = 5;
var url = "";
function TimKiem() {
    var objs = {
        tinh: { value: 0 },
        huyen: { value: [] },
        duan: { value: "" },
        mucgia: { value: "0-10000000000000" },
        dientich: { value: "0-1000000" },
        category: { value: [] },
    };

    const [priceRange, setPriceRange] = useState([]);
    const [acreageRange, setAcreageRange] = useState([]);
    const [objSearch, setObjSearch] = useState(objs);
    const [pageCount, setpageCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);
    const [realEstate, setRealEstate] = useState([]);
    const [totalResult, setTotalResult] = useState(0);
    const [payloadSearch, setPayloadSearch] = useState(null);

    var uls = new URL(document.URL);
    var tinh = uls.searchParams.get("tinh");
    var huyen = uls.searchParams.getAll("huyen");
    var duan = uls.searchParams.get("duan");
    var mucgia = uls.searchParams.get("mucgia");
    var dientich = uls.searchParams.get("dientich");
    var category = uls.searchParams.getAll("category");
    if (mucgia != null && mucgia != "") {
        objSearch.mucgia.value = mucgia;
    }
    if (tinh != null && tinh != "") {
        objSearch.tinh.value = tinh;
    }
    if (huyen != null && huyen != "") {
        objSearch.huyen.value = huyen;
    }
    if (duan != null && duan != "") {
        objSearch.duan.value = duan;
    }
    if (category != null && category != "") {
        objSearch.category.value = category;
    }
    if (dientich != null && dientich != "") {
        objSearch.dientich.value = dientich;
    }

    useEffect(() => {
        setPriceRange(listGia);
        setAcreageRange(listDienTich);

        const getBds = async () => {
            var payload = {
                categoryIds: objSearch.category.value,
                minPrice: objSearch.mucgia.value.split("-")[0],
                maxPrice: objSearch.mucgia.value.split("-")[1],
                minAcreage: objSearch.dientich.value.split("-")[0],
                maxAcreage: objSearch.dientich.value.split("-")[1],
                provinceId:
                    objSearch.tinh.value == 0 ? null : objSearch.tinh.value,
                districtsId: objSearch.huyen.value,
            };
            if (objSearch.duan.value != null && objSearch.duan.value != "") {
                payload.projectName = objSearch.duan.value;
            }
            setPayloadSearch(payload);
            var response = await postMethodPayload(
                "/api/real-estate/public/search-full-accuracy?size=" +
                sizepro +
                "&sort=id,desc" +
                "&page=" +
                0,
                payload
            );
            var result = await response.json();
            setTotalResult(result.totalElements);
            setpageCount(result.totalPages);
            setRealEstate(result.content);
            url =
                "/api/real-estate/public/search-full-accuracy?size=" +
                sizepro +
                "&sort=id,desc" +
                "&page=";
        };
        getBds();
    }, []);

    async function xemTiepBds() {
        var cur = currentPage + 1;
        setCurrentPage(cur);
        var response = await postMethodPayload(url + cur, payloadSearch);
        var result = await response.json();

        setRealEstate(realEstate.concat(result.content));
        if (result.content.length == 0) {
            toast.warning("Đã hết kết quả tìm kiếm");
        }
    }

    async function locTinXacThuc() {
        var check = document.getElementById("checkxacthuc").checked;
        var payload = payloadSearch;
        if (check == true) {
            payload.accuracy = true;
        } else {
            delete payload.accuracy;
            delete payloadSearch.accuracy;
        }
        setPayloadSearch(payload);
        var sort = document.getElementById("sortby").value;
        var response = await postMethodPayload(
            "/api/real-estate/public/search-full-accuracy?size=" +
            sizepro +
            "&sort=" +
            sort +
            "&page=" +
            0,
            payload
        );
        var result = await response.json();
        setTotalResult(result.totalElements);
        setpageCount(result.totalPages);
        setRealEstate(result.content);
        setCurrentPage(0);
        url =
            "/api/real-estate/public/search-full-accuracy?size=" +
            sizepro +
            "&sort=" +
            sort +
            "&page=";
    }

    async function sapXepTin() {
        var sort = document.getElementById("sortby").value;
        var response = await postMethodPayload(
            "/api/real-estate/public/search-full-accuracy?size=" +
            sizepro +
            "&sort=" +
            sort +
            "&page=" +
            0,
            payloadSearch
        );
        var result = await response.json();
        setTotalResult(result.totalElements);
        setpageCount(result.totalPages);
        setRealEstate(result.content);
        setCurrentPage(0);
        url =
            "/api/real-estate/public/search-full-accuracy?size=" +
            sizepro +
            "&sort=" +
            sort +
            "&page=";
    }

    return (
        <>
            <SearchComponent initialValues={objSearch} />
            <div class="divbdstimkiem">
                <div class="container containercustom">
                    <hr />
                    <div class="row">
                        <div class="col-sm-9">
                            <div class="filterdstimkiem row">
                                <div className="col-sm-5 infiltertimkiem">
                                    <h3>Tìm thấy {totalResult} kết quả</h3>
                                </div>
                                <div class="col-sm-4 infiltertimkiem">
                                    <select
                                        onChange={sapXepTin}
                                        class="form-control"
                                        id="sortby"
                                    >
                                        <option value="id,desc">
                                            Tin mới nhất
                                        </option>
                                        <option value="id,asc">
                                            Tin cũ nhất
                                        </option>
                                        <option value="price,asc">
                                            Giá thấp đến cao
                                        </option>
                                        <option value="price,desc">
                                            Giá cao đến thấp
                                        </option>
                                    </select>
                                </div>
                                <div className="col-sm-3 infiltertimkiem">
                                    <div
                                        class="divdaxacnhan"
                                        onclick="document.getElementById('checkxacthuc').click()"
                                    >
                                        <span class="spxacnhan">
                                            <span class="tieudext">
                                                Tin xác thực
                                            </span>
                                            <label class="switch">
                                                <input
                                                    onChange={locTinXacThuc}
                                                    type="checkbox"
                                                    id="checkxacthuc"
                                                />
                                                <span class="slider round"></span>
                                            </label>
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div class="listbdstimkiem" id="listbdstimkiem">
                                {realEstate.map((item) => {
                                    return (
                                        <div class="singledbstimkiem">
                                            <a
                                                href={
                                                    "chi-tiet-tin-dang?id=" +
                                                    item.id
                                                }
                                            >
                                                <div class="row">
                                                    <div class="col-sm-8 nopaddingright">
                                                        <img
                                                            src={item.image}
                                                            class="bdsimagelarge"
                                                        />
                                                    </div>
                                                    <div class="col-sm-4 nopaddingleft">
                                                        <div class="row">
                                                            <div class="col-sm-12 nopaddingbottom">
                                                                <img
                                                                    src={
                                                                        item
                                                                            .realEstateImages[1]
                                                                            ?.image
                                                                    }
                                                                    class="bdsimgsmall smallfirst"
                                                                />
                                                            </div>
                                                            <div class="col-sm-6 nopaddingright">
                                                                <img
                                                                    src={
                                                                        item
                                                                            .realEstateImages[2]
                                                                            ?.image
                                                                    }
                                                                    class="bdsimgsmall smallsv"
                                                                />
                                                            </div>
                                                            <div class="col-sm-6 nopaddingleft divslanh">
                                                                <img
                                                                    src={
                                                                        item
                                                                            .realEstateImages[3]
                                                                            ?.image
                                                                    }
                                                                    class="bdsimgsmall smallsv"
                                                                />
                                                                <div class="soluonganh">
                                                                    <i class="fa fa-picture-o"></i>{" "}
                                                                    {
                                                                        item
                                                                            .realEstateImages
                                                                            .length
                                                                    }
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </a>
                                            <div class="contentbdstk">
                                                <a
                                                    href={
                                                        "chi-tiet-tin-dang?id=" +
                                                        item.id
                                                    }
                                                    class="tieudetk"
                                                >
                                                    {item.accuracy == false ? (
                                                        ""
                                                    ) : (
                                                        <span class="daxacthucsp">
                                                            Đã xác thực
                                                        </span>
                                                    )}{" "}
                                                    {item.title}
                                                </a>
                                                <div class="divprice divtienich">
                                                    <span class="pricebds">
                                                        {formatPrice(
                                                            item.price
                                                        )}
                                                    </span>
                                                    <span class="pricebds areabds">
                                                        {item.acreage} m
                                                        <sup>2</sup>
                                                    </span>
                                                    <span class="tienichtk">
                                                        {formatPriceLT(
                                                            Number(
                                                                item.price /
                                                                item.acreage
                                                            )
                                                                .toString()
                                                                .split(".")[0]
                                                        )}
                                                        /m²
                                                    </span>
                                                    <span class="tienichtk">
                                                        {item.roomNumber}{" "}
                                                        <i class="fa fa-bed"></i>
                                                    </span>
                                                    <span class="tienichtk">
                                                        {item.toiletNumber}{" "}
                                                        <i class="fa fa-bathtub"></i>
                                                    </span>
                                                    <span class="tienichtk">
                                                        {
                                                            item.ward.district
                                                                .name
                                                        }
                                                        ,{" "}
                                                        {
                                                            item.ward.district
                                                                .province.name
                                                        }
                                                    </span>
                                                    <span class="tienichtk ngaydangtk">
                                                        {
                                                            item.createdDate.split(
                                                                "T"
                                                            )[0]
                                                        }
                                                    </span>
                                                </div>
                                                <span
                                                    class="motatkbds"
                                                    dangerouslySetInnerHTML={{
                                                        __html: item.description,
                                                    }}
                                                ></span>
                                            </div>
                                            <hr />
                                            <div class="divtimebds">
                                                <img
                                                    src={
                                                        item.user.avatar == null
                                                            ? avatar
                                                            : item.user.avatar
                                                    }
                                                    class="usertkiem"
                                                />
                                                <span class="tenusertk">
                                                    {item.user.fullname == null
                                                        ? "Người dùng"
                                                        : item.user.fullname}
                                                </span>
                                                <button
                                                    onClick={() =>
                                                    (window.location.href =
                                                        "tel:" +
                                                        item.user.phone)
                                                    }
                                                    class="btnyeuthich iconyttk"
                                                >
                                                    0918 606 666
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            <div class="xemthembds">
                                <button onClick={xemTiepBds} class="btnxemthem">
                                    Mở rộng <i class="fa fa-chevron-down"></i>
                                </button>
                            </div>
                        </div>
                        <div class="col-sm-3">
                            <div class="locnhanhtk">
                                <p class="tieudeloc">Lọc theo khoảng giá</p>
                                <div id="listgiafilter">
                                    {priceRange.map((item) => {
                                        return (
                                            <a
                                                href={
                                                    "timkiem?mucgia=" +
                                                    item.price
                                                }
                                            >
                                                {item.name}
                                            </a>
                                        );
                                    })}
                                </div>
                            </div>
                            <div class="locnhanhtk">
                                <p class="tieudeloc">Lọc theo diện tích</p>
                                <div id="listdtbenphai">
                                    {acreageRange.map((item) => {
                                        return (
                                            <a
                                                href={
                                                    "timkiem?dientich=" +
                                                    item.dientich
                                                }
                                            >
                                                {item.name}
                                            </a>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

var listGia = [
    {
        price: "0-100000000000000",
        name: "Tất cả khoảng giá",
    },
    {
        price: "0-499999999",
        name: "Dưới 500 triệu",
    },
    {
        price: "500000000-800000000",
        name: "500 đến 800 triệu",
    },
    {
        price: "800000000-1000000000",
        name: "800 triệu đến 1 tỷ",
    },
    {
        price: "1000000000-2000000000",
        name: "1 tỷ đến 2 tỷ",
    },
    {
        price: "2000000000-3000000000",
        name: "2 tỷ đến 3 tỷ",
    },
    {
        price: "3000000000-5000000000",
        name: "3 tỷ đến 5 tỷ",
    },
    {
        price: "5000000000-7000000000",
        name: "5 tỷ đến 7 tỷ",
    },
    {
        price: "7000000000-10000000000",
        name: "7 tỷ đến 10 tỷ",
    },
    {
        price: "10000000000-20000000000",
        name: "10 tỷ đến 20 tỷ",
    },
    {
        price: "20000000000-30000000000",
        name: "20 tỷ đến 30 tỷ",
    },
    {
        price: "30000000000-60000000000",
        name: "30 tỷ đến 60 tỷ",
    },
    {
        price: "60000000000-1000000000000",
        name: "Trên 60 tỷ",
    },
];

var listDienTich = [
    {
        dientich: "0-1000000",
        name: "Tất cả diện tích",
    },
    {
        dientich: "0-29",
        name: "Dưới 30 m2",
    },
    {
        dientich: "30-50",
        name: "30 - 50 m2",
    },
    {
        dientich: "50-80",
        name: "50 - 80 m2",
    },
    {
        dientich: "80-100",
        name: "80 - 100 m2",
    },
    {
        dientich: "100-150",
        name: "100 - 150 m2",
    },
    {
        dientich: "150-200",
        name: "150 - 200 m2",
    },
    {
        dientich: "200-250",
        name: "200 - 250 m2",
    },
    {
        dientich: "250-300",
        name: "250 - 300 m2",
    },
    {
        dientich: "300-500",
        name: "300 - 500 m2",
    },
    {
        dientich: "500-500000",
        name: "Trên 500 m2",
    },
];

export default TimKiem;
