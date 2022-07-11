import React,{useState} from 'react';
import '../register.css';
import 'react-dropdown/style.css';
import { Link } from 'react-router-dom';
import Tick from '../assets/img/check-mark-verified.gif';
import { useLocation } from 'react-router-dom';

function MyOrderplaced() {
    const [sign, setSign] = useState(JSON.parse(localStorage.getItem('data1')))

    const location = useLocation();
    console.log(location)
    return (
        <div className='register'>
            <div className='register_container'>
                <div className="orderPlaceHeader">
                    <img src={Tick} alt="tick" style={{ width: '30%' }} />
                    <h2>Congratulation!! Your Order has begin Placed</h2><br />
                </div>
                <form >
                    <h5>Order bill is mailed at: {sign.u_email}</h5><br />
                    <h5>Order will be delivered at: {sign.u_address}</h5><br />
                    <div>
                        {location.state.orderData.productAssoc.map((p,index)=>(
                            <div key={index}>{p.product.pname} x {p.quantity}</div>
                        ))}
                    </div>
                    <Link to="/">
                        <button className='innerbutton' type="submit" value="Submit" >Ok</button>
                    </Link>
                    <br />
                </form>
            </div>
        </div>

    )
}

export default MyOrderplaced;