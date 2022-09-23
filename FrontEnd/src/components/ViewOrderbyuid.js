import '../compheader.css';
import React, { useState, useEffect } from 'react'
import { Rating } from 'react-simple-star-rating'
import axios from 'axios'
import { Modal, Button } from 'react-bootstrap';
import moment from 'moment';

function ViewOrderbyuid() {

    const [to, setTo] = useState([])
    const [showOrderCancel, setShowOrderCancel] = useState(false)
    const [cancelOrderId, setCancelOrderId] = useState(null)
    const [isCancelOrderSuccess, setIsCancelOrderSuccess] = useState(false)
    const [isCancelOrderError, setIsCancelOrderError] = useState(false)

    const handleRating = (rate, pId, oId) => {
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

    function onClickCancelOrder() {
        setShowOrderCancel(false)
        axios.post(
            process.env.REACT_APP_BASE_URL + '/cancelOrder/' + cancelOrderId,
        ).then((res) => {
            console.log(res)
            to.filter(o => o.oid === cancelOrderId).map(o => (
                o.ostatus = "order_cancelled"
            ))
            setIsCancelOrderSuccess(true)
        }).catch((err) => {
            setIsCancelOrderError(true)
        })
    }
    function onShowAlterCancelModal(oId) {
        setShowOrderCancel(true)
        setCancelOrderId(oId)
    }
    return (
        <div>
            {showOrderCancel &&
                <Modal show={showOrderCancel} onHide={() => setShowOrderCancel(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Are you sure want to cancel this order?</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div><b>Order Id: #{cancelOrderId}</b></div><br></br>
                        <div><b>Products</b></div>
                        <div>
                            {to.filter(o => o.oid === cancelOrderId).map(o => (
                                o.productAssoc.map(product => (
                                    <div className="productListDiv">
                                        <div> {product.product.pname} * {product.quantity}</div>
                                    </div>
                                ))
                            ))
                            }
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowOrderCancel(false)}>
                            No
                        </Button>
                        <Button variant="primary" onClick={onClickCancelOrder}>
                            Yes
                        </Button>
                    </Modal.Footer>
                </Modal>
            }
            {isCancelOrderSuccess &&
                <Modal show={isCancelOrderSuccess} onHide={() => setIsCancelOrderSuccess(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>#{cancelOrderId} order cancel successful!!</Modal.Title>
                    </Modal.Header>
                    {/* <Modal.Body>
                    
                    </Modal.Body> */}
                    <Modal.Footer>
                        <Button variant="primary" onClick={() => setIsCancelOrderSuccess(false)}>
                            Ok
                        </Button>
                    </Modal.Footer>
                </Modal>
            }
            {isCancelOrderError &&
                <Modal show={isCancelOrderError} onHide={() => setIsCancelOrderError(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Sorry Unable to cacel this order :) #{cancelOrderId} </Modal.Title>
                    </Modal.Header>
                    {/* <Modal.Body>
                    
                    </Modal.Body> */}
                    <Modal.Footer>
                        <Button variant="primary" onClick={() => setIsCancelOrderError(false)}>
                            Ok
                        </Button>
                    </Modal.Footer>
                </Modal>
            }
            {
                to.length != 0
                    ? <div className=''>
                        <div className='vhome_container'>
                            <div className='vhome_row'>
                                <table style={{ textAlign: 'left', width: '100%' }}>
                                    <tr>
                                        <th>Order ID</th>
                                        <th>Created At</th>
                                        <th>Order Total Price</th>
                                        <th>Order Status</th>
                                        <th>Order QTY</th>
                                        <th style={{ textAlign: 'center' }}>Cancel Order</th>
                                    </tr>
                                    {to.reverse().map((o) => {
                                        return (
                                            <tr style={{ borderBottom: "1px solid grey" }}>
                                                <td>{o.oid}</td>
                                                <td>{moment(o.timestamp).format("DD-MM-YYYY HH:mm:ss")}</td>
                                                <td>{o.totalprice}</td>
                                                <td>{o.ostatus}</td>
                                                <td>
                                                    <div className="productListMainDiv">
                                                        {o.productAssoc.map(product => (
                                                            <div className="productListDiv">
                                                                <div> {product.product.pname} * {product.quantity}</div>
                                                                <div>
                                                                    <Rating
                                                                        onClick={(rate) => {
                                                                            handleRating(rate, product.product.p_id, o.oid)

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
                                                <td style={{ textAlign: 'center' }}>
                                                    {
                                                        o.ostatus === "order_cancelled" ?
                                                            <div>Already Cancelled</div>
                                                            :
                                                            <button
                                                                style={{ width: "150px", color: "white", backgroundColor: "red", border: "transparent" }}
                                                                onClick={() => onShowAlterCancelModal(o.oid)}
                                                            >
                                                                Cancel Order
                                                            </button>
                                                    }

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
        </div >
    )
}

export default ViewOrderbyuid;