import { requireAuth } from '../../../utils/auth-guard'
import { plannedWorkoutRepository } from '../../../utils/repositories/plannedWorkoutRepository'

defineRouteMeta({
  openAPI: {
    tags: ['Planned Workouts'],
    summary: 'Skip planned workout',
    description:
      'Marks a planned workout as skipped (`completionStatus: SKIPPED`). Bearer `workout:write`.',
    security: [{ bearerAuth: [] }],
    inputSchema: [
      {
        name: 'id',
        in: 'path',
        required: true,
        schema: { type: 'string' }
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
                success: { type: 'boolean' },
                plannedWorkout: { type: 'object' }
              }
            }
          }
        }
      },
      400: { description: 'Invalid input' },
      401: { description: 'Unauthorized' },
      404: { description: 'Workout not found' }
    }
  }
})

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event, ['workout:write'])
  const plannedWorkoutId = event.context.params?.id

  if (!plannedWorkoutId) {
    throw createError({
      statusCode: 400,
      message: 'Planned workout ID is required'
    })
  }

  try {
    const plannedWorkout = await plannedWorkoutRepository.getById(plannedWorkoutId, user.id)

    if (!plannedWorkout) {
      throw createError({
        statusCode: 404,
        message: 'Planned workout not found'
      })
    }

    const updatedPlannedWorkout = await plannedWorkoutRepository.update(plannedWorkoutId, user.id, {
      completed: false,
      completionStatus: 'SKIPPED'
    })

    return {
      success: true,
      plannedWorkout: updatedPlannedWorkout
    }
  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }
    console.error('Error skipping planned workout:', error)
    throw createError({
      statusCode: 500,
      message: error.message || 'Failed to skip planned workout'
    })
  }
})
