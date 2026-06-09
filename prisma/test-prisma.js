// test-prisma.js

require('dotenv').config()

const { PrismaClient } = require('@prisma/client')

console.log('PrismaClient loaded')

const prisma = new PrismaClient()

console.log('PrismaClient instantiated')