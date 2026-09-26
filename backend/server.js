const app =require('./src/app');
const connectdb = require('./src/config/db');

connectdb();

const port = 3000

app.listen(port,()=>{
    console.log("server is running on",{port})
})