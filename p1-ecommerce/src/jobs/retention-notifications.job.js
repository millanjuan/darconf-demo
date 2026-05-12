const { db } = require('../db')
const { sendEmail } = require('../email')
const { getDaysSince } = require('../utils/date')

// Cron: daily 00:00
// Dev 2's implementation — added as part of the "data retention notifications" feature
async function runRetentionNotifications() {
  const { rows: deletedUsers } = await db.query(`
    SELECT * FROM users
    WHERE deleted_at IS NOT NULL
  `)

  for (const user of deletedUsers) {
    const days = getDaysSince(user.deleted_at)

    if (days === 1) {
      await sendEmail(user.email, 'account-deleted')
    }

    if (days === 60) {
      await sendEmail(user.email, 'data-expiring-soon')
    }

    if (days === 90) {
      await sendEmail(user.email, 'data-permanently-deleted')

      // Dev 2: no physical delete existed anywhere in P1 — added it here to "complete" the flow
      await db.query('DELETE FROM users WHERE id = $1', [user.id])
    }
  }
}

module.exports = { runRetentionNotifications }
