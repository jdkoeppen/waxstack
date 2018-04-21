WaxStack: A Painfully Manual Record Collection

POST /users { userName, password } 
    => return <User Object>

     /auth { userName, password }
     => return <authToken>

----------------------------------------------
All routes below must have auth token
----------------------------------------------

GET /refresh returns <authToken>

POST /records { }    


//album.Schema

track.Schema = {
	title: String,
	subTrack: String,
	length: Date //0:00 locale time string for hr:min:sec
},

sort.filter = mongoose method to pull from db sorted?

