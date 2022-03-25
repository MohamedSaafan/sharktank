## Schemas

### events

```

| name          | Data type |
| ----          | --------  |
| id            | integer   |
| team a        | varchar   |
| team b        | varchar   |
| schedule date | timestamp |
| is_scheduled  | boolean   |
| duration      | interval  |
| is_finished   | boolean   |


```

[comment]: <> (emaing the points let's see if they can derived from the other relationships or not! )

```

### creatures

```

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

```

### teams

```

| name | Data type |
| ---- | --------- |
| id   | serial    |
| name | varchar   |

```

```
