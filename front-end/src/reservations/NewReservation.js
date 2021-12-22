import React, {useState, useEffect} from "react";
import {useHistory} from "react-router-dom";
import {makeReservation} from "../utils/api";

function NewReservation() {
    
    const [formState, setFormState] = useState({});
    const [errorMessage, setErrorMessage] = useState(null);
    const history = useHistory();

    const cancelHandler = event => {
	event.preventDefault();
	history.goBack();
    }

    const changeHandler = event => {
	event.preventDefault();
	const dataChange = formState; //is this reference or value?
	dataChange[event.target.id] = event.target.value; //will event.target.id work?
	setFormState(dataChange);
    }

    const submitHandler = async event => {
	event.preventDefault();
	const {reservation_time, reservation_date} = formState;
	const today = new Date();
	const currentTime = `${today.getHours()}:${today.getMinutes()}`;
	console.log(currentTime);
	const resDate = new Date(reservation_date);
	if (resDate.getDate() + 1 < today.getDate() || reservation_time > '21:30' || reservation_time < '10:30' || resDate.getDay() === 1) {
	    setErrorMessage("Reservation date is either on a Tuesday or is outside of resturant open times");
	}
	else if (resDate.getDate() + 1 === today.getDate() && reservation_time < currentTime) {
	    setErrorMessage("This time has already passed")
	}
	else {
	    await makeReservation(formState);
	    history.push("/");
	    history.goForward();
	}
    }

    return (
	<main>
	    {errorMessage !== null && <div className="alert alert-danger">{errorMessage}</div>}
	    <h1>Create a new reservation</h1>
	    <div className="d-md-flex bm-3">
		<form onSubmit={submitHandler}>
		    <div className="form-group">
			<label for="first_name">First Name:</label>
			<input name="first_name" type="text" id="first_name" placeholder="John" onChange={changeHandler} required/>
		    </div>
		    <div className="form-group">
			<label for="last_name">Last Name:</label>
			<input name="last_name" type="text" id="last_name" placeholder="Smith" onChange={changeHandler} required/>
		    </div>
		    <div className="form-group">
			<label for="mobile_number">Mobile Number:</label>
			<input name="mobile_number" type="text" id="mobile_number" onChange={changeHandler} placeholder="8888888888" required />
		    </div>
		    <div className="form-group">
			<label for="reservation_date">Reservation Date:</label>
			<input name="reservation_date" type="date" id="reservation_date" onChange={changeHandler} required />
		    </div>
		    <div className="form-group">
			<label for="reservation_time">Reservation Time:</label>
			<input name="reservation_time" type="time" id="reservation_time" min="10:30" max="21:30" onChange={changeHandler} required/>
		    </div>
		    <div className="form-group">
			<label for="people">Number of Guests:</label>
			<input name="people" type="number" id="people" placeholder="0" min="1" max="6" onChange={changeHandler} required/>
		    </div>
		    <button className="btn btn-primary" type="submit">Make Reservation</button>
		    <button className="btn btn-secondary" onClick={cancelHandler}>Cancel</button>
		</form>
	    </div>
    </main>
    );
}

export default NewReservation;
