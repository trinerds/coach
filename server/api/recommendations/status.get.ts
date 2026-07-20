import { requireAuth } from '../../utils/auth-guard'
import { isTaskRunning, isRunIdRunning } from '../../utils/trigger-check'

defineRouteMeta({
  openAPI: {
    tags: ['Recommendations'],
    summary: 'Get recommendation generation status',
    description: 'Checks if recommendation generation tasks are currently running.',
    inputSchema: [
      {
        in: 'query',
        name: 'jobId',
        schema: { type: 'string' },
        description: 'Specific Job ID to check'
      }
    ],
    responses: {
      200: {
        description: 'Success',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                isRunning: { type: 'boolean' },
                task: { type: 'string', nullable: true } // 'analysis' or 'recommendation'
              }
            }
          }
        }
      },
      401: { description: 'Unauthorized' }
    }
  }
})

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event, ['recommendation:read'])

  const query = getQuery(event)
  const jobId = query.jobId as string

  if (jobId) {
    const isRunning = await isRunIdRunning(jobId)
    return {
      isRunning,
      task: isRunning ? 'recommendation' : null
    }
  }

  // Check analysis task first (since it runs first in the chain)
  const isAnalysisRunning = await isTaskRunning('generate-score-explanations', user.id)
  if (isAnalysisRunning) {
    return {
      isRunning: true,
      task: 'analysis'
    }
  }

  // Check recommendation task
  const isRecommendationRunning = await isTaskRunning('generate-recommendations', user.id)
  if (isRecommendationRunning) {
    return {
      isRunning: true,
      task: 'recommendation'
    }
  }

  return {
    isRunning: false,
    task: null
  }
})
