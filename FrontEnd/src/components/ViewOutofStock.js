import React from 'react'
import '../compheader.css';
import { Table } from 'react-bootstrap';

export default class ViewOutofStock extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            to: []
        }
    }
    componentDidMount = () => {
        let sign = JSON.parse(localStorage.getItem('data1'));
        console.log(sign.vid);
        fetch(process.env.REACT_APP_BASE_URL + "/product/viewoutofstock?v_id=" + sign.v_id)
            .then(resp => resp.json())
            .then(data => this.setState({ to: data }));

    }
    render() {
        const to1 = this.state.to.length;
        return (
            <div>
                {to1 != 0 ?
                    <div className='vhome'>
                        <div className='vhome_container'>
                            <div className='vhome_row'>
                                {/* <table>
                    <tr>
                        <th>Product ID</th>
                        <th>Product Title</th>
                        <th>Product Describe</th>
                        <th>Product Size</th>
                        <th>Product Brand</th>
                        <th>Product Price</th>
                        <th>Product Rating</th>
                        <th>Product Quantity</th>
                    </tr>
                    {
                        this.state.to.map(
                            (o) => {
                                return(
                                    <tr>
                                        <td>{o.pid}</td>
                                        <td>{o.pname}</td>
                                        <td>{o.pdesc}</td>
                                        <td>{o.psize}</td>
                                        <td>{o.pbrand}</td>
                                        <td>{o.pprice}</td>
                                        <td>{o.prating}</td>
                                        <td>{o.pqty}</td>
                                    </tr>
                                );
                            }
                        )    
                    }
                    </table> */}
                                <Table striped bordered hover  style={{textAlign: 'center'}}>
                                    <thead>
                                        <tr style={{ backgroundColor: "#6e1230", color: "white" }}>
                                            <th>Product ID</th>
                                            <th>Product Title</th>
                                            <th>Product Describe</th>
                                            <th>Product Size</th>
                                            <th>Product Brand</th>
                                            <th>Product Price</th>
                                            <th>Product Rating</th>
                                            <th>Product Quantity</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            this.state.to.map(
                                                (o) => {
                                                    return (
                                                        <tr>
                                                            <td>{o.p_id}</td>
                                                            <td>{o.pname}</td>
                                                            <td>{o.pdesc}</td>
                                                            <td>{o.psize}</td>
                                                            <td>{o.pbrand}</td>
                                                            <td>{o.pprice}</td>
                                                            <td>{o.prating}</td>
                                                            <td>{o.pqty}</td>
                                                        </tr>
                                                    );
                                                }
                                            )
                                        }
                                    </tbody>
                                </Table>
                            </div>
                            <div className=''>Total Number Of Products:<br />{this.state.to.length}</div>
                        </div>
                    </div>
                    : < div style={{ textAlign: "center", color: "black" }}><h2>No Data</h2></div>
                }
            </div>
        )
    }
}