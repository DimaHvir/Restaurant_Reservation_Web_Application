import React, { useEffect, useState } from "react";
import {useHistory, Link} from "react-router-dom"
import { listReservations, listTables, finishTable, updateStatus } from "../utils/api";
import { today, previous, next } from "../utils/date-time";
import useQuery from "../utils/useQuery";
import ErrorAlert from "../layout/ErrorAlert";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard() {
    const [reservations, setReservations] = useState([]);
    const [tables, setTables] = useState([]);
    const [reservationsError, setReservationsError] = useState(null);

    const history = useHistory();
    const query = useQuery();
    const date = query.get("date");
    const todaysDate = today();

    let previousDate = previous(todaysDate);
    let nextDate = next(todaysDate);
    
    if (date) {
	previousDate = previous(date);
	nextDate = next(date);
    }
    
    
    useEffect(loadDashboard, []);

    function loadDashboard() {
	const abortController = new AbortController();
	setReservationsError(null);
	listReservations({ date : date || todaysDate }, abortController.signal)
	    .then((res) => Array.isArray(res) ? setReservations(res) : setReservations([res]))
	    .catch(setReservationsError);
	listTables({}, abortController.signal)
	    .then(setTables)
	    .catch(setReservationsError);
	return () => abortController.abort();
    }

    const handleDelete = async event => {
	event.preventDefault();
	if (window.confirm("Is this table ready to seat new guests?")) {
	    await finishTable(event.target.id);
	    history.go(0);
	}
    }

    const handleCancel = event => {
	event.preventDefault();
	if (window.confirm("Do you want to cancel this reservation?")) {
	    updateStatus(event.target.id, "cancelled")
		.catch(setReservationsError);
	    history.go(0);
	}
    }
    
    const reservationList = reservations.map((res) => {
	return (
	    <div className="card" key={res.reservation_id}>
		<div className="card-body">
		    <h5 className="card-title">{`${res.last_name}, ${res.first_name}    ID: ${res.reservation_id}`}</h5>
		    <h6 className="card-subtitle mb-2 text-muted">{`${res.reservation_date}, ${res.reservation_time}`}</h6>
		    <h6 className="card-body" data-reservation-id-status={res.reservation_id}>{`Status : ${res.status}`}</h6>
		    {res.status === "booked" && <div> <a href={`/reservations/${res.reservation_id}/seat`} className="card-link">Seat Reservation</a> </div>}
		    {res.status === "booked" && <div> <a href={`/reservations/${res.reservation_id}/edit`} className="card-link">Edit</a> </div>}
		    {res.status === "booked" && <button className="btn btn-secondary" id={res.reservation_id} data-reservation-id-cancel={res.reservation_id} onClick={handleCancel}>Cancel</button>}
		</div>
	    </div>
	)
    });

    const tableList = tables.map((table) => {
	return (
	    <div className="card" key={table.table_id}>
		<div className="card-body">
		    <h5 className="card-title">{`${table.table_name}, Capacity : ${table.capacity}`}</h5>
		    <h6 className="card-subtitle mb-2 text-muted" data-table-id-status={table.table_id}>{table.reservation_id ? `occupied by group with id: ${table.reservation_id}` : "free"}</h6>
		    {table.reservation_id && <button className="btn btn-primary" id={table.table_id} data-table-id-finish={table.table_id} onClick={handleDelete}>Finish Table</button>}
		</div>
	    </div>
	)
    });
    
    return (
	<main>
	    <h1>Dashboard</h1>
	    <div className="d-md-flex mb-3">
		<h4 className="mb-0">Reservations for date {date || todaysDate}</h4>
	    </div>
	    <ErrorAlert error={reservationsError} />
	    <div className="container">
		<div className="row">
		    <div className="col-md">
			{reservationList}
		    </div>
		    <div className="col-md">
			{tableList}
		    </div>
		</div>
		<div className="row">
		    <Link to={`/dashboard/?date=${previousDate}`}><button className="btn btn-secondary">Previous</button></Link>
		    <Link to="/dashboard"><button className="btn btn-primary">Today</button></Link>
		    <Link to={`/dashboard/?date=${nextDate}`}><button className="btn btn-secondary">Next</button></Link>
		</div>
	    </div>
	</main>
    );
}

export default Dashboard;
