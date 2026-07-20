import { describe, expect, it } from 'vitest'
import {
  WORKER_MONITORING_THRESHOLDS,
  summarizeChatRecoveryEvents,
  workerMonitoringHttpStatus
} from '../../../../server/utils/worker-monitoring'

describe('worker monitoring', () => {
  it('maps critical status to HTTP 503', () => {
    expect(workerMonitoringHttpStatus('critical')).toBe(503)
  })

  it('maps ok and degraded status to HTTP 200', () => {
    expect(workerMonitoringHttpStatus('ok')).toBe(200)
    expect(workerMonitoringHttpStatus('degraded')).toBe(200)
  })

  it('uses practical queue and redis thresholds', () => {
    expect(WORKER_MONITORING_THRESHOLDS.webhookWaitingCritical).toBeGreaterThan(
      WORKER_MONITORING_THRESHOLDS.webhookWaitingDegraded
    )
    expect(WORKER_MONITORING_THRESHOLDS.redisMemoryPercentCritical).toBeGreaterThan(
      WORKER_MONITORING_THRESHOLDS.redisMemoryPercentDegraded
    )
  })

  it('reports heartbeat and exhaustion rates by deployment', () => {
    const snapshot = summarizeChatRecoveryEvents(100, [
      {
        data: {
          recoveryReason: 'heartbeat_timeout',
          reason: 'turn_requeued_for_recovery',
          deploymentId: 'deploy-a'
        }
      },
      {
        data: {
          recoveryReason: 'heartbeat_timeout',
          reason: 'recovery_attempts_exhausted',
          deploymentId: 'deploy-a'
        }
      },
      { data: { reason: 'slow_response' } }
    ])

    expect(snapshot).toMatchObject({
      totalTurns: 100,
      heartbeatTimeouts: 2,
      heartbeatTimeoutRate: 2,
      recoveryExhaustions: 1,
      recoveryExhaustionRate: 1,
      byDeployment: {
        'deploy-a': { heartbeatTimeouts: 2, recoveryExhaustions: 1 }
      }
    })
  })
})
