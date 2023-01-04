const express = require('express')
const app = express()
const cors = require('cors')


app.use(cors({
    "origin": "*",
    "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
    "preflightContinue": false,
    "optionsSuccessStatus": 204
}))



const { Admin, validate } = require('../models/admins')
const bcrypt = require('bcrypt')



// ----------------------  Funcionalidades do CRUD ----------------------------------

// Listagem de Admins
app.get('/', async (req, res) => {
    try {

        const admins = await Admin.find()
        if (!admins) {
            res.status(422).json({ message: 'Customer not found!' })
            return
        }
        res.status(200).json(admins)
    } catch (error) {
        res.status(500).json({ message: 'internal Server Error', error })
    }
})

app.post('/', async (req, res) => {
    try {
        const { error } = validate(req.body)
        if (error) {
            console.log(error)
            return res.status(400).json({ message: error.details[0].message })
        }
        // const { name, email, phone, address, cpf, password } = req.body
        const { name, password } = req.body
        const admin = await Admin.findOne({ name })

        if (admin) {
            return res.status(422)
                .json({ message: `User ${name} already exists.` })
        }
        const salt = await bcrypt.genSalt(Number(process.env.SALT))
        const hashPassword = await bcrypt.hash(password, salt)

        await Admin({ name, password: hashPassword }).save()
       
        res.status(201).json({ message: 'Customer created successfuly' })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'internal Server Error', error })
    }
})






module.exports = app