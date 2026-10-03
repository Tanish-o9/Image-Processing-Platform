const app =require('./src/app');
const connectdb = require('./src/config/db');

connectdb();

const port = process.env.PORT || 3000;

app.listen(port,"0.0.0.0", ()=>{
    console.log("server is running on",{port})
})