import React, {useState, useEffect} from "react";
import {useHistory, useParams} from "react-router-dom";
import {listReservations, listTables, seatTable} from "../utils/api";


function SeatReservation() {
    
    const [reservation, setReservation] = useState({});
    const [tables, setTables] = useState([]);
    const {reservationId} = useParams();
    const history = useHistory();
    console.log(reservationId);
    
    useEffect(() => {
	const abortController = new AbortController();
	console.log(reservationId);
	async function fetchData() {
	    const foundReservation = await fetchReservation(reservationId, abortController.signal);
	    const foundTables = await fetchTables(abortController.signal);

	    if (!foundReservation) {
	    console.log("bad path");
		history.push("/");
		history.goForward();
	    }
	    setReservation(foundReservation[0]);
	    setTables(foundTables);
	}

	fetchData();
	return () => abortController.abort();
    }, [history, reservationId]);

    async function fetchReservation(reservation_id, signal) {
	return await listReservations({reservation_id}, signal);
    }

    async function fetchTables(signal) {
	return await listTables({}, signal);
    }

    async function handleSubmit(event) {
	event.preventDefault();
	await seatTable(event.target.select_table.value, reservationId);
	history.push("/");
	history.goForward();
    }
    
	const options = tables.filter((table) => !table.reservation_id)
	      .map((table) => {
		  return (<option key={table.table_id} id={table.table_id} value={table.table_id}>
			      {table.table_name} - {table.capacity}
			  </option>);
	      });
	
    return (<main>
		<h1>Seat this table</h1>
		<div className="d-md-flex bm-3">
		    <form onSubmit={handleSubmit}>
			<select name="table_id" id="select_table" required>
			    {options}
			</select>
			<button type="submit" className="btn btn-primary">Seat Table</button>
		    </form>
		</div>
	    </main>
	   );
}

export default SeatReservation;
