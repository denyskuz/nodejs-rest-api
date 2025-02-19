const Contact = require('./schemas/contact')

const getAllContacts = async (data) => {
  const { page = 1, limit = 500, favorite } = data;
  const query = favorite && { favorite } || {};

  return Contact.find(query).limit(limit * 1)
      .skip((page - 1) * limit)
}

const getContactById = (id) => {
  return Contact.findOne({ _id: id })
}

const createContact = ({ name, email, phone, favorite }) => {
  return Contact.create({ name, email, phone, favorite })
}

const updateContact = (id, fields) => {
  return Contact.findByIdAndUpdate({ _id: id }, fields, { new: true })
}

const removeContact = (id) => {
  return Contact.findByIdAndRemove({ _id: id })
}

module.exports = {
  getAllContacts,
  getContactById,
  createContact,
  updateContact,
  removeContact,
}
