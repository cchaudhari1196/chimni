import React from 'react'
import '../compheader.css';
import moment from 'moment';
export default class ViewOrders extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            to: []
        }
    }
    componentDidMount = () => {
        fetch(process.env.REACT_APP_BASE_URL + "/getAllOrders")
            .then(resp => resp.json())
            .then(data => {
                { this.setState({ to: data }) }
            }
            );
        console.log(this.state.to.length);
    }
    render() {
        const to1 = this.state.to.length;
        return (
            <div>
                {to1 != 0
                    ? <div className='vhome'>
                        <div className='vhome_container'>
                            <div className='vhome_row'>
                                <table style={{ textAlign: 'center' }}>
                                    <tr>
                                        <th>Order ID</th>
                                        <th>User ID</th>
                                        <th>User Name</th>
                                        <th>User Address</th>
                                        <th>User ContactNumber</th>
                                        <th>Order TotalPrice</th>
                                        <th>Order QTY</th>
                                        <th>Order Status</th>
                                        <th>Created At</th>
                                    </tr>
                                    {this.state.to.map((o) => {
                                        return (<tr>
                                            <td>{o.oid}</td>
                                            <td>{o.user.u_id}</td>
                                            <td>{o.user.u_fname} {o.user.u_lname}</td>
                                            <td>{o.address}</td>
                                            <td>{o.contactno}</td>
                                            <td>{o.totalprice}</td>
                                            <td>
                                                <td>{o.productAssoc.map(product => (
                                                    <div>{product.product.pname} * {product.quantity}</div>
                                                ))
                                                }
                                                </td>
                                            </td>
                                            <td>
                                                {o.ostatus}
                                            </td>
                                            <td>
                                                {moment(o.timesta).format("DD-MM-YYYY HH:mm:ss")}
                                            </td>
                                        </tr>);
                                    })}
                                </table>
                            </div>

                            <div className='vhome_row'>Total Number Of Orders:<br />{this.state.to.length}</div>
                        </div>
                    </div>
                    : < div style={{ textAlign: "center", color: "black" }}><h2>No Data</h2></div>
                }
            </div>
        );
    }
}