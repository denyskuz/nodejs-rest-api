const service = require('../service')
const chalk = require('chalk');
const { NotFound } = require('http-errors');

const get = async (req, res, next) => {
  try {
    const results = await service.getAllContacts(req.query)
    res.json({
      status: 'success',
      code: 200,
      data: {
        contacts: results,
      },
    }) 
  } catch (e) {
    console.error(e)
    next(e)
  }
}

const getById = async (req, res, next) => {
  const { id } = req.params
  try {
      const result = await service.getContactById(id);
      res.json({
        status: 'success',
        code: 200,
        data: { contact: result },
      })
  } catch (e) {
  if (e.name === "CastError") {
      next(NotFound(`Not found contact id`))
  }
    next(e)
  }
}

// @TODO: Needs to refactor validation (using validation from mongoose Scheme)
const create = async (req, res, next) => {
  const { name, email, phone, favorite = false } = req.body
  const isExistBody = Object.keys(req.body).length;
   if (!isExistBody) { 
      res.status(400).json({ "message": "missing fields !" });
      return;
    }
  try {
    const result = await service.createContact({ name, email, phone, favorite })
    res.status(201).json({
      status: 'success',
      code: 201,
      data: { contact: result },
    })
  } catch (e) {
    console.error(chalk.red(e))
    next(e)
  }
}

// @TODO: Needs to refactor validation (using validation from mongoose Scheme)
const update = async (req, res, next) => {
  const { id } = req.params
  const { name, email, phone } = req.body
  const isExistBody = Object.keys(req.body).length;
   if (!isExistBody) { 
      res.status(400).json({ "message": "missing fields !" });
      return;
    }
  try {
    const result = await service.updateContact(id, { name, email, phone })
    if (result) {
      res.json({
        status: 'success',
        code: 200,
        data: { contact: result },
      })
    } else {
      res.status(404).json({
        status: 'error',
        code: 404,
        message: `Not found contact id: ${id}`,
        data: 'Not Found',
      })
    }
  } catch (e) {
    console.error(e)
    next(e)
  }
}

// @TODO: Needs to refactor validation (using validation from mongoose Scheme)
const updateStatus = async (req, res, next) => {
  const { id } = req.params
  const { favorite = false } = req.body
  const isExistBody = Object.keys(req.body).length;
  
  if (!isExistBody) { 
    res.status(400).json({ "message": "missing field favorite" });
    return;
  }
  try {
    const result = await service.updateContact(id, { favorite })
    if (result) {
      res.json({
        status: 'success',
        code: 200,
        data: { contact: result },
      })
    } else {
      res.status(404).json({
        status: 'error',
        code: 404,
        message: `Not found contact id: ${id}`,
        data: 'Not Found',
      })
    }
  } catch (e) {
    console.error(chalk.red(e))
    next(e)
  }
}

// @TODO: Needs to refactor validation (using validation from mongoose Scheme)
const remove = async (req, res, next) => {
  const { id } = req.params

  try {
    const result = await service.removeContact(id)
    if (result) {
      res.json({
        status: 'success',
        code: 200,
        data: { contact: result },
      })
    } else {
      res.status(404).json({
        status: 'error',
        code: 404,
        message: `Not found contact id: ${id}`,
        data: 'Not Found',
      })
    }
  } catch (e) {
    console.error(chalk.red(e))
    next(e)
  }
}

module.exports = {
  get,
  getById,
  create,
  update,
  updateStatus,
  remove,
}
