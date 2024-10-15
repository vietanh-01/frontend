import Footer from '../../layout/user/footer/footer'
import banner from '../../assest/images/banner.jpg'
import banner1 from '../../assest/images/banner1.png'
import banner2 from '../../assest/images/banner2.jpg'
import {getMethod} from '../../services/request'
import {formatMoney} from '../../services/money'
import { useState, useEffect } from 'react'
import { Parser } from "html-to-react";
import ReactPaginate from 'react-paginate';
import {toast } from 'react-toastify';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination } from 'swiper/modules';


var sizepro = 20
function Home(){
    const [itemType, setItemType] = useState([]);
    const [itemNews, setItemNews] = useState([]);

    useEffect(()=>{
        // const getItemTyoe = async() =>{
        //     var response = await getMethod('/api/vaccine/public/vaccine-type');
        //     var result = await response.json();
        //     setItemType(result)
        // };
        // getItemTyoe();
    }, []);
  
    return(
        <></>
    );
}

export default Home;
