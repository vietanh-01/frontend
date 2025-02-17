import Footer from "../../layout/user/footer/footer";
import banner from "../../assest/images/banner.jpg";
import banner1 from "../../assest/images/banner1.png";
import banner2 from "../../assest/images/banner2.jpg";
import { getMethod } from "../../services/request";
import { formatPrice } from "../../services/money";
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

var sizepro = 8;
var url = "";
function Home() {
    var objs = {
        tinh: { value: 0 },
        huyen: { value: [] },
        duan: { value: "" },
        mucgia: { value: "" },
        dientich: { value: "" },
        category: { value: [] },
    };

    const [objSearch, setObjSearch] = useState(objs);
    const [itemType, setItemType] = useState([]);
    const [itemNews, setItemNews] = useState([]);
    const [newBlogs, setNewBlogs] = useState([]);
    const [bestBlog, setBestBlog] = useState(null);
    const [pageCount, setpageCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);
    const [realEstate, setRealEstate] = useState([]);

    useEffect(() => {
        const getNewBlog = async () => {
            var response = await getMethod(
                "/api/blog/public/findAll?size=6&sort=id,desc&page=0"
            );
            var result = await response.json();
            setNewBlogs(result.content);
            if (result.content.length > 0) {
                setBestBlog(result.content[0]);
            }
        };
        getNewBlog();
        const getBds = async () => {
            var response = await getMethod(
                "/api/real-estate/public/get-full?size=" +
                    sizepro +
                    "&sort=id,desc" +
                    "&page=" +
                    0
            );
            var result = await response.json();
            setpageCount(result.totalPages);
            setRealEstate(result.content);
            url =
                "/api/real-estate/public/get-full?size=" +
                sizepro +
                "&sort=id,desc" +
                "&page=";
        };
        getBds();
    }, []);

    async function xemTiepBds() {
        var cur = currentPage + 1;
        setCurrentPage(cur);
        var response = await getMethod(
            "/api/real-estate/public/get-full?size=" +
                sizepro +
                "&sort=id,desc" +
                "&page=" +
                cur
        );
        var result = await response.json();
        setRealEstate(realEstate.concat(result.content));
        if (result.content.length == 0) {
            toast.warning("Đã hết kết quả tìm kiếm");
        }
    }

    return (
        <>
            <SearchComponent initialValues={objSearch} />
            <div className="container containercustom">
                <div class="blogindex col-sm-8">
                    <div class="topblogindex">
                        <h3>Tin nổi bật</h3>
                        <a class="xemthemblog" href="tin-tuc">
                            Xem thêm <i class="fa fa-arrow-right"></i>{" "}
                        </a>
                    </div>
                    <div class="row listblogindex">
                        <div class="col-sm-6">
                            <a
                                href={"chitietbaiviet?id=" + bestBlog?.id}
                                id="hrefimgpri"
                            >
                                <img
                                    src={bestBlog?.image}
                                    id="blogpriimage"
                                    class="blogpriimage"
                                />
                            </a>
                            <a
                                href={"chitietbaiviet?id=" + bestBlog?.id}
                                class="titlepriindex"
                                id="titlepriindex"
                            >
                                {bestBlog?.title}
                            </a>
                        </div>
                        <div class="col-sm-6">
                            {newBlogs.map((item) => {
                                return (
                                    <div id="listblogindex" class="dsblogindex">
                                        <div class="singleblogindex">
                                            <a
                                                href={
                                                    "chitietbaiviet?id=" +
                                                    item.id
                                                }
                                            >
                                                {item.title}
                                            </a>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
            <div class="divbdsindex">
                <div className="container containercustom">
                    <h3>Bất động sản dành cho bạn</h3>
                    <div class="row" id="dsbdstrangchu">
                        {realEstate.map((item) => {
                            return (
                                <div class="col-sm-3">
                                    <div class="singlebds">
                                        <a
                                            href={
                                                "chi-tiet-tin-dang?id=" +
                                                item.id
                                            }
                                        >
                                            <img
                                                src={item.image}
                                                class="imgdbs"
                                            />
                                        </a>
                                        <div class="contentbds">
                                            <a
                                                href={
                                                    "chi-tiet-tin-dang?id=" +
                                                    item.id
                                                }
                                                class="titlebdssingle"
                                            >
                                                {item.title}
                                            </a>
                                            <div class="divprice">
                                                <span class="pricebds">
                                                    {formatPrice(item.price)}
                                                </span>
                                                <span class="pricebds areabds">
                                                    {item.acreage} m<sup>2</sup>{" "}
                                                </span>
                                            </div>
                                            <span class="diachibds">
                                                <i class="fa fa-map-marker"></i>{" "}
                                                {item.ward.name},{" "}
                                                {item.ward.district.name}
                                                <br />
                                                {
                                                    item.ward.district.province
                                                        .name
                                                }
                                            </span>
                                            <div class="divtimebds">
                                                <span class="timedangbds">
                                                    {formatDate(
                                                        item.createdDate
                                                    )}
                                                </span>
                                                {/* <button class="btnyeuthich"><i class="fa fa-heart active"></i></button> */}
                                            </div>
                                        </div>
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
            </div>
        </>
    );
}

export default Home;
