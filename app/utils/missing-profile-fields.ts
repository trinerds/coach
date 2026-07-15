export type MissingProfileFieldId =
  'Functional Threshold Power (FTP)' | 'Weight' | 'Heart Rate Settings (HRR)' | 'Training Zones'

export type MissingProfileSectionId = 'body-metrics' | 'sport-power' | 'sport-hr' | 'sport-zones'

export interface MissingProfileFieldGuide {
  tab: 'basic' | 'sports'
  sectionId: MissingProfileSectionId
  titleKey: string
  descriptionKey: string
}

export const MISSING_PROFILE_FIELD_GUIDES: Record<MissingProfileFieldId, MissingProfileFieldGuide> =
  {
    'Functional Threshold Power (FTP)': {
      tab: 'sports',
      sectionId: 'sport-power',
      titleKey: 'missing_field_ftp_title',
      descriptionKey: 'missing_field_ftp_desc'
    },
    Weight: {
      tab: 'basic',
      sectionId: 'body-metrics',
      titleKey: 'missing_field_weight_title',
      descriptionKey: 'missing_field_weight_desc'
    },
    'Heart Rate Settings (HRR)': {
      tab: 'sports',
      sectionId: 'sport-hr',
      titleKey: 'missing_field_hrr_title',
      descriptionKey: 'missing_field_hrr_desc'
    },
    'Training Zones': {
      tab: 'sports',
      sectionId: 'sport-zones',
      titleKey: 'missing_field_zones_title',
      descriptionKey: 'missing_field_zones_desc'
    }
  }

export function resolveMissingFieldGuides(missingFields: string[]) {
  return missingFields.flatMap((field) => {
    const guide = MISSING_PROFILE_FIELD_GUIDES[field as MissingProfileFieldId]
    if (!guide) return []
    return [{ field, guide }]
  })
}

export function getPrimaryTabForMissingFields(missingFields: string[]) {
  const guides = resolveMissingFieldGuides(missingFields)
  return guides[0]?.guide.tab ?? 'basic'
}
