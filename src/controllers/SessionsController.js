const knex = require('../database/knex')
const authConfig = require('../configs/auth')
const { compare } = require('bcryptjs')
const { sign } = require('jsonwebtoken')

class SessionsController{
    async create(request, response){
        const { email, password } = request.body

        const user = await knex("users").where({ email }).first()
        if(!user) return response.status(401).json({ message: "Email inválido."} )

        const passwordMatched = await compare(password, user.password)
        if(!passwordMatched) return response.status(401).json({ message: "Senha incorreta."} )

        const { secret, expiresIn } = authConfig.jwt
        const token = sign({}, secret, {
            subject: String(user.id),
            expiresIn
        })

        return response.json({ user, token })
    }
}

module.exports = SessionsController