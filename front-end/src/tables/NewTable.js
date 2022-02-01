import React, {useState} from "react";
import {useHistory} from "react-router-dom";
import {makeTable} from "../utils/api";

function NewTable() {

    const [formState, setFormState] = useState({});
    const [errorMessage, setErrorMessage] = useState(null);
    const history = useHistory(); 
    
    const changeHandler = event => {
	event.preventDefault();
	const dataChange = formState; //is this reference or value?
	dataChange[event.target.id] = event.target.value; //will event.target.id work?
	if (event.target.id === "capacity") dataChange[event.target.id] = Number(event.target.value);
	setFormState(dataChange);
    }
    
    const submitHandler = async event => {
	event.preventDefault();
	if (formState.table_name.length === 1) {
	    setErrorMessage("table_name must be greater than one character");
	}
	else {
	    await makeTable(formState);
	    history.push("/");
	    history.goForward();
	}
	
    }

    const cancelHandler = event => {
	event.preventDefault();
	history.goBack();
    }
    return (
	<main>
	    {errorMessage !== null && <div className="alert alert-danger">{errorMessage}</div>}
	    <h1>Create a new table</h1>
	    <div className="d-md-flex bm-3">
		<form onSubmit={submitHandler}> {/*TODO*/}
		    <div className="form-group">
			<label for="table_name">Table Name:</label>
			<input type="text" name="table_name" id="table_name" onChange={changeHandler} placeholder="New Table" />
		    </div>
		    <div className="form-group">
			<label for="capacity">Capacity:</label>
			<input type="number" name="capacity" id="capacity" onChange={changeHandler} placeholder="1" />
		    </div>
		    <button className="btn btn-primary" type="submit">Create Table</button>
		    <button className="btn btn-secondary" onClick={cancelHandler}>Cancel</button>
		</form>
	    </div>
	</main>
    );
}

export default NewTable;
