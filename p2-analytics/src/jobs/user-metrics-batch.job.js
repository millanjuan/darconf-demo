const { db } = require('../db')
const { computeLifetimeMetrics, computeChurnAnalysis } = require('../metrics')
const { confirmDeletionToComplianceSystem } = require('../compliance')

// Processes final metrics for soft-deleted users, then executes physical deletion.
// This is the ONLY place where physical deletion happens — by design.
async function processDeletedUserMetrics() {
  const { rows: pendingUsers } = await db.query(`
    SELECT * FROM users
    WHERE deleted_at IS NOT NULL
      AND metrics_processed = false
  `)

  // If Dev 2's cron job in P1 already ran DELETE on these users,
  // pendingUsers will be empty — metrics are never computed,
  // compliance confirmation never fires, physical deletion never confirmed.

  for (const user of pendingUsers) {
    await computeLifetimeMetrics(user)
    await computeChurnAnalysis(user)

    // Compliance requires this confirmation before physical deletion
    await confirmDeletionToComplianceSystem(user.id)

    await db.query('DELETE FROM users WHERE id = $1', [user.id])
    await db.query('UPDATE users SET metrics_processed = true WHERE id = $1', [user.id])
  }
}

module.exports = { processDeletedUserMetrics }
