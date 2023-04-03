import express from 'express'
import { PrismaClient } from '@prisma/client'
import authMiddleware from '../middleware/index.js'

const prisma = new PrismaClient()

const router = express()

type User = {
  id: string
}

type Cars = {
  id: string
  plate: string
}

router.delete('/', authMiddleware, async function (req, res) {
  // eslint-disable-next-line dot-notation
  const { id: userId } = req['decoded'] as User
  const { id } = req.body as Cars

  try {
    const findCars = await prisma.cars.findMany({
      where: {
        userId,
      },
    })

    if (!findCars) {
      return res
        .status(400)
        .send({ error: true, message: 'Esse há carros cadastrados.' })
    }

    const cars = await prisma.cars.deleteMany({
      where: {
        id: {
          in: id,
        },
      },
    })

    res.status(200).send(cars)
  } catch (err) {
    return res
      .status(400)
      .send({ error: err, message: 'O registro de carro falhou.' })
  }
})

export default router
