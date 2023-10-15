# 1. NO_SQL

### Implemented with MongoDB

### Clarification:
- Pagination implemented for both transaction and balance table, `with limit of 5 values for each page`
- Authentication and Authorization created for users using a middleware function
- Validation implemented for incoming request using  **Joi**
- Only registered users can access all `endpoints`
- MongoDB-compass used for local development

- Balance data format:
```js
{
    previous:1,
    next:3,
    data:[
         { 
            "accountNumber": "2059333979",
            "amount": "250,000"
            "createdAt": "2021-08-26T09:12:53.752Z",
            "updatedAt": "2021-08-26T09:12:53.752Z",
         } 
        ]
}

```

- Transaction data format:
```js
{
    previous:0,
    next:2,
    data:[
         { 
            "reference": "0c9e6ba7-242c-4ade-aec4-e1185c7e8633",
            "senderAccount": "2059333979",
            "receiverAccount": "8965431500",
            "amount": 850,
            "transferDescription": "just because it's saturday"
            "createdAt": "2021-08-26T09:16:44.209Z",
         } 
        ]
}

```

### Test Coverage:
- Database tested using mongodb-memory-server
- All endpoints tested `(GET, POST, PUT, DELETE)`


# 2. Mongo Aggregation.
- Contained in the Folder `MongoAggregation`

---

Mongo Aggregation Resource 

> https://www.w3resource.com/mongodb-exercises/#PracticeOnline
