import { requireAuth } from '../../utils/auth-guard'
import { isRunIdRunning, isTaskRunning } from '../../utils/trigger-check'

defineRouteMeta({
  openAPI: {
    tags: ['Workouts'],
    summary: 'Ad-hoc workout generation status',
    description: 'Returns whether an ad-hoc workout generation job is still running.',
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
                task: { type: 'string', nullable: true }
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
  const user = await requireAuth(event, ['workout:write'])
  const query = getQuery(event)
  const jobId = typeof query.jobId === 'string' ? query.jobId : undefined

  if (jobId) {
    const isRunning = await isRunIdRunning(jobId)
    return {
      isRunning,
      task: isRunning ? 'generate-ad-hoc-workout' : null
    }
  }

  const isRunning = await isTaskRunning('generate-ad-hoc-workout', user.id)
  return {
    isRunning,
    task: isRunning ? 'generate-ad-hoc-workout' : null
  }
})
