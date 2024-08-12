import express from "express";
import 'dotenv/config'
import fileUpload from "express-fileupload";



const PORT = process.env.PORT || 3000
const app = express()

//  middleware 
app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use(fileUpload())
app.use(express.static('public'))


app.get('/', (req, res) => {
return res.json({message : 'its working'})
})

// * inport routes 
import apiRoutes from './routes/apiRoutes.js'

app.use('/api',apiRoutes)

app.listen(PORT, () => {
    console.log(`server is running on ${PORT}`)
})
