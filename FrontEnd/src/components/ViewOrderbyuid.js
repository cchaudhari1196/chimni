import '../compheader.css';
import React, { useState, useEffect } from 'react'
import { Rating } from 'react-simple-star-rating'
import axios from 'axios'

function ViewOrderbyuid() {

    const [rating, setRating] = useState(0)
    const [to, setTo] = useState([])

    const handleRating = (rate, pId, oId) => {
        setRating(rate)
        console.log(rate)
        console.log(pId)
        console.log(oId)
        // other logic
        let formData = {
            "ratings": rate,
            "order_id": oId,
            "product_id": pId
        }
        axios
            .post(
                process.env.REACT_APP_BASE_URL + '/rateMyOrder',
                formData
            )
            .then((res) => {
                console.log(res)
            })
    }



    useEffect(() => {
        let sign = JSON.parse(localStorage.getItem('data1'));
        if (sign === null) {
            window.location.href = "/";
        }
        else {
            console.log(sign.uid);
            fetch(process.env.REACT_APP_BASE_URL + "/getorderdatafromuid/" + sign.u_id)
                .then(resp => resp.json())
                .then(data => {
                    console.log(data);
                    { setTo(data) }
                }
                );
        }
    }, [])

    return (
        <div>
            {to.length != 0
                ? <div className=''>
                    <div className='vhome_container'>
                        <div className='vhome_row'>
                            <table style={{ textAlign: 'left', width: '100%' }}>
                                <tr>
                                    <th>Order TotalPrice</th>
                                    <th>Order Status</th>
                                    <th>Order QTY</th>
                                </tr>
                                {to.reverse().map((o) => {
                                    return (
                                        <tr style={{ borderBottom: "1px solid grey" }}>
                                            <td>{o.totalprice}</td>
                                            <td>{o.ostatus}</td>
                                            <td>
                                                <div className="productListMainDiv">
                                                    {o.productAssoc.map(product => (
                                                        <div className="productListDiv">
                                                            <div> {product.product.pname} * {product.quantity}</div>
                                                            <div>
                                                                <Rating
                                                                    onClick={(rate)=>{
                                                                        handleRating(rate,product.product.p_id, o.oid)  

                                                                    }}
                                                                    ratingValue={product.rating}
                                                                    allowHalfIcon={true}
                                                                    // transition={true}
                                                                    allowHover={false}
                                                                />
                                                            </div>
                                                        </div>
                                                    ))
                                                    }
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </table>
                        </div>
                    </div>
                </div>
                : < div style={{ textAlign: "center", color: "black" }}><h2>No Data</h2></div>
            }
        </div>
    )
}

export default ViewOrderbyuid;