function hasNonEmptySteps(steps: unknown): boolean {
  return Array.isArray(steps) && steps.length > 0
}

function hasRenderableStrengthBlocks(blocks: unknown): boolean {
  if (!Array.isArray(blocks) || blocks.length === 0) return false
  return blocks.some(
    (block) =>
      block &&
      typeof block === 'object' &&
      Array.isArray((block as any).steps) &&
      (block as any).steps.length > 0
  )
}

export function assertRenderableStructure(
  structure: unknown,
  workoutType?: string | null
): { valid: boolean; reason: string | null } {
  if (!structure || typeof structure !== 'object' || Array.isArray(structure)) {
    return { valid: false, reason: 'structure payload is missing or invalid' }
  }

  const payload = structure as Record<string, unknown>
  const hasSteps = hasNonEmptySteps(payload.steps)
  const hasExercises = hasNonEmptySteps(payload.exercises)
  const hasBlocks = hasRenderableStrengthBlocks(payload.blocks)

  if (hasSteps || hasExercises || hasBlocks) {
    return { valid: true, reason: null }
  }

  const normalizedType = String(workoutType || '').toLowerCase()
  if (normalizedType.includes('gym') || normalizedType.includes('weight')) {
    return {
      valid: false,
      reason: 'strength structure has no blocks with exercise steps'
    }
  }

  return {
    valid: false,
    reason: 'structure has no steps, exercises, or blocks'
  }
}
