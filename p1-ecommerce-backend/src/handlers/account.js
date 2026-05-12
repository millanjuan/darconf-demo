const { db } = require('../db')

// DELETE /api/account
async function deleteAccount(req, res) {
  const { userId } = req.user

  await db.query(
    'UPDATE users SET deleted_at = NOW() WHERE id = $1',
    [userId]
  )

  res.json({ message: 'Account deleted. Your data will be retained for 90 days per our Terms of Service.' })
}

module.exports = { deleteAccount }
