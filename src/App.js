import './css/main.css';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Register from "./views/register";
import Login from "./views/login";
import Dashboard from "./views/dashboard";
import Header from "./components/header";
import {useSelector} from "react-redux";
import Authenticate from "./components/authenticate";
import Categories from "./views/categories/categories";
import AddCategory from "./views/categories/addCategory";
import Brands from "./views/brands/brands";
import Platforms from "./views/platforms/platforms";
import Attributes from "./views/attributes/attributes";
import Stores from "./views/stores/stores";
import AddStore from "./views/stores/addStore";
import AddPlatform from "./views/platforms/addPlatform";
import AddBrand from "./views/brands/addBrand";
import AddAttribute from "./views/attributes/addAttribute";
import AddProduct from "./views/products/addProduct";
import {useEffect} from "react";
import {get} from "./actions/auth";
import {GETUSERURL} from "./utils/texthelper";
import AddPage from "./views/pages/addPage";
import Pages from "./views/pages/pages";
import Product from "./views/products/product";
import AddPayment from "./views/paymentOptions/addPayment";
import PaymentOptions from "./views/paymentOptions/paymentOptions";
function App() {
    const {loginState} = useSelector(store=>store.auth);

    useEffect( () => {
        if(loginState){
            get(GETUSERURL).catch(e=>{
                console.log(e.response.status);
            });
        }
    },[loginState]);

  return (
      <BrowserRouter>
        <div className="App">
            {loginState&&<Header>
            </Header>}

            <div className={'main-container'}>
                <Routes>
                        <Route path="/" element={<Authenticate><Dashboard/></Authenticate>}>
                        </Route>
                        <Route path="categories" element={<Authenticate><Categories/></Authenticate>}></Route>
                        <Route path="categories/add" element={<Authenticate><AddCategory/></Authenticate>}></Route>
                    <Route path="brands" element={<Authenticate><Brands/></Authenticate>}></Route>
                    <Route path="platforms" element={<Authenticate><Platforms/></Authenticate>}></Route>
                    <Route path="platforms/add" element={<Authenticate><AddPlatform/></Authenticate>}></Route>
                    <Route path="stores" element={<Authenticate><Stores/></Authenticate>}></Route>
                    <Route path="stores/add" element={<Authenticate><AddStore/></Authenticate>}></Route>
                    <Route path="brands/add" element={<Authenticate><AddBrand/></Authenticate>}></Route>
                    <Route path="attributes" element={<Authenticate><Attributes/></Authenticate>}></Route>
                    <Route path="attributes/add" element={<Authenticate><AddAttribute/></Authenticate>}></Route>
                    <Route path="products/add" element={<Authenticate><AddProduct/></Authenticate>}></Route>
                    <Route path="products" element={<Authenticate><Product/></Authenticate>}></Route>
                    <Route path="pages" element={<Authenticate><Pages/></Authenticate>}></Route>
                    <Route path="pages/edit/:slug" element={<Authenticate><AddPage/></Authenticate>}></Route>
                    <Route path="pages/add" element={<Authenticate><AddPage/></Authenticate>}></Route>
                    <Route path="paymentOptions" element={<Authenticate><PaymentOptions/></Authenticate>}></Route>
                    <Route path="paymentOptions/add" element={<Authenticate><AddPayment/></Authenticate>}></Route>
                    <Route path="login" element={<Login/>}/>
                        <Route path="register" element={<Register></Register>}  ></Route>
                </Routes>
            </div>
        </div>
      </BrowserRouter>

  );
}

export default App;
