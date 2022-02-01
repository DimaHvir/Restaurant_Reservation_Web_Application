import React, {useEffect, useState} from "react";
import {useHistory, useParams} from "react-router-dom";
import {listReservations, makeReservation, updateReservation} from "../utils/api";

function EditReservation() {
    const [reservation, setReservation] = useState({});
    const [formState, setFormState] = useState({});
    const [errorMessage, setErrorMessage] = useState(null);
    const {reservationId} = useParams();
    const history = useHistory();
    const today = new Date();

    useEffect(() => {
	const abortController = new AbortController();
	async function fetchData() {
	    const foundReservation = await fetchReservation(reservationId, abortController.signal);

	    if (!foundReservation) {
		console.log("bad path");
		history.push("/");
		history.goForward();
	    }

	    setReservation(foundReservation[0]);
	    setFormState(foundReservation[0]);
	}
	if (reservationId) {
	    fetchData();
	}
	return () => abortController.abort();
    }, [reservationId, history]);

    async function fetchReservation(reservation_id, signal) {
	return await listReservations({reservation_id}, signal);
    }
    
    const cancelHandler = event => {
	event.preventDefault();
	history.goBack();
    }

    const changeHandler = event => {
	event.preventDefault();
	const dataChange = formState; //is this reference or value?
	dataChange[event.target.id] = event.target.value; //will event.target.id work?
	if (event.target.id === "people") dataChange[event.target.id] = Number(dataChange[event.target.id])
	setFormState(dataChange);
    }

    const submitHandler = async event => {
	event.preventDefault();
	if (reservationId) {
	    await updateReservation(reservationId, formState);
	    history.push(`/dashboard/?date=${formState.reservation_date}`);
	    history.goForward();
	}
	const {reservation_time, reservation_date} = formState;
	const currentTime = `${today.getHours()}:${today.getMinutes()}`;
	const resDate = new Date(reservation_date);
	const resdateDate = resDate.getDate();
	const todayDate = today.getDate();
	if (resdateDate + 1 < todayDate || reservation_time > '21:30' || reservation_time < '10:30' || resDate.getDay() === 1) {
	    setErrorMessage("Reservation date is either on a Tuesday or is outside of resturant open times");
	}
	else if (resdateDate + 1 === todayDate && reservation_time < currentTime) {
	    setErrorMessage("This time has already passed");
	}
	else {
	    if (reservationId) {
		await updateReservation(reservationId, formState);
		history.push(`/dashboard/?date=${formState.reservation_date}`);
		history.goForward();
	    }
	    else {
		await makeReservation(formState);
		history.push(`/dashboard/?date=${formState.reservation_date}`);
		history.goForward();
	    }
	}	
    }
    
    return (
	<main>
	    {errorMessage !== null && <div className="alert alert-danger">{errorMessage}</div>}
	    <h1>{reservationId ? `Edit Reservation of ID ${reservation.reservation_id}` : `Create a new reservation`}</h1>
	    <div className="d-md-flex bm-3">
		<form onSubmit={submitHandler}>
		    <div className="form-group">
			<label for="first_name">First Name:</label>
			<input name="first_name" type="text" id="first_name" placeholder={reservation.first_name} onChange={changeHandler}/>
		    </div>
		    <div className="form-group">
			<label for="last_name">Last Name:</label>
			<input name="last_name" type="text" id="last_name" placeholder={reservation.last_name} onChange={changeHandler}/>
		    </div>
		    <div className="form-group">
			<label for="mobile_number">Mobile Number:</label>
			<input name="mobile_number" type="text" id="mobile_number" onChange={changeHandler} placeholder={reservation.mobile_number}/>
		    </div>
		    <div className="form-group">
			<label for="reservation_date">Reservation Date:</label>
			<input name="reservation_date" type="date" id="reservation_date" placeholder={reservation.reservation_date} onChange={changeHandler}/>
		    </div>
		    <div className="form-group">
			<label for="reservation_time">Reservation Time:</label>
			<input name="reservation_time" type="time" id="reservation_time" placeholder={reservation.reservation_time} onChange={changeHandler}/>
		    </div>
		    <div className="form-group">
			<label for="people">Number of Guests:</label>
			<input name="people" type="number" id="people" placeholder={reservation.people}  min="1" max="6" onChange={changeHandler}/>
		    </div>
		    <button className="btn btn-primary" type="submit">{reservationId ? 'submit' : 'Make Reservation'}</button>
		    <button className="btn btn-secondary" onClick={cancelHandler}>Cancel</button>
		</form>
	    </div>
    </main>
    );
}

export default EditReservation;
