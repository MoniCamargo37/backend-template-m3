# Project's name REST API
## Description

This is a the backend repository for the React application `Trippo`.

---

## Instructions

When cloning the project, change the <code>sample.env</code> file name for <code>.env</code>. The project will run on **PORT 8000**.

Then, run:
```bash
npm install
```
## Scripts

- To start the project run:
```bash
npm run start
```
- To start the project in development mode, run:
```bash
npm run dev
```
- To seed the database, run:
```bash
npm run seed
```
---

## Models

### User

Users in the database have the following properties:

```js
{
  email: {
    type: String,
    unique: true,
    required: true
  },
  hashedPassword: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  }
},
```
### Trip

Trip in the database have the following properties:

```js


const tripSchema = new Schema({
  name: {
    type: String,
  },
  city: {
    type: String,
    required: true
  },
  tripDuration: {
    type: Number,
    required: true,
    min: 1,
    max: 7
  },
  numTravellers: {
    type: Number,
    required: true,
    min: 1,
  },
  monthOfTrip: {
    type: String,
    required: true
  },

  tripType: {
    type: String,
    enum: ['aventurero', 'relajado', 'romantico', 'familiar']
  },
  budget: {
    type: Number,
    required: true,
    validate: {
      validator: function(value) {
        return value >= 100 && value <= 10000;
      },
      message: 'El presupuesto debe estar entre 100 y 10000 euros.'
    }
  },
  days: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Day'
    }
  ],
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  }
},
{
  timestamps: true
  
});

```
### CityOveview

CityOverview in the database have the following properties:

```js
const cityOverviewSchema = new Schema({
  itineraryPic: {
    type: String,
  
  },
  cityName: {
    type: String,
   
  },
  country: {
    type: String,

  },
  description: {
    type: String,

  },
  numSearches: {
    type: Number,

  },
  destinationPics: {
    type: [String],

  },
  coordinates: {
    type: String,
  }
  
},
{
  timestamps: true
  
});

```
### Day

Day in the database have the following properties:

```js
const daySchema = new Schema([
  {
    name: String,
    picture: String,
    activities: [{
      name: String,
      description: String,
      duration: String
    }]
  }
  
]);

```

## API endpoints and usage 

| Action             | Method    | Endpoint             | Req.body                        | Private/Public |
|--------------------|-----------|----------------------|---------------------------------|-----------------|
| SIGN UP user       | POST      | /api/v1/auth/signup  | { username, email, password }   |    Public |                 
| LOG IN user        | POST      | /api/v1/auth/login   | { email, password }             |    Public |                  
| GET logged in user | GET       | /api/v1/auth/me    |   | Private |
| SEE PROFILE user   | GET       | /api/v1/profile   |                                 |    Private|                 
| EDIT PASSWORD user     | PUT      | /api/v1/profile/editar-contrasena   | { currentPassword, newPassword, newPasswordConfirmation  }             |    Private| 
| EDIT PHOTO user   | PUT      | /api/v1/profile/editar-foto    |     { username }       |    Private|   
| DELETE PHOTO user   | DELETE      | /api/v1/profile/borrar-foto    |         |    Private|      
| GET ALL CITYOVERVIEWS  | GET      | /api/v1/city-overview    |         |    Public|    
| GET most searched city  | GET      | /api/v1/city-overview/mostSearched   |         |    Public|  
| GET cityOverview by city name | GET      | /api/v1/city-overview/:city   |         |    Public|  
| DELETE cityOverview from DB by admin | DELETE     | /api/v1/city-overview/delete/:id   |         |    Private|  
| GET ALL TRIPS user   | GET       | /api/v1/trip  |                                 |    Private|  
| CREATE A activities plan  user   | POST      | /api/v1/trip/actividades  |   { city, tripDuration, numTravellers, monthOfTrip, tripType, budget, searchedCity }                               |    Private| 
| CREATE & SAVE a trip plan user        | POST      | /api/v1/trip  | { tripPlan, days }            |    Private| 
 | EDIT A TRIP PLAN  user        | PUT     | /api/v1/trip/:tripId |{ name, numTravellers, budget }           |    Private|   
  | DELETE a trip plan user        | DELETE   | /api/v1/trip/:tripId |       |    Private| 
     

## Useful links

- [Presentation slides](https://1drv.ms/p/s!Akm3TPUfj8PLhnREb--vgYQ0EYuP?e=TeqChp)
- [Frontend repository](https://github.com/MoniCamargo37/FRONTEND-TRIPPO-m3)
- [Frontend deploy]()
- [Deployed REST API](https://trippo.fly.dev/)

