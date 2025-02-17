import { useState, useEffect } from 'react'
import { Parser } from "html-to-react";
import ReactPaginate from 'react-paginate';
import {toast } from 'react-toastify';
import Select from 'react-select';
import {getMethod, postMethod, postMethodPayload} from '../../services/request';
import Swal from 'sweetalert2'


function SearchComponent({initialValues}){
    const [selectedCategory, setselectedCategory] = useState([]);
    const [selectedDistric, setSelectedDistric] = useState([]);
    const [cate, setCate] = useState([]);
    const [priceRange, setPriceRange] = useState([]);
    const [acreageRange, setAcreageRange] = useState([]);
    const [province, setProvince] = useState([]);
    const [districs, setDistrics] = useState([]);
    const [selectProvince, setSelectProvince] = useState(null);
    const [selectDt, setSelectDt] = useState(null);
    const [selectPrice, setSelectPrice] = useState(null);

    useEffect(()=>{
        const getCategory = async() =>{
            var response = await getMethod('/api/category/public/find-all-quantity')
            var result = await response.json();
            await setCate(result)
            var cateinit = [];
            for(var i=0; i< initialValues.category.value.length; i++){
                for(var j=0; j< result.length; j++){
                    if(initialValues.category.value[i] == result[j].id){
                        cateinit.push(result[j])
                    }
                }
            }
            setselectedCategory(cateinit)

            setAcreageRange(listDienTich)
            for(var i=0; i< listDienTich.length; i++){
                if(listDienTich[i].dientich == initialValues.dientich.value){
                    setSelectDt(listDienTich[i])
                }
            }

            setPriceRange(listGia)
            for(var i=0; i< listGia.length; i++){
                if(listGia[i].price == initialValues.mucgia.value){
                    setSelectPrice(listGia[i])
                }
            }
        };
        getCategory();


        const getAddress = async() =>{
            var response = await getMethod("/api/address/public/province")
            var result = await response.json();
            setProvince(result)
            
            var province = null;
            for(var i=0; i< result.length; i++){
                if(result[i].id == initialValues.tinh.value){
                    province = result[i]
                    setSelectProvince(result[i])
                    setDistrics(result[i].districts)
                }
            }

            if(province != null){
                var huyeninit = [];
                for(var i=0; i< initialValues.huyen.value.length; i++){
                    for(var j=0; j< province.districts.length; j++){
                        if(initialValues.huyen.value[i] == province.districts[j].id){
                            huyeninit.push(province.districts[j])
                        }
                    }
                }
                setSelectedDistric(huyeninit);
            }
            
        };
        getAddress();
    }, []);

    const setListCate = (selectedOptions) => {
        setselectedCategory(selectedOptions);
    };

    const setListHuyen = (selectedOptions) => {
        setSelectedDistric(selectedOptions);
    };
    
    const changeDt = (selectedOptions) => {
        setSelectDt(selectedOptions);
    };

    const changePrice = (selectedOptions) => {
        setSelectPrice(selectedOptions);
    };

    const loadHuyen= (option) =>{
        var tinh = option.id;
        setSelectedDistric([])
        for(var i=0; i<province.length; i++){
            if(province[i].id == tinh){
                setDistrics(province[i].districts)
                setSelectProvince(province[i])
                return;
            }
        }
    }

    
    return(
    <div class="container custom-container-search">
        <form action="timkiem" class="searchmain col-sm-12">
            <div class="searchmain-top">
                <div class="row">
                    <div class="col-sm-1 col-2">
                        <i class="fa fa-map-marker iconsearchs"></i>
                    </div>
                    <div class="col-sm-3 col-10">
                        <div class="">
                            <Select
                                className="select-container" 
                                onChange={loadHuyen}
                                options={province}
                                value={selectProvince}
                                getOptionLabel={(option) => option.name} 
                                getOptionValue={(option) => option.id}    
                                closeMenuOnSelect={false}
                                name='tinh'
                                placeholder="Chọn tỉnh"
                            />
                        </div>
                    </div>
                    <div class="col-sm-3">
                        <div class="formsearchborder">
                            <Select
                                className="select-container" 
                                isMulti
                                value={selectedDistric}
                                onChange={setListHuyen}
                                options={districs}
                                getOptionLabel={(option) => option.name} 
                                getOptionValue={(option) => option.id}    
                                closeMenuOnSelect={false}
                                name='huyen'
                                placeholder="Chọn huyện"
                            />
                        </div>
                    </div>
                    <div class="col-sm-5">
                        <div class="formlienhe">
                            <input defaultValue={initialValues.duan.value} name="duan" type="text" class="formsearch" placeholder="Nhập từ khóa: dự án"/>
                            <button class="sendem btnsearchtop">Tìm kiếm</button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="searchmain-bottom">
                <div class="row">
                    <div class="col-sm-3">
                        <Select
                            id='mucgia'
                            options={priceRange}
                            value={selectPrice}
                            onChange={changePrice}
                            getOptionLabel={(option) => option.name} 
                            getOptionValue={(option) => option.price}    
                            closeMenuOnSelect={false}
                            name='mucgia'
                            placeholder="Chọn mức giá"
                        />
                    </div>
                    <div class="col-sm-3">
                        <Select
                            className="select-container" 
                            options={acreageRange}
                            value={selectDt}
                            onChange={changeDt}
                            getOptionLabel={(option) => option.name} 
                            getOptionValue={(option) => option.dientich}    
                            closeMenuOnSelect={false}
                            name='dientich'
                            placeholder="Chọn diện tích"
                        />
                    </div>
                    <div class="col-sm-6"> 
                        <Select
                            className="select-container" 
                            isMulti
                            value={selectedCategory}
                            onChange={setListCate}
                            options={cate}
                            getOptionLabel={(option) => option.name} 
                            getOptionValue={(option) => option.id}    
                            closeMenuOnSelect={false}
                            name='category'
                            placeholder="Chọn loại bất động sản"
                        />
                    </div>
                </div>
            </div>
        </form>
    </div>
    );
}


var listGia = 
[
    {
        price:"0-100000000000000",
        name:"Tất cả khoảng giá"
    },
    {
        price:"0-499999999",
        name:"Dưới 500 triệu"
    },
    {
        price:"500000000-800000000",
        name:"500 đến 800 triệu"
    },
    {
        price:"800000000-1000000000",
        name:"800 triệu đến 1 tỷ"
    },
    {
        price:"1000000000-2000000000",
        name:"1 tỷ đến 2 tỷ"
    },
    {
        price:"2000000000-3000000000",
        name:"2 tỷ đến 3 tỷ"
    },
    {
        price:"3000000000-5000000000",
        name:"3 tỷ đến 5 tỷ"
    },
    {
        price:"5000000000-7000000000",
        name:"5 tỷ đến 7 tỷ"
    },
    {
        price:"7000000000-10000000000",
        name:"7 tỷ đến 10 tỷ"
    },
    {
        price:"10000000000-20000000000",
        name:"10 tỷ đến 20 tỷ"
    },
    {
        price:"20000000000-30000000000",
        name:"20 tỷ đến 30 tỷ"
    },
    {
        price:"30000000000-60000000000",
        name:"30 tỷ đến 60 tỷ"
    },
    {
        price:"60000000000-1000000000000",
        name:"Trên 60 tỷ"
    },
]


var listDienTich = 
[
    {
        dientich:"0-1000000",
        name:"Tất cả diện tích"
    },
    {
        dientich:"0-29",
        name:"Dưới 30 m2"
    },
    {
        dientich:"30-50",
        name:"30 - 50 m2"
    },
    {
        dientich:"50-80",
        name:"50 - 80 m2"
    },
    {
        dientich:"80-100",
        name:"80 - 100 m2"
    },
    {
        dientich:"100-150",
        name:"100 - 150 m2"
    },
    {
        dientich:"150-200",
        name:"150 - 200 m2"
    },
    {
        dientich:"200-250",
        name:"200 - 250 m2"
    },
    {
        dientich:"250-300",
        name:"250 - 300 m2"
    },
    {
        dientich:"300-500",
        name:"300 - 500 m2"
    },
    {
        dientich:"500-500000",
        name:"Trên 500 m2"
    },
]

export default SearchComponent;
