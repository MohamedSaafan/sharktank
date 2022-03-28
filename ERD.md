## Schemas

### events

| name          | Data type |
| ------------- | --------- |
| id            | integer   |
| team a        | varchar   |
| team b        | varchar   |
| schedule_date | timestamp |
| is_scheduled  | boolean   |
| duration      | interval  |
| is_finished   | boolean   |

// now() + events.duration = the time that the event supposed to be finished at.

[comment]: <> (emaing the points let's see if they can derived from the other relationships or not! )

### creatures

| name        | Data type |
| ----------- | --------- |
| id          | serial    |
| event_id    | integer   |
| address     | varchar   |
| points      | integer   |
| team_id     | integer   |
| time_picked | timestamp |
| is_picked   | boolean   |
| is_dead     | boolean   |

### teams

| name | Data type |
| ---- | --------- |
| id   | serial    |
| name | varchar   |

### API End Points

api/v1/events

{
id:id,
state:"live","scheduled","notScheduled","finshed",
team_a:{
id:id,
name:"",
points:150,
},
team_b:{
id:id,
name:"",
points:150,
},
date:153216565125,
}

api/v1/events/:id

{
id:id,
team_a:{
id:id,
name:"",
points:150,
},
team_b:{
id:id,
name:"",
points:150,
},
}

api/v1/teams/:id/:eventID

{
id:id,
name:"",
points:150,
eaten_fish:[id,id,id,id]
}

api/v1/events/:id/:teamId/creatures

{
fishes:[
{
id:id,
ETH_address:ETHAddress,
is_picked:true,
}
]
}
