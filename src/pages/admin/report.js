import { useState, useEffect } from "react";
import ReactPaginate from "react-paginate";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import $ from "jquery";
import Swal from "sweetalert2";
import {
    getMethod,
    postMethodPayload,
    deleteMethod,
} from "../../services/request";

var size = 10;
var url = "";
const AdminReport = () => {
    const [items, setItems] = useState([]);
    const [pageCount, setpageCount] = useState(0);
    useEffect(() => {
        const getReport = async () => {
            var response = await getMethod(
                "/api/report/admin/all?size=" + size + "&sort=id,desc&page=" + 0
            );
            var result = await response.json();
            setItems(result.content);
            setpageCount(result.totalPages);
            url = "/api/report/admin/all?size=" + size + "&sort=id,desc&page=";
        };
        getReport();
    }, []);

    async function locReport() {
        var start = document.getElementById("from").value;
        var end = document.getElementById("to").value;
        var uls = "/api/report/admin/all?size=" + size + "&sort=id,desc";
        if (start != "" && end != "") {
            uls += "&start=" + start + "&end=" + end;
        }
        uls += "&page=";
        url = uls;
        var response = await getMethod(uls + 0);
        var result = await response.json();
        setItems(result.content);
        setpageCount(result.totalPages);
    }

    const handlePageClick = async (data) => {
        var currentPage = data.selected;
        var response = await getMethod(url + currentPage);
        var result = await response.json();
        setItems(result.content);
        setpageCount(result.totalPages);
    };

    return (
        <>
            <div class="headerpageadmin d-flex justify-content-between align-items-center p-3 bg-light border">
                <strong class="text-left">
                    <i className="fa fa-users"></i> Quản Lý Báo Cáo
                </strong>
                <div class="search-wrapper d-flex align-items-center">
                    <div className="d-flex divngayadmin">
                        <label>Từ ngày: </label>
                        <input id="from" type="date" className="" />
                    </div>
                    <div className="d-flex divngayadmin">
                        <label>Đến ngày: </label>
                        <input id="to" type="date" className="" />
                    </div>
                    <button onClick={locReport} className="btn-search-header">
                        Lọc
                    </button>
                </div>
            </div>
            <div class="tablediv">
                <div class="headertable">
                    <span class="lbtable">Danh sách báo cáo</span>
                </div>
                <div class="divcontenttable">
                    <table id="example" class="table table-bordered">
                        <thead>
                            <tr>
                                <th>Tin đăng</th>
                                <th>Ngày gửi</th>
                                <th>Họ tên</th>
                                <th>Email</th>
                                <th>Số điện thoại</th>
                                <th>Lý do</th>
                                <th>Nội dung</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((item) => {
                                // Kiểm tra xem createdDate có tồn tại không
                                const date = item.createdDate
                                    ? new Date(item.createdDate)
                                    : null;

                                // Định dạng ngày tháng theo định dạng "YYYY-MM-DD HH:mm:ss"
                                const formattedDate = date
                                    ? `${date.getFullYear()}-${String(
                                          date.getMonth() + 1
                                      ).padStart(2, "0")}-${String(
                                          date.getDate()
                                      ).padStart(2, "0")} ${String(
                                          date.getHours()
                                      ).padStart(2, "0")}:${String(
                                          date.getMinutes()
                                      ).padStart(2, "0")}:${String(
                                          date.getSeconds()
                                      ).padStart(2, "0")}`
                                    : "";

                                return (
                                    <tr key={item.id}>
                                        <td>
                                            <a
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                href={`/chi-tiet-tin-dang?id=${item.realEstate?.id}`}
                                                className="pointer"
                                            >
                                                {item.realEstate?.title}
                                            </a>
                                        </td>
                                        <td>{formattedDate}</td>
                                        <td>{item.fullName}</td>
                                        <td>{item.email}</td>
                                        <td>{item.phone}</td>
                                        <td>{item.reason}</td>
                                        <td>{item.content}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                    <ReactPaginate
                        marginPagesDisplayed={2}
                        pageCount={pageCount}
                        onPageChange={handlePageClick}
                        containerClassName={"pagination"}
                        pageClassName={"page-item"}
                        pageLinkClassName={"page-link"}
                        previousClassName="page-item"
                        previousLinkClassName="page-link"
                        nextClassName="page-item"
                        nextLinkClassName="page-link"
                        breakClassName="page-item"
                        breakLinkClassName="page-link"
                        previousLabel="Trang trước"
                        nextLabel="Trang sau"
                        activeClassName="active"
                    />
                </div>
            </div>
        </>
    );
};

export default AdminReport;
