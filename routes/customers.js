const express = require('express')
const app = express()
const cors = require('cors')


app.use(cors({
    "origin": "*",
    "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
    "preflightContinue": false,
    "optionsSuccessStatus": 204
}))


const { Customers, validate } = require('../models/customers')
const bcrypt = require('bcrypt')



// ----------------------  Funcionalidades do CRUD ----------------------------------

// Listagem de Clientes
app.get('/', async (req, res) => {
    try {

        const customers = await Customers.find()
        if (!customers) {
            res.status(422).json({ message: 'Cliente não encontrado!' })
            return
        }
        res.status(200).json(customers)
    } catch (error) {
        res.status(500).json({ message: 'internal Server Error', error })
    }
})

// Criação de um Cliente
app.post('/', async (req, res) => {
    try {
        const { error } = validate(req.body)
        if (error) {
            console.log(error)
            return res.status(400).json({ message: error.details[0].message })
        }

        const { name, email, phone, address, cpf } = req.body
        // const customers = await Customers.findOne({ name })

     
        await Customers({ name, email, phone, address, cpf }).save()
        res.status(201).json({ message: 'Cliente criado com sucesso!' })

    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'internal Server Error', error })
    }
})

// pesquisa de clientes por id
app.get('/:id', async (req, res) => {
    const id = req.params.id
    try {
        const customers = await Customers.findOne({ _id: id })

        if (!customers) {
            res.status(422).json({ message: 'Cliente não encontrado!' })
            return
        }

        res.status(200).json(customers)

    } catch (error) {
        res.status(500).json({ message: 'internal Server Error', error })
    }
})

// Atualização de clientes por id
app.patch('/:id', async (req, res, next) => {
    const id = req.params.id
    const { name, email, phone, address, cpf } = req.body


    try {

        const newCustomers = await Customers.updateOne({ _id: id },
            { name, email, phone, address, cpf })
        if (newCustomers) {
            // console.log(newCustomers) 
        }

        if (!newCustomers) {
            res.status(422).json({ message: "Cliente não encontrado" })
        }
        res.status(200).json({ message: 'Cliente atualizado com sucesso!' })
    } catch (error) {

        res.status(500).json({ message: 'internal !Server! Error', error })

    }
})

// Deleção de Clientes por id
app.delete('/:id', async (req, res) => {
    const id = req.params.id
    const customers = await Customers.findOne({ _id: id })

    if (!customers) {
        res.status(422).json({ message: 'Cliente não encontrado' })
        return
    }
    try {
        await Customers.deleteOne({ _id: id })


        res.status(200).json({ message: 'Cliente deletado com sucesso!' })

    } catch (error) {
        res.status(500).json({ message: 'internal Server Error', error })
    }
})



module.exports = app