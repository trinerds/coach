import { describe, expect, it } from 'vitest'
import { findToolNameRepair } from './tool-call-repair'

describe('findToolNameRepair', () => {
  const availableToolNames = [
    'delete_planned_workout',
    'get_planned_workouts',
    'update_planned_workout'
  ]

  it('repairs a single-character typo to a unique known tool', () => {
    expect(findToolNameRepair('delet_planned_workout', availableToolNames)).toEqual({
      repairedName: 'delete_planned_workout',
      strategy: 'edit-distance',
      distance: 1
    })
  })

  it('repairs normalized variants of a known tool', () => {
    expect(findToolNameRepair('Delete Planned Workout', availableToolNames)).toEqual({
      repairedName: 'delete_planned_workout',
      strategy: 'normalized'
    })
  })

  it('repairs supported deprecated and namespaced aliases', () => {
    expect(findToolNameRepair('get_workout_stream', ['get_workout_streams'])).toEqual({
      repairedName: 'get_workout_streams',
      strategy: 'alias'
    })
    expect(findToolNameRepair('intervals_icu.get_current_time', ['get_current_time'])).toEqual({
      repairedName: 'get_current_time',
      strategy: 'alias'
    })
    expect(findToolNameRepair('forecast_training_date_range', ['forecast_training_load'])).toEqual({
      repairedName: 'forecast_training_load',
      strategy: 'alias'
    })
  })

  it('does not repair an alias when its canonical tool is outside policy scope', () => {
    expect(findToolNameRepair('sync_planned_workouts', ['get_planned_workouts'])).toBeNull()
  })

  it('does not repair ambiguous candidates', () => {
    expect(findToolNameRepair('planned_workout', availableToolNames)).toBeNull()
  })

  it('does not repair unrelated tool names', () => {
    expect(findToolNameRepair('send_email', availableToolNames)).toBeNull()
  })
})
