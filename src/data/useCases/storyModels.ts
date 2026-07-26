/**
 * Physical / scene objects tied to each story for dynamic modeling.
 * Not roads/structures generically — story-critical items that change with facts.
 */

export interface StoryModelItem {
  id: string
  /** Plain-language name */
  name: string
  /** Why it matters in this story */
  role: string
  /** Forge mesh family id (catalog or legacy short id) */
  assetType: string
  /** Short description injected into generator */
  description: string
  /** Claim linkage */
  relatedClaimHint?: string
}

export interface StoryModelPack {
  useCaseId: string
  headline: string
  intro: string
  items: StoryModelItem[]
  /** Default selected item id */
  defaultItemId: string
}

const PACKS: Record<string, StoryModelPack> = {
  'trend-01-berlin-csd': {
    useCaseId: 'trend-01-berlin-csd',
    headline: 'Scene objects — path, crowd, response',
    intro:
      'Model only what the story needs: the path people were on, how crowds move, and temporary markers — not a full city build.',
    defaultItemId: 'path-marker',
    items: [
      {
        id: 'path-marker',
        name: 'Park path strip',
        role: 'Where the vehicle met pedestrians',
        assetType: 'path-strip-g',
        description: 'Path surface + incident pin — story geometry only.',
        relatedClaimHint: 'Vehicle struck pedestrians on a path',
      },
      {
        id: 'incident-vehicle',
        name: 'Incident vehicle',
        role: 'Vehicle body stand-in for the strike claim',
        assetType: 'vehicle-body-e',
        description: 'Vehicle mesh for the path incident — not a forensic reconstruction.',
        relatedClaimHint: 'Vehicle struck pedestrians on a path',
      },
      {
        id: 'crowd',
        name: 'Crowd cluster',
        role: 'People density near the path',
        assetType: 'crowd-cluster-f',
        description: 'Crowd density sketch — not a headcount.',
        relatedClaimHint: 'Pedestrians on a path',
      },
      {
        id: 'media-line',
        name: 'Media riser',
        role: 'Press line distance from victims',
        assetType: 'media-riser-p',
        description: 'Broadcast riser stand-in for media standoff.',
        relatedClaimHint: 'Harm exposure high — keep distance',
      },
    ],
  },
  'trend-02-iberian-fires': {
    useCaseId: 'trend-02-iberian-fires',
    headline: 'Scene objects — firebreak, observe, refuge',
    intro: 'Physical items for evacuation and observation — not a full wildfire simulation.',
    defaultItemId: 'observe-mast',
    items: [
      {
        id: 'firebreak',
        name: 'Firebreak line',
        role: 'Break / perimeter geometry near fire front',
        assetType: 'firebreak-m',
        description: 'Firebreak segments — illustrative only.',
        relatedClaimHint: 'Evacuation corridors and fire fronts',
      },
      {
        id: 'refuge-node',
        name: 'Refuge / muster tent',
        role: 'Where people gather after leaving homes',
        assetType: 'refuge-node-q',
        description: 'Muster / refuge canopy sketch.',
        relatedClaimHint: 'Mass evacuations',
      },
      {
        id: 'boat-stage',
        name: 'Shore vessel',
        role: 'Boat exit stories (e.g. peninsula evacuations)',
        assetType: 'vessel-hull-i',
        description: 'Vessel hull for water egress claims.',
        relatedClaimHint: 'Boat evacuations from coastal zones',
      },
    ],
  },
  'trend-03-hormuz-conflict': {
    useCaseId: 'trend-03-hormuz-conflict',
    headline: 'Scene objects — chokepoint & watch',
    intro: 'Maritime story objects: chokepoint watch and shore nodes — not weapon systems.',
    defaultItemId: 'lane-watch',
    items: [
      {
        id: 'lane-watch',
        name: 'Chokepoint vessel',
        role: 'Shipping corridor hull stand-in',
        assetType: 'vessel-hull-i',
        description: 'Vessel on water plane — not a weapon system.',
        relatedClaimHint: 'Shipping risk narratives',
      },
      {
        id: 'shore-node',
        name: 'Shore records bench',
        role: 'Staging for verification gear / filings',
        assetType: 'docket-stack-k',
        description: 'Records bench for local corroboration claims.',
        relatedClaimHint: 'Local corroboration points',
      },
    ],
  },
  'trend-04-india-education': {
    useCaseId: 'trend-04-india-education',
    headline: 'Scene objects — campus & assembly',
    intro: 'Objects for assembly density and documentation — not surveillance product design.',
    defaultItemId: 'assembly-post',
    items: [
      {
        id: 'assembly-post',
        name: 'Campus assembly crowd',
        role: 'Where people gather and film',
        assetType: 'crowd-cluster-f',
        description: 'Crowd density on campus — not surveillance design.',
        relatedClaimHint: 'Phones-in-hand documentation',
      },
      {
        id: 'records-node',
        name: 'Records drop node',
        role: 'Where policy paper meets the street story',
        assetType: 'docket-stack-k',
        description: 'Records node for gazette/policy handoff.',
        relatedClaimHint: 'Policy claims need official text',
      },
    ],
  },
  'trend-05-la-velada': {
    useCaseId: 'trend-05-la-velada',
    headline: 'Scene objects — venue & crowd',
    intro: 'Event geometry: approach, crowd edge, broadcast riser.',
    defaultItemId: 'approach',
    items: [
      {
        id: 'approach',
        name: 'Venue approach path',
        role: 'Crowd approach and pinch points',
        assetType: 'path-strip-g',
        description: 'Approach marker for venue corridor.',
        relatedClaimHint: 'Crowd safety claims',
      },
      {
        id: 'riser',
        name: 'Broadcast riser',
        role: 'Where livestream gear sits in the story',
        assetType: 'media-riser-p',
        description: 'Media riser platform stand-in.',
        relatedClaimHint: 'Livestream event',
      },
      {
        id: 'venue-crowd',
        name: 'Venue crowd edge',
        role: 'Crowd density at the event',
        assetType: 'crowd-cluster-f',
        description: 'Crowd cluster for venue safety claims.',
        relatedClaimHint: 'Crowd safety claims',
      },
    ],
  },
  'trend-06-ufc-abu-dhabi': {
    useCaseId: 'trend-06-ufc-abu-dhabi',
    headline: 'Scene objects — arena night',
    intro: 'Card night objects for media and medical rumor context — not fight simulation.',
    defaultItemId: 'media-riser',
    items: [
      {
        id: 'media-riser',
        name: 'Arena media riser',
        role: 'Broadcast edge of the card story',
        assetType: 'media-riser-p',
        description: 'Media riser for fight-night story.',
        relatedClaimHint: 'Official results vs rumor',
      },
      {
        id: 'med-marker',
        name: 'Arena massing',
        role: 'Where injury claims should be checked, not invented',
        assetType: 'building-mass-h',
        description: 'Arena massing — ethics reminder, not medical product.',
        relatedClaimHint: 'Injury / death hoax claims',
      },
    ],
  },
  'trend-07-world-cup': {
    useCaseId: 'trend-07-world-cup',
    headline: 'Scene objects — celebration corridor',
    intro: 'Street celebration geometry separate from the scoreline ledger.',
    defaultItemId: 'corridor',
    items: [
      {
        id: 'corridor',
        name: 'Celebration corridor',
        role: 'Fan route density sketch',
        assetType: 'path-strip-g',
        description: 'Corridor strip for celebration claims.',
        relatedClaimHint: 'City-level celebration / order',
      },
      {
        id: 'fans',
        name: 'Fan crowd cluster',
        role: 'Celebration density',
        assetType: 'crowd-cluster-f',
        description: 'Crowd cluster for celebration claims.',
        relatedClaimHint: 'City-level celebration / order',
      },
      {
        id: 'order-node',
        name: 'Public-order barrier',
        role: 'Where order claims should attach to a place',
        assetType: 'barrier-line-c',
        description: 'Barrier line for local order stories.',
        relatedClaimHint: 'Public-order claims',
      },
    ],
  },
  'trend-08-venezuela-quake': {
    useCaseId: 'trend-08-venezuela-quake',
    headline: 'Scene objects — rescue & damage',
    intro: 'Ground-truth objects: rescue locus and damage tour anchors.',
    defaultItemId: 'rescue',
    items: [
      {
        id: 'rescue',
        name: 'Debris / rescue pile',
        role: 'Where rescue clips should geolocate',
        assetType: 'debris-pile-j',
        description: 'Debris pile for rescue media ground-truth.',
        relatedClaimHint: 'Citizen rescue media',
      },
      {
        id: 'damage-anchor',
        name: 'Damaged building massing',
        role: 'Reject mislocated rubble against this place',
        assetType: 'building-mass-h',
        description: 'Building massing for damage-tour claims.',
        relatedClaimHint: 'Mislocated rubble risk',
      },
    ],
  },
  'trend-09-political-claims': {
    useCaseId: 'trend-09-political-claims',
    headline: 'Scene objects — records, not streets',
    intro: 'Process desk: physical stand-ins for filings and quote review — not campaign props.',
    defaultItemId: 'records',
    items: [
      {
        id: 'records',
        name: 'Records bench',
        role: 'Where filings and PDFs get checked',
        assetType: 'docket-stack-k',
        description: 'Records bench for document review.',
        relatedClaimHint: 'Filing claims need documents',
      },
      {
        id: 'quote-desk',
        name: 'Quote review cabinet',
        role: 'Full speech before quote cards',
        assetType: 'cabinet-node-b',
        description: 'Quote review cabinet — transcript discipline.',
        relatedClaimHint: 'Partial quote cards',
      },
    ],
  },
  'trend-10-clip-authenticity': {
    useCaseId: 'trend-10-clip-authenticity',
    headline: 'Scene objects — verify bench',
    intro: 'Meta story: the workbench where clips live or die.',
    defaultItemId: 'verify-bench',
    items: [
      {
        id: 'verify-bench',
        name: 'Verification bench',
        role: 'Reverse-search and provenance station',
        assetType: 'docket-stack-k',
        description: 'Verification bench for clip authenticity.',
        relatedClaimHint: 'Provenance before narrative',
      },
      {
        id: 'reject-bin',
        name: 'Reject bin locus',
        role: 'Where recycled/synthetic clips go',
        assetType: 'locus-sphere-d',
        description: 'Reject locus for failed provenance.',
        relatedClaimHint: 'Recycled and synthetic media',
      },
    ],
  },
}

export function getStoryModels(useCaseId: string): StoryModelPack | undefined {
  return PACKS[useCaseId]
}

export function getStoryModelItem(
  useCaseId: string,
  itemId?: string | null,
): StoryModelItem | undefined {
  const pack = PACKS[useCaseId]
  if (!pack) return undefined
  if (itemId) {
    const found = pack.items.find((i) => i.id === itemId)
    if (found) return found
  }
  return pack.items.find((i) => i.id === pack.defaultItemId) ?? pack.items[0]
}
