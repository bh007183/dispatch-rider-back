const db = require("./models");

let users = [
    {
        id:1,
       firstName: "Ben",
       lastName: "Hopkins",
       username: "Idiot",
       email: "idiot@idiot.com",
       password: "test",
    //    UserId: 2
      },
    {
        id:2,
       firstName: "Sam",
       lastName: "Oberg",
       username: "smart",
       email: "smart@smart.com",
       password: "test1",
    //    UserId: 1
      },
    {
        id:3,
       firstName: "Banner",
       lastName: "Hulk",
       username: "strong",
       email: "strong@strong.com",
       password: "test2",
    //    UserId: "[1, 2]"
      },
      

]
let message = [
    {
        
       message: "Lorem Ipsom test test 12434",
       participants: ["1", "2"],
       author: 4
       
      },
    {
        
       message: "Frank Test Test Test",
       participants: ["1", "4"],
       author: 1
       
      },
    {
        
       message: "group text",
       participants: ["1", "2", "3", "4"],
       author: 4
       
      },
      

]

const seed = () => {
    return db.User.bulkCreate(users).then(res => db.Message.bulkCreate(message)).catch(err => console.error(err))
}


seed();
module.exports = users
module.exports = message