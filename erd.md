+----------------+     +----------------+     +----------------+
|     Users      |     |   Customers    |     |     Buses      |
+----------------+     +----------------+     +----------------+
| user_id (PK)   |     | customer_id(PK)|     | bus_id (PK)    |
| username       |     | name           |     | bus_number     |
| password_hash  |     | phone (unique) |     | capacity       |
| email          |     | email          |     | bus_type       |
| role (emp/admin)|    | address        |     | chair_count    |
| created_at     |     | created_at     |     | created_at     |
+----------------+     +----------------+     +----------------+
       |                        |                        |
       |                        |                        |
       v                        v                        v
+----------------+     +----------------+     +----------------+
|   Bookings     |     |     Trips      |     |  Audit Logs    |
+----------------+     +----------------+     +----------------+
| booking_id(PK) |     | trip_id (PK)   |     | log_id (PK)    |
| trip_id (FK)   |<----| bus_id (FK)    |     | user_id (FK)   |
| customer_id(FK)|<----| departure      |     | action_type    |
| user_id (FK)   |     | destination    |     | description    |
| seat_number    |     | departure_time |     | timestamp      |
| booking_date   |     | arrival_time   |     | ip_address     |
| status         |     | status         |     | details (JSON) |
| price          |     | available_seats|     +----------------+
| payment_status |     | created_by (FK)|-----> users
| created_at     |     +----------------+
| updated_at     |          |
+----------------+          |
       |                    |
       |                    v
       |          +----------------+
       |          |   History      |
       |          +----------------+
       |          | history_id(PK) |
       |          | booking_id(FK) |
       +--------->| action_type    |
                  | previous_status|
                  | new_status     |
                  | changed_by(FK) |
                  | timestamp      |
                  | remarks        |
                  +----------------+


                  