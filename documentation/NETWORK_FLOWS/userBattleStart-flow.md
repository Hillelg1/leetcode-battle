# the following is a flowchart of what happens when a user clicks on the battle button
### All requests regarding adding users to wait queue are done syncronously
#### For a future refactor we can have every match sent directly to the user instead of checing in public

```mermaid 
sequenceDiagram
    participant Client1
    participant Client2
    participant Server
    participant Database as DB
   
   Client1->>Server: GET /info (SockJs("/ws"))
   Server->>Client1: 200 OK Capabalities
   Note left of Client1: stomp.over("socket")
   Note left of Client1: socket.connect()
   Note left of Client1: socket.subscribe("/topic/match/public")
   Client1->>Server: SEND: /app/game/rejoin (existing match check)
   Server->>Client1: if match exists send to client else empty match
   Note left of Client1: if match subscribe to unique ID
   Client1->>Server: SEND: /app/game/join
   Note right of Server: checks for another user in waiting room 
   Note right of Server: if yes create match and send to /topic/public 
   Client2->>Server: SEND: /app/game/join
   Note right of Server: pop users from waiting room 
   Server->>Database: Query for random question 
   Database->>Server: return question
   Server->>Client1: finish building full match object and send over /topic/public
   Server->>Client2: finish building full match object and send over /topic/public
   Note left of Client1: subscribe to unique ID
   Note left of Client2: subscribe to unique ID

```
