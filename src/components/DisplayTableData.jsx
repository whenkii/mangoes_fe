import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AllSpinners } from './Spinners';
import styled from 'styled-components';
import { CSVLink } from "react-csv";
import { GetApiDataUpdate } from '../components/ApiCalls';
import { ToastContainer, toast } from 'react-toastify';
import { accountsContext } from '../contexts/accountsContext';

export default function DisplayTableData({ state, comp, id, bgClr }) {
    const compListForCheckBoxes= ["ALLORDERS", "DELREPORT"]
    const compListForDelStatus= ["DELREPORT"]
    const navigate = useNavigate();
    const [accountInfo] = useContext(accountsContext);

    const [selectedRows, setSelectedRows] = useState([]);
    const handleCheckboxChange = (id) => {
        setSelectedRows(prev =>
            prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
        );
    };

    const [stateVar, setOrderDetails] = useState(state);
    const [sort, setSort] = useState({ propertyName: "", mode: 'ASC' });
    const [filters, setFilters] = useState({
        STATUS: '',
        DEL_MODE: '',
        PAYMENT_UPD_BY: '',
        LOCATION: []
    });

    const hyperLinks = { attr: "ORDER_ID", link: "/orderdetails" };

    const getDistinctValues = (data, key) => {
        const uniqueMap = {};
        data.forEach(item => {
            const val = item[key];
            if (val) {
                uniqueMap[val.toLowerCase()] = val; // Case-insensitive uniqueness
            }
        });
        return Object.values(uniqueMap).sort(); // Return values sorted
    };

    const propComparator = (propName, type) => (a, b) => {
        if (type === 'ASC') return a[propName] < b[propName] ? -1 : a[propName] > b[propName] ? 1 : 0;
        if (type === 'DSC') return a[propName] > b[propName] ? -1 : a[propName] < b[propName] ? 1 : 0;
        return 0;
    };

    const orderbyAttribute = (props) => {
        const newMode = sort.mode === 'ASC' ? 'DSC' : 'ASC';
        setSort({ propertyName: props, mode: newMode });
        const newOrders = [...stateVar].sort(propComparator(props, newMode));
        setOrderDetails(newOrders);
    };

    const OrderAction = (action) => {
        const sql = `update orders set status='${action}',modified_by='${accountInfo.email}' where id=${id}`;
        if (action === 'UPD_ADDRESS'){
            navigate(`/updateAddress/${id}`) 
            }
         else if (action === 'COMMENTS') {
            navigate(`/addcomments/${id}`);
        } else if (action === 'STOCK') {
            navigate(`/STOCK/${id}`);
        } else {
            GetApiDataUpdate(sql)
                .then((res) => {
                    if (res > 0) {
                        toast.success("Order Updated");
                        navigate(-1);
                    } else {
                        toast.error("Error !!!");
                    }
                })
                .catch((e) => alert(e));
        }
    };

    const ActionOnData = (action) => {

    if (comp === "ALLORDERS") {
             const sql = `update orders set status='${action}',modified_by='${accountInfo.email}' where id in (${selectedRows.join(',')})`;
            if (action === 'CLEAR') {
            setSelectedRows([]);
              }
            else if (selectedRows.length === 0) {
            toast.error("No rows selected !");
              } 
              else {
                 GetApiDataUpdate(sql)
                .then((res) => {
                    if (res > 0) {
                        setSelectedRows([]);
                        toast.success(`Marked ${action}`);
                        // navigate(-1);
                    } else {
                        toast.error("Error !!!");
                    }
                })
                .catch((e) => alert(e));
        }
        }

        if (comp === "DELREPORT") {

           if (action === 'CLEAR') {
           setSelectedRows([]);
             }
           else if (selectedRows.length === 0) {
           toast.error("No rows selected !");
             } 
            else if (action === 'MANUAL' || action === 'DELIVERY') { 
            const sql = `update deliveries set manual_del='${action}' where order_id in (${selectedRows.join(',')})`;
                GetApiDataUpdate(sql)
               .then((res) => {
                   if (res > 0) {
                       setSelectedRows([]);
                       toast.success(`Marked ${action}`);
                       // navigate(-1);
                   } else {
                       toast.error("Error !!!");
                   }
               })
               .catch((e) => alert(e));
       }
       }
    };

    const filteredData = stateVar.filter(item =>
        (filters.STATUS ? (item.STATUS || '').toLowerCase() === filters.STATUS.toLowerCase() : true) &&
        (filters.DEL_MODE ? (item.DEL_MODE || '').toLowerCase() === filters.DEL_MODE.toLowerCase() : true) &&
        (filters.PAYMENT_UPD_BY ? (item.PAYMENT_UPD_BY || '').toLowerCase() === filters.PAYMENT_UPD_BY.toLowerCase() : true) &&
        (filters.LOCATION.length > 0 ? filters.LOCATION.includes(item.LOCATION) : true)
    );

    useEffect(() => {
        setOrderDetails(state);
    }, [state]);

    useEffect(() => {
        return () => setOrderDetails([]);
    }, [state]);

    return (
        <TableContainer>
            <ToastContainer position="top-center" autoClose={1000} />

            {comp === "TRANSACTIONDETAILS" &&
                <div className="d-flex justify-content-center">
                    <div className="btn btn-success m-1" onClick={() => navigate("/transactions")}>ADD TRANSACTION</div>
                </div>
            }

            {stateVar.length > 0 &&
                <>
                    {comp === "ORDERDETAILS" &&
                        <div className="d-flex justify-content-center">
                            {/* <div className="btn btn-success m-1" onClick={() => OrderAction("DELIVERED")}>DELIVERED</div>}
                            {/* <div className="btn btn-warning m-1" onClick={() => OrderAction("NEW")}>NEW</div> */}
                            <div className="btn btn-danger m-1" onClick={() => OrderAction("CANCELLED")}>CANCELLED</div> */
                            <div className="btn btn-info m-1" onClick={() => OrderAction("COMMENTS")}>COMMENTS</div>
                            <div className="btn btn-success m-1" onClick={() => OrderAction("STOCK")}>STOCK</div>
                            <div className="btn btn-warning m-1" onClick={() => OrderAction("UPD_ADDRESS")}>UPD ADDRESS</div>
                        </div>
                    }

                    {/* Filter Section */}
                    {comp === "ALLORDERS" &&
                    <div className="row my-2 justify-content-around">
                    {["STATUS", "DEL_MODE", "PAYMENT_UPD_BY"].map((key) => (
                        <div className="col-md-2" key={key}>
                            <select
                                className="form-select"
                                value={filters[key]}
                                onChange={(e) => setFilters({ ...filters, [key]: e.target.value })}
                            >
                                <option value="">{`All ${key.toUpperCase()}`}</option>
                                {getDistinctValues(stateVar, key).map((val, idx) => (
                                    <option key={idx} value={val}>{val}</option>
                                ))}
                            </select>
                        </div>
                    ))}
                
                    {/* Multi-select for LOCATION */}
                    <div className="col-md-3">
                        <select
                            className="form-select"
                            multiple
                            value={filters.LOCATION}
                            onChange={(e) => {
                                const options = Array.from(e.target.selectedOptions, option => option.value);
                                setFilters(prev => ({ ...prev, LOCATION: options }));
                            }}
                        >
                            {getDistinctValues(stateVar, "LOCATION").map((val, idx) => (
                                <option key={idx} value={val}>{val}</option>
                            ))}
                        </select>
                        <small className="text-muted">Hold Ctrl or Cmd to select multiple</small>
                    </div>
                
                    <div className="col-md-2">
                        <button
                            className="btn btn-outline-secondary w-100"
                            onClick={() => setFilters({
                                STATUS: '',
                                DEL_MODE: '',
                                PAYMENT_UPD_BY: '',
                                LOCATION: []
                            })}
                        >
                            Reset Filters
                        </button>
                    </div>
                </div>}
                {compListForCheckBoxes.includes(comp) && 
                        <div className="col-md-2 d-flex flex-column">
                            
                            <div className="d-flex justify-content-center">
                                <div className="btn text-white fw-bold m-1"> UPD STATUS </div>
                                <div className="btn btn-warning m-1" onClick={() => ActionOnData("DELIVERED")}>DELIVERED</div>
                                <div className="btn btn-success m-1" onClick={() => ActionOnData("NEW")}>NEW</div>
                            </div>

                            {compListForDelStatus.includes(comp) && 
                            <div className="d-flex justify-content-center">
                                <div className="btn text-white fw-bold m-1">DEL_TYPE </div>
                                <div className="btn btn-danger m-1" onClick={() => ActionOnData("MANUAL")}>MANUAL</div>
                                <div className="btn btn-info m-1" onClick={() => ActionOnData("DELIVERY")}>DELIVERY</div>
                            </div>}

                            <div className="d-flex justify-content-left">
                            <div className="btn btn-danger" onClick={() => ActionOnData("CLEAR")}>CLEAR</div>
                            </div>

                        </div> 
                }
                    <div className="d-flex justify-content-end">
                        <CSVLink className="text-danger csv-exporter mb-1" data={filteredData}>Export CSV</CSVLink>
                    </div>

                    <div className="table-responsive bordered">
                        <table className="table text-center">
                            <thead className="thead">
                                <tr className="header">
                                {compListForCheckBoxes.includes(comp) && (<th className="border">Select</th>)}
                                    {Object.keys(stateVar[0]).map((item, index) =>
                                        <th key={index} className="border">
                                            <ButtonContainer onClick={() => orderbyAttribute(item)}>
                                                <div className="row">
                                                    <div className={`col tab-headings ${sort.propertyName === item ? " text-danger" : ""}`}>{item}</div>
                                                </div>
                                            </ButtonContainer>
                                        </th>
                                    )}
                                </tr>
                            </thead>
                            <tbody className={`bod bg-${bgClr}`}>
                                {filteredData.map((dataArray, index) =>
                                    <tr key={index}>
                                         {compListForCheckBoxes.includes(comp) && (<td>
                                            <input
                                                type="checkbox"
                                                checked={selectedRows.includes(dataArray.ORDER_ID)}
                                                onChange={() => handleCheckboxChange(dataArray.ORDER_ID)}
                                            />
                                        </td>)}
                                        {Object.keys(state[0]).map((attrName, idx) =>
                                            <th key={idx} scope="row" className={`border tdata ${attrName === "PRICE" ? "text-danger" : "text-dark"}`}>
                                                {attrName === hyperLinks.attr
                                                    ? <Link className="text-danger col" to={`${hyperLinks.link}/${dataArray[attrName]}`}>{dataArray[attrName]}</Link>
                                                    : dataArray[attrName]}
                                            </th>
                                        )}
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </>
            }

            {stateVar.length === 0 && <AllSpinners />}
        </TableContainer>
    );
}

const TableContainer = styled.div`
// margin-top:5rem;
.thead {
    background:white;
}
.tab-headings{
    align-text:center;
    margin:0.25rem;
    font-weight:bold;
    color:var(--amzonChime);
}
.border{
    color:var(--csBlue);
    font-weight:none;
    padding:0;
    // border:none !important;
}
.bod{
    margin-top:1rem;
}
.col {
    font-size:0.7rem;
    font-weight:bold;
    }
.tdata{
    font-size:0.6rem;
}
@media (max-width:798px){
.csv-exporter{
    font-size:0.6rem;
}
.btn{
    width:8rem;
    font-size:0.8rem;
}
.col {
        font-size:0.6rem;
        // font-weight:bold;
        }
.tdata{
    color:white;
    font-size:0.6rem;
}
.border{
    padding:0;
        }
}
`

const ButtonContainer = styled.button`
background-color:transparent;
padding:none;
border:none;
`

