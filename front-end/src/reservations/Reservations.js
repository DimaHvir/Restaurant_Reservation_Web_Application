import React, {useState, useEffect} from "react";
import {listReservations} from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";

function Reservations() {
    const [reservations, setReservations] = useState([]);
    const [reservationsError, setReservationsError] = useState(null);

    useEffect(loadReservations, []);

    function loadReservations() {
	const abortController = new AbortController();
	setReservationsError(null);
	listReservations({}, abortController.signal)
	    .then(setReservations)
	    .catch(setReservationsError);
	return () => abortController.abort();
    }

    return (
	<main>
	    <h1>Reservations</h1>
	    <div className="d-md-flex mb-3">
		<h4 className="mb-0">Reservations</h4>
	    </div>
	    <ErrorAlert error={reservationsError} />
	    {JSON.stringify(reservations)}
	</main>
    );
}

export default Reservations;
