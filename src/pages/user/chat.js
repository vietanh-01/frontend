import { useState, useEffect } from "react";
import { Parser } from "html-to-react";
import avatar from "../../assest/images/avatar.png";
import ReactPaginate from "react-paginate";
import { toast } from "react-toastify";
import Select from "react-select";
import {
    getMethod,
    postMethod,
    postMethodPayload,
    uploadSingleFile,
} from "../../services/request";
import Swal from "sweetalert2";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

function ChatUser() {
    const [message, setMessage] = useState("");
    const [chatMessages, setChatMessages] = useState([]);
    const [client, setClient] = useState(null);
    const [itemUser, setItemUser] = useState([]);
    const [itemChat, setItemChat] = useState([]);
    const [user, setUser] = useState(null);
    const [email, setEmail] = useState(null);

    useEffect(() => {
        const getItemUser = async () => {
            var response = await getMethod("/api/chat/user/getAllUserChat");
            var result = await response.json();
            setItemUser(result);
        };
        getItemUser();

        const getUser = async () => {
            var response = await postMethod("/api/user/user/user-logged");
            var result = await response.json();
            setUser(result);
        };
        getUser();

        const getMess = async () => {
            var uls = new URL(document.URL);
            var id = uls.searchParams.get("user");
            var email = uls.searchParams.get("email");
            if (id != null && email != null) {
                var response = await getMethod(
                    "/api/chat/user/getListChat?idreciver=" + id
                );
                var result = await response.json();
                setItemChat(result);
                setEmail(email);
            }
        };
        getMess();

        var userlc = localStorage.getItem("user");
        var email = JSON.parse(userlc).email;
        const sock = new SockJS("http://localhost:8080/hello");
        const stompClient = new Client({
            webSocketFactory: () => sock,
            onConnect: () => {
                console.log("WebSocket connected successfully!");
                stompClient.subscribe("/users/queue/messages", (msg) => {
                    var Idsender = msg.headers.sender;
                    var isFile = msg.headers.isFile;
                    if (Number(isFile) === Number(0)) {
                        appendTinNhanDen(msg.body, Idsender);
                    } else {
                        appendFileTinNhanDen(msg.body, Idsender);
                    }
                });
            },
            connectHeaders: {
                username: email, // Truyền email vào header khi kết nối
            },
        });
        stompClient.activate();
        setClient(stompClient);

        return () => {
            stompClient.deactivate();
        };
    }, []);
    const sendMessage = () => {
        var uls = new URL(document.URL);
        var id = uls.searchParams.get("user");
        client.publish({
            destination: "/app/hello/" + id,
            body: document.getElementById("contentmess").value,
        });
        append();
    };

    const sendFileMessage = async () => {
        const file = document.getElementById("btnsendfile").files[0];
        if (file) {
            if (isImageFile(file)) {
            } else {
                toast.warning("Đây không phải là file ảnh");
                return;
            }
        }
        var link = await uploadSingleFile(
            document.getElementById("btnsendfile")
        );
        appendFile(link);
        var uls = new URL(document.URL);
        var id = uls.searchParams.get("user");
        client.publish({
            destination:
                "/app/file/" +
                id +
                "/" +
                document.getElementById("btnsendfile").files[0].name,
            body: link,
        });
    };

    const handleKeyDown = (event) => {
        if (event.key === "Enter") {
            var uls = new URL(document.URL);
            var id = uls.searchParams.get("user");
            client.publish({
                destination: "/app/hello/" + id,
                body: document.getElementById("contentmess").value,
            });
            append();
        }
    };

    function append() {
        const newChatElement = document.createElement("p");
        newChatElement.className = "mychat";
        newChatElement.textContent =
            document.getElementById("contentmess").value;

        document.getElementById("listchatadmin").appendChild(newChatElement);
        var scroll_to_bottom = document.getElementById("listchatadmin");
        scroll_to_bottom.scrollTop = scroll_to_bottom.scrollHeight;
        document.getElementById("contentmess").value = "";
    }

    function appendFile(link) {
        const newChatElement = document.createElement("img");
        newChatElement.className = "mychatimg";
        newChatElement.src = link;

        document.getElementById("listchatadmin").appendChild(newChatElement);
        var scroll_to_bottom = document.getElementById("listchatadmin");
        scroll_to_bottom.scrollTop = scroll_to_bottom.scrollHeight;
    }

    const searchKey = async () => {
        var param = document.getElementById("keysearchuser").value;
        var response = await getMethod(
            "/api/chat/staff/getAllUserChat?search=" + param
        );
        var result = await response.json();
        setItemUser(result);
    };

    async function loadMessage(u) {
        window.location.href = "chat?user=" + u.id + "&email=" + u.email;
    }

    function appendTinNhanDen(mess, Idsender) {
        var uls = new URL(document.URL);
        var id = uls.searchParams.get("user");

        if (Idsender != id) {
            return;
        }

        const newChatElement = document.createElement("p");
        newChatElement.className = "adminchat";
        newChatElement.textContent = mess;
        document.getElementById("listchatadmin").appendChild(newChatElement);
        var scroll_to_bottom = document.getElementById("listchatadmin");
        scroll_to_bottom.scrollTop = scroll_to_bottom.scrollHeight;
    }

    function appendFileTinNhanDen(mess, Idsender) {
        var uls = new URL(document.URL);
        var id = uls.searchParams.get("user");
        if (Idsender != id) {
            return;
        }
        const newChatElement = document.createElement("img");
        newChatElement.className = "adminimg";
        newChatElement.src = mess;
        document.getElementById("listchatadmin").appendChild(newChatElement);
        var scroll_to_bottom = document.getElementById("listchatadmin");
        scroll_to_bottom.scrollTop = scroll_to_bottom.scrollHeight;
    }

    function isImageFile(file) {
        const fileType = file.type;
        return fileType.startsWith("image/");
    }

    return (
        <>
            <div class="row">
                <div class="col-sm-3">
                    <table class="table table-borderless" id="tableuserchat">
                        <thead>
                            <tr>
                                <td colspan="2">
                                    <input
                                        onKeyUp={searchKey}
                                        id="keysearchuser"
                                        class="form-control"
                                        type="text"
                                        placeholder="Tìm kiếm"
                                    />
                                </td>
                            </tr>
                        </thead>
                        <tbody id="listuserchat">
                            {itemUser.map((item, index) => {
                                return (
                                    <tr
                                        className={
                                            email === item.user.email
                                                ? "pointer trhoverchat activetrhoverchat"
                                                : "pointer trhoverchat"
                                        }
                                        onClick={() => loadMessage(item.user)}
                                    >
                                        <td
                                            class="col45"
                                            onClick={() =>
                                                loadMessage(item.user)
                                            }
                                        >
                                            <img
                                                src={
                                                    item.user.avatar == null
                                                        ? avatar
                                                        : item.user.avatar
                                                }
                                                class="imgavatarchat"
                                            />
                                        </td>
                                        <td onClick={() => loadMessage(item.user)}>
                                            {item.user.email}
                                            <span className="timechat">
                                                <span className="date">
                                                    {item.timestamp
                                                        ? new Date(item.timestamp).toLocaleDateString('vi-VN', {
                                                            year: 'numeric',
                                                            month: '2-digit',
                                                            day: '2-digit',
                                                        })
                                                        : ''}
                                                </span>
                                                {' '}
                                                <span className="time">
                                                    {item.timestamp
                                                        ? new Date(item.timestamp).toLocaleTimeString('vi-VN', {
                                                            hour: '2-digit',
                                                            minute: '2-digit',
                                                            second: '2-digit',
                                                        })
                                                        : ''}
                                                </span>
                                            </span>
                                        </td>

                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
                <div class="col-sm-9 mainchard">
                    {email == null ? (
                        <></>
                    ) : (
                        <div class="mainchatadmin" id="mainchatadmin">
                            <div class="header-chat-admin form-control">
                                {email}
                            </div>
                            <div class="contentchatadmin" id="listchatadmin">
                                {itemChat.map((item, index) => {
                                    if (item.sender.id == user.id) {
                                        if (item.isFile != true) {
                                            return (
                                                <p class="mychat">
                                                    {item.content}
                                                </p>
                                            );
                                        } else {
                                            return (
                                                <img
                                                    class="mychatimg"
                                                    src={item.content}
                                                />
                                            );
                                        }
                                    } else {
                                        if (item.isFile != true) {
                                            return (
                                                <p class="adminchat">
                                                    {item.content}
                                                </p>
                                            );
                                        } else {
                                            return (
                                                <img
                                                    class="adminimg"
                                                    src={item.content}
                                                />
                                            );
                                        }
                                    }
                                })}
                            </div>
                            <div className="centerchatstaff"></div>
                            <input
                                onChange={sendFileMessage}
                                type="file"
                                className="hidden"
                                id="btnsendfile"
                            />
                            <div class="chat-area-footer">
                                <input
                                    onKeyDown={handleKeyDown}
                                    type="text"
                                    id="contentmess"
                                    class="inputchatadmin"
                                    placeholder="write message"
                                />
                                <i
                                    className="fa fa-image imgchatbtnadmin"
                                    onClick={() =>
                                        document
                                            .getElementById("btnsendfile")
                                            .click()
                                    }
                                ></i>
                                <button
                                    onClick={() => sendMessage()}
                                    class="btn-send-message"
                                    id="sendmess"
                                >
                                    <i class="fa fa-paper-plane"></i>
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

export default ChatUser;
