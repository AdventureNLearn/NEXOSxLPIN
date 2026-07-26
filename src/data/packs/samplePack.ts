/**
 * Generic sample data pack — interchangeable, non-identifying.
 * Device Type A · Jurisdiction 01 · Condition Matrix Alpha
 */

import type { DataPack } from '../../types/core'
import { uid } from '../../types/core'

const now = new Date().toISOString()

export const SAMPLE_PACK: DataPack = {
  meta: {
    id: 'pack-sample-alpha',
    name: 'Sample Pack Alpha',
    version: '1.4.0',
    description:
      'Production sample pack for NEXOSxLPIN 1.4.0 — generic matrices, spatial nodes, graph stages, and tri-state evidence. Swap packs without changing core modules.',
    domainHint: 'generic-demo',
  },
  conditionMatrices: [
    {
      id: 'matrix-alpha',
      name: 'Condition Matrix Alpha',
      description: 'Cascading constraints for installation and operating context.',
      axes: [
        {
          id: 'jurisdiction',
          label: 'Jurisdiction class',
          options: [
            { id: 'j-01', label: 'Jurisdiction 01', description: 'Baseline regulatory class' },
            { id: 'j-02', label: 'Jurisdiction 02', description: 'Elevated review class' },
            { id: 'j-03', label: 'Jurisdiction 03', description: 'Restricted deployment class' },
          ],
        },
        {
          id: 'device-type',
          label: 'Device type',
          options: [
            { id: 'dev-a', label: 'Device Type A', description: 'Primary enclosure form' },
            { id: 'dev-b', label: 'Device Type B', description: 'Compact form' },
            { id: 'dev-c', label: 'Device Type C', description: 'Extended arm form' },
          ],
        },
        {
          id: 'site-class',
          label: 'Site class',
          options: [
            { id: 'site-open', label: 'Open corridor', description: 'Clear approach geometry' },
            { id: 'site-edge', label: 'Edge mount', description: 'Boundary-constrained' },
            { id: 'site-cluster', label: 'Cluster node', description: 'Shared structure' },
          ],
        },
        {
          id: 'power-path',
          label: 'Power path',
          options: [
            { id: 'pwr-grid', label: 'Grid tap', description: 'Fixed service' },
            { id: 'pwr-solar', label: 'Solar + storage', description: 'Off-grid capable' },
            { id: 'pwr-poe', label: 'Power over data', description: 'Shared backhaul pair' },
          ],
        },
        {
          id: 'clearance',
          label: 'Clearance rule',
          options: [
            { id: 'clr-std', label: 'Standard clearance', description: 'Default setback' },
            { id: 'clr-ext', label: 'Extended clearance', description: 'Increased setback' },
            { id: 'clr-min', label: 'Minimum clearance', description: 'Tight envelope' },
          ],
        },
      ],
    },
  ],
  spatialPoints: [
    {
      id: 'pt-01',
      label: 'Node Alpha',
      lat: 0.12,
      lng: 0.08,
      kind: 'asset',
      score: 1,
      tags: ['device-type-a', 'jurisdiction-01'],
    },
    {
      id: 'pt-02',
      label: 'Node Beta',
      lat: 0.18,
      lng: -0.05,
      kind: 'asset',
      score: 0,
      tags: ['device-type-b'],
    },
    {
      id: 'pt-03',
      label: 'Hub Gamma',
      lat: -0.04,
      lng: 0.15,
      kind: 'hub',
      score: 1,
      tags: ['cluster'],
    },
    {
      id: 'pt-04',
      label: 'Sensor Delta',
      lat: 0.05,
      lng: -0.12,
      kind: 'sensor',
      score: -1,
      tags: ['review-required'],
    },
  ],
  graphNodes: [
    { id: 'n-capture', label: 'Capture', kind: 'stage', score: 1 },
    { id: 'n-process', label: 'Process', kind: 'stage', score: 1 },
    { id: 'n-store', label: 'Store', kind: 'stage', score: 0 },
    { id: 'n-share', label: 'Share', kind: 'stage', score: 0 },
    { id: 'n-review', label: 'Review', kind: 'control', score: 1 },
  ],
  graphEdges: [
    { id: 'e1', source: 'n-capture', target: 'n-process', label: 'stream' },
    { id: 'e2', source: 'n-process', target: 'n-store', label: 'write' },
    { id: 'e3', source: 'n-store', target: 'n-share', label: 'export', score: 0 },
    { id: 'e4', source: 'n-review', target: 'n-share', label: 'gate', score: 1 },
  ],
  assetTypes: [
    {
      id: 'mast-enclosure-a',
      label: 'Mast Enclosure A',
      description: 'Vertical mast + hinged arm + sensor head. Generic procedural example.',
    },
    {
      id: 'cabinet-node-b',
      label: 'Cabinet Node B',
      description: 'Ground cabinet with hinged door and internal tray.',
    },
  ],
  sampleEvidence: [
    {
      id: uid('ev'),
      title: 'Pack manifest verified',
      summary: 'Sample Pack Alpha loaded with generic matrices and nodes only.',
      score: 1,
      confidence: 'high',
      material: 'primary',
      tags: ['pack', 'bootstrap'],
      sourceRefs: ['src-manifest'],
      createdAt: now,
    },
    {
      id: uid('ev'),
      title: 'Sensor Delta flagged for review',
      summary:
        'Sample −1 claim: social-only allegation that Sensor Delta is “always failing” with no inspection log or primary measurement. Demonstrates export hard-block until resolved.',
      score: -1,
      confidence: 'medium',
      material: 'assumption',
      tags: ['review', 'sample', 'sensor', 'social'],
      sourceRefs: [],
      createdAt: now,
      moduleId: 'research-hub',
    },
    {
      id: uid('ev'),
      title: 'Share-path incomplete',
      summary:
        'Distribution edge Store→Share lacks a primary disclosure record in the sample pack. Hold at 0 until a source ref is attached.',
      score: 0,
      confidence: 'low',
      material: 'derived',
      tags: ['graph', 'disclosure', 'export'],
      sourceRefs: [],
      createdAt: now,
      moduleId: 'export-kit',
    },
    {
      id: uid('ev'),
      title: 'Jurisdiction 01 baseline selected',
      summary:
        'Condition matrix axis Jurisdiction class defaults to Jurisdiction 01 for demo sessions. Documented in Design Lab selections.',
      score: 1,
      confidence: 'high',
      material: 'secondary',
      tags: ['conditions', 'jurisdiction', 'design-lab'],
      sourceRefs: ['src-manifest'],
      createdAt: now,
      moduleId: 'design-lab',
    },
    {
      id: uid('ev'),
      title: 'Graph review gate present',
      summary:
        'Network graph includes a Review control node with a gate edge into Share — models Layer-0 style export arming in sample topology.',
      score: 1,
      confidence: 'medium',
      material: 'derived',
      tags: ['graph', 'layer0', 'export'],
      sourceRefs: ['src-manifest'],
      createdAt: now,
      moduleId: 'atlas',
    },
  ],
  sampleSources: [
    {
      id: 'src-manifest',
      title: 'Sample Pack Alpha manifest',
      citation: 'In-app data pack · pack-sample-alpha@1.4.0',
      publicRecord: false,
      retrievedAt: now,
    },
    {
      id: 'src-matrix',
      title: 'Condition Matrix Alpha axes',
      citation: 'In-app · matrix-alpha · 5 axes (jurisdiction, device, site, power, clearance)',
      publicRecord: false,
      retrievedAt: now,
    },
    {
      id: 'src-graph',
      title: 'Capture→Process→Store→Share topology',
      citation: 'In-app sample graph with Review gate',
      publicRecord: false,
      retrievedAt: now,
    },
  ],
}

export default SAMPLE_PACK
