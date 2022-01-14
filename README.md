# Restaurant_Reservation_Web_Application
[Link to Live Application](https://restaurant55423.herokuapp.com/dashboard)

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
