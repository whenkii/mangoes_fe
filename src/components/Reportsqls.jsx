import React,{useState,useEffect} from 'react'
import {useNavigate,useParams} from 'react-router-dom'
import axios from 'axios';
import DisplayTableData from './DisplayTableData'
import styled from 'styled-components'
// import {accountsContext} from '../contexts/accountsContext'
// import {productContext} from '../contexts/mangoesContext'
import {config} from './reactConfig'
import {AllSpinners} from './Spinners';

export function OrdersSummary(props) {
    const [isLoading,setIsLoading]= useState(true);
    const navigate = useNavigate();
    const {id}= useParams()
    // const [accountInfo] = useContext(accountsContext);
    const query = `select p.name,sum(qty) Total_Orders,sum((case when status='NEW' THEN qty ELSE 0 END)) NEW,sum((case when status='NEW' THEN 0 ELSE qty END)) DELIVERED
    from orders o,products p,deliveries d
    where o.prodid=p.id and o.id=d.order_id
    and latest='Y'
    and status != 'CANCELLED'
    group by p.name
    order by 2 desc` ;
    const [orderDetails,setOrderDetails]= useState([]);

    //Mount - Get Orders details
    useEffect(() => {
        axios.get(`${config.restAPIserver}:${config.restAPIHost}/api/getSqlresult/${query}`)
        .then((result) => {
            let {data} = result;
            let {rows} = data;
    //Set state once data is returned from AXIOS
        setOrderDetails(rows);
        setIsLoading(false);
                         })
        .catch((e) => {
            // console.log(query)
                       alert( `Couldn't get Orders from API\n ` + e);
                        })
    }, [query])
    //Unmount
    useEffect(() => () => {}, []) 
    return (
        <OrdeDetailsContainer className="container">
          { !isLoading ?
          <div>
            <DataHeader className="text-center p-1">ORDERS SUMMARY</DataHeader>
            <DisplayTableData state={orderDetails} id={id} comp="ORDERSUMMARY"/>
            <div className="d-flex justify-content-center">
                <div className="btn btn-warning btn-sized-md m-1" onClick={() => navigate(-1)}>Go Back</div>
                <div className="btn btn-success btn-sized-md m-1" onClick={() => navigate("/")}>Home</div>
            </div>
            </div>
            : <AllSpinners />
          }
        </OrdeDetailsContainer>
    )
}

export function OrdersSummaryByLocation(props) {
    const [isLoading,setIsLoading]= useState(true);
    const navigate = useNavigate();
    const {id}= useParams()
    // const [accountInfo] = useContext(accountsContext);
    const query = `select del_mode,location,p.name,sum(qty) Total_Orders,sum((case when status='NEW' THEN qty ELSE 0 END)) NEW,sum((case when status='NEW' THEN 0 ELSE qty END)) DELIVERED
    from orders o,products p,deliveries d
    where o.prodid=p.id and o.id=d.order_id
    and latest='Y'
    and status != 'CANCELLED'
    group by location,p.name,del_mode
    order by location desc` ;
    const [orderDetails,setOrderDetails]= useState([]);
    

    //Mount - Get Orders details
    useEffect(() => {
        axios.get(`${config.restAPIserver}:${config.restAPIHost}/api/getSqlresult/${query}`)
        .then((result) => {
            let {data} = result;
            let {rows} = data;
    //Set state once data is returned from AXIOS
        setOrderDetails(rows);
        setIsLoading(false);
                         })
        .catch((e) => {
                       alert( `Couldn't get Orders from API\n ` + e);
                        })
    }, [query])
    //Unmount
    useEffect(() => () => {}, []) 
    return (
        <OrdeDetailsContainer className="container">
          { !isLoading ?
          <div>
            <DataHeader className="text-center p-1">ORDERS SUMMARY - DELIVERIES</DataHeader>
            <DisplayTableData state={orderDetails.filter(a => a.DEL_MODE === 'delivery')} id={id} comp="ORDERSUMMARY"/>
            <DataHeader className="text-center p-1">ORDERS SUMMARY - SELF</DataHeader>
            {/* {console.log(orderDetails)} */}
            <DisplayTableData state={orderDetails.filter(a => a.DEL_MODE === 'self')} id={id} comp="ORDERSUMMARY"/>
            <div className="d-flex justify-content-center">
                <div className="btn btn-warning btn-sized-md m-1" onClick={() => navigate(-1)}>Go Back</div>
                <div className="btn btn-success btn-sized-md m-1" onClick={() => navigate("/")}>Home</div>
            </div>
            </div>
            : <AllSpinners />
          }
        </OrdeDetailsContainer>
    )
}

export function DeliveryReport(props) {
    const [isLoading,setIsLoading]= useState(true);
    const navigate = useNavigate();
    const {id}= useParams()
    // const [accountInfo] = useContext(accountsContext);
    const query = `SELECT * from deliveryreport_vw order by postalcode` ;
    const [orderDetails,setOrderDetails]= useState([]);

    //Mount - Get Orders details
    useEffect(() => {
        axios.get(`${config.restAPIserver}:${config.restAPIHost}/api/getSqlresult/${query}`)
        .then((result) => {
            let {data} = result;
            let {rows} = data;
    //Set state once data is returned from AXIOS
        setOrderDetails(rows);
        setIsLoading(false);
                         })
        .catch((e) => {
                       alert( `Couldn't get Orders from API\n ` + e);
                        })
    }, [query])
    //Unmount
    useEffect(() => () => {}, []) 
    return (
        <OrdeDetailsContainer className="container">
          { !isLoading ?
          <div>
            <DataHeader className="text-center p-1">ORDERS SUMMARY - LOCATION WISE</DataHeader>
            <DisplayTableData state={orderDetails} id={id} comp="ORDERSUMMARY"/>
            <div className="d-flex justify-content-center">
                <div className="btn btn-warning btn-sized-md m-1" onClick={() => navigate(-1)}>Go Back</div>
                <div className="btn btn-success btn-sized-md m-1" onClick={() => navigate("/")}>Home</div>
            </div>
            </div>
            : <AllSpinners />
          }
        </OrdeDetailsContainer>
    )
}



const OrdeDetailsContainer = styled.div`
margin-top:8rem;
`

const DataHeader = styled.h1`
background:white;
font-size:2rem;
// font-family: 'Brush Script MT', cursive;
font-family: 'Courier New', monospace;
font-weight:bold;
font-family: 'Courier New', monospace;
// color:var(--amazonChime);
border-radius:0.25rem;
box-shadow: 0 0 0.8rem 0.25rem rgba(0,0,0,1);
@media (max-width:390px)
{
    font-size:1.2rem;
    font-weight:bold;
}
`






