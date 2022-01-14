# Restaurant_Reservation_Web_Application
[Link to Live Application](https://restaurant55423.herokuapp.com/dashboard)

## API

| API Call                                         | Description                                                                                                         |
| -------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| `/tables` GET                                 | Returns a list of all created tables                                       |
| `/tables` POST                             | Creates a new table                               |
| `/tables/:tableId/seat` PUT                        | Seats a reservation at a table                                         |
| `/tables/:tableId/seat` DELETE                   | Finishes a table reservation                                                                                         |
| `/reservations` GET                              | Returns a list of all reservations (can take query parameters for data and mobile_number)                                                                                              |
| `/reservations` POST                 | Creates a new reservation                                                                              |
| `/reservations/:reservationId` GET                     | Returns the reservation with the given reservationId param, if exists                                                                         |
| `/reservations/:reservationId` PUT | updates specified reservation, if exists                                                                         |
| `/reservations/:reservationId/status` PUT     | updates the status of a reservation                                                                             |

## Screenshots
![Screenshot from 2021-12-23 13-21-11](https://user-images.githubusercontent.com/23668472/149558809-e9b0a593-3251-42ff-94d6-47b55b5b8b4d.png)
![Screenshot from 2021-12-23 13-20-17](https://user-images.githubusercontent.com/23668472/149558829-5b8e2cf0-2445-4c40-91d7-2227ea7b0f43.png)
![Screenshot from 2021-12-23 13-18-00](https://user-images.githubusercontent.com/23668472/149558845-83f8bcaa-50b0-410d-975a-fe96478b69be.png)
![Screenshot from 2021-12-23 13-18-40](https://user-images.githubusercontent.com/23668472/149558859-425211f0-507d-4e3e-b65b-f4d5a23f8acf.png)
![Screenshot from 2021-12-23 13-19-00](https://user-images.githubusercontent.com/23668472/149558879-9d7d31cc-9e53-4f76-9b40-b124466f0c09.png)

## Program Summary
This application can be used from the context of a restuaranter to organize reservations and keep the state of the restuarant as tables are seated and finished. 
The user can add new reservations, new tables, and manage the state of those reservations and tables.
The user can also find reservations by the phone number associated with the reservation.
Validation built into the input fields and server will inform the user on if a reservation is unavailable, making it easier to ensure there is rarely a need to update the validity of a reservation. You also will not be able to seat a reservation at a table that cannot accomodate the party.

## Install on your Machine

1. Clone this repository
2. Run ```npm install``` for both the backend and frontend folders
3. Update the ```./back-end/.env``` file with links to a postgreSQL instance
4. run ```npx migrate:latest``` on the backend to create the appropriate tables in your database
5. run ```cp ./front-end/.env.sample ./front-end/.env``` and update the ```.env``` file if needed
6. run ```npm start``` for the backend and frontend to start the program

## Technology Used

- Node.js
- Express.js
- React.js
- PostgreSQL
- Deployed with Heroku
