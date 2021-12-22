import React, {useState, useEffect} from "react";
import {useHistory, Link} from "react-router-dom";
import {listReservations} from "./utils/api";
import ErrorAlert from "./layout/ErrorAlert";

function Search() {
    const [searchResults, setSearchResults] = useState([]);
    const [reservationsError, setReservationsError] = useState(null);
    const [notFound, setNotFound] = useState(false);
    const history = useHistory();
    
    const cancelHandler = event => {
	event.preventDefault();
	history.push("/");
	history.goForward();
    }
    
    const submitHandler = event => {
	event.preventDefault();
	setSearchResults([]);
	setReservationsError(null);
	setNotFound(false);
	listReservations({mobile_number : event.target.mobile_number.value})
	    .then((res) => res.length === 0 ? setNotFound(true) : setSearchResults(res))
	    .catch(setReservationsError);
    }
    
    let foundReservations = searchResults.map((res) => {
	return (
	    <div className="card" key={res.reservation_id}>
		<div className="card-body">
		    <h5 className="card-title">{`${res.last_name}, ${res.first_name}`}</h5>
		    <h6 className="card-subtitle mb-2 text-muted">{`${res.reservation_date}, ${res.reservation_time}`}</h6>
		    <h6 className="card-body" data-reservation-id-status={res.reservation_id}>{`Status : ${res.status}`}</h6>
		    {res.status === "booked" && <a href={`/reservations/${res.reservation_id}/seat`} className="card-link">Seat Reservation</a>}
		    {res.status === "booked" && <a href={`/reservations/${res.reservation_id}/edit`} className="card-link">Edit Reservation</a>}
		</div>
	    </div>
	);
    });

    return (
	<main>
	    {notFound && <div class="alert alert-danger">No Reservations Found</div>}
	    <h1>Find a reservation</h1>
	    <div className="d-md-flex bm-3">
		<form onSubmit={submitHandler}>
		    <div className="form-group">
			<label for="mobile_number">Phone Number:</label>
			<input name="mobile_number" type="tel" pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}" id="mobile_number"  required/>
		    </div>
		    <button type="submit" className="btn btn-primary">Find Reservation</button>
		    <button className="btn btn-secondary" onClick={cancelHandler}>Cancel</button>
		</form>
		<ErrorAlert error={reservationsError} />
		<div>
		    {foundReservations}
		</div>
	    </div>
	</main>);
}

export default Search;
