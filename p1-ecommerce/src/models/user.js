const createUser = () => ({
  id: '',
  email: '',
  name: '',
  createdAt: null,
  deletedAt: null, // soft delete — NULL means active
  metricsProcessed: false,
})

module.exports = { createUser }
