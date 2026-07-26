import { useEffect, useMemo, useState, useCallback } from 'react'
import { Canvas, useThree, type ThreeEvent } from '@react-three/fiber'
import { OrbitControls, Grid, Html } from '@react-three/drei'
import type { MeshPartSpec } from '../../types/core'
import type { SceneObjectMeta, SceneHoverLink } from '../../lib/forge/sceneObjectMeta'
import { pinColorForScore } from '../../lib/ui/claimStatus'

export interface SceneObjectGroup {
  id: string
  parts: MeshPartSpec[]
  meta: SceneObjectMeta
  /** Anchor for hover label (world) */
  anchor?: [number, number, number]
}

function PartMesh({
  part,
  highlighted,
  dimmed,
}: {
  part: MeshPartSpec
  highlighted?: boolean
  dimmed?: boolean
}) {
  const geo = useMemo(() => {
    if (part.primitive === 'box') return <boxGeometry args={part.size} />
    if (part.primitive === 'sphere') return <sphereGeometry args={[part.size[0], 16, 16]} />
    if (part.primitive === 'plane') return <planeGeometry args={[part.size[0], part.size[2]]} />
    return <cylinderGeometry args={[part.size[0], part.size[0], part.size[1], 12]} />
  }, [part])

  const isZone = part.id.startsWith('zone-') || part.id.startsWith('rel:')
  const isTerrain = part.id.startsWith('terrain-')
  const isWater = part.id === 'terrain-water'
  return (
    <mesh position={part.position} rotation={part.rotation} receiveShadow={isTerrain}>
      {geo}
      <meshStandardMaterial
        color={part.color}
        metalness={part.primitive === 'plane' || isZone || isTerrain ? 0 : 0.25}
        roughness={part.primitive === 'plane' || isZone || isTerrain ? 0.95 : 0.55}
        transparent={isZone || isWater || dimmed}
        opacity={isZone ? 0.55 : isWater ? 0.82 : dimmed ? 0.45 : 1}
        emissive={
          highlighted
            ? '#22d3ee'
            : part.color === '#22d3ee' || part.id.startsWith('rel:')
              ? part.id.includes('standoff')
                ? '#9f1239'
                : '#0891b2'
              : isWater
                ? '#0369a1'
                : '#000000'
        }
        emissiveIntensity={
          highlighted
            ? 0.55
            : part.id.startsWith('rel:')
              ? 0.25
              : part.color === '#22d3ee'
                ? 0.35
                : isWater
                  ? 0.12
                  : 0
        }
      />
    </mesh>
  )
}

function ObjectGroupMesh({
  group,
  active,
  hovered,
  anyHovered,
  onHover,
  onLeave,
  onSelect,
  onLink,
  onOpenSme,
}: {
  group: SceneObjectGroup
  active?: boolean
  hovered?: boolean
  anyHovered?: boolean
  onHover: (id: string) => void
  onLeave: () => void
  onSelect: (id: string) => void
  onLink?: (link: SceneHoverLink) => void
  onOpenSme?: (smeId: string) => void
}) {
  const meta = group.meta
  const statusColor = pinColorForScore(meta.score)
  const dimmed = Boolean(anyHovered && !hovered && !active)
  const showMenu = hovered || active

  // Anchor: prefer explicit, else average of part positions
  const anchor = useMemo((): [number, number, number] => {
    if (group.anchor) return group.anchor
    if (!group.parts.length) return [0, 1.2, 0]
    let sx = 0
    let sy = 0
    let sz = 0
    let n = 0
    for (const p of group.parts) {
      sx += p.position[0]
      sy += p.position[1] + Math.max(p.size[1], 0.4)
      sz += p.position[2]
      n++
    }
    return [sx / n, sy / n + 0.4, sz / n]
  }, [group])

  const handlePointer = useCallback(
    (e: ThreeEvent<PointerEvent>) => {
      e.stopPropagation()
      onHover(group.id)
    },
    [group.id, onHover],
  )

  return (
    <group
      onPointerOver={handlePointer}
      onPointerMove={handlePointer}
      onPointerOut={(e) => {
        e.stopPropagation()
        onLeave()
      }}
      onClick={(e) => {
        e.stopPropagation()
        onSelect(group.id)
      }}
    >
      {group.parts.map((p) => (
        <PartMesh
          key={p.id}
          part={p}
          highlighted={hovered || active}
          dimmed={dimmed}
        />
      ))}
      {/* Always-visible mini status pin above object */}
      <mesh position={[anchor[0], anchor[1] + 0.15, anchor[2]]}>
        <sphereGeometry args={[0.12, 10, 10]} />
        <meshStandardMaterial
          color={statusColor}
          emissive={statusColor}
          emissiveIntensity={hovered || active ? 0.6 : 0.25}
        />
      </mesh>
      {showMenu && (
        <Html
          position={[anchor[0], anchor[1] + 0.55, anchor[2]]}
          center
          distanceFactor={14}
          style={{ pointerEvents: 'auto', zIndex: 30 }}
          zIndexRange={[100, 0]}
        >
          <div
            className="w-[min(280px,70vw)] rounded-lg border border-cyan-800/60 bg-slate-950/95 shadow-xl shadow-black/50 backdrop-blur-md text-left"
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-2.5 py-1.5 border-b border-slate-800 flex items-start gap-2">
              <span
                className="mt-0.5 w-2 h-2 rounded-full shrink-0"
                style={{ background: statusColor }}
              />
              <div className="min-w-0">
                <div className="text-[12px] font-semibold text-slate-50 leading-snug">
                  {meta.name}
                </div>
                <div className="text-[10px] text-cyan-400/90 leading-snug">{meta.what}</div>
              </div>
            </div>
            <div className="px-2.5 py-1.5 space-y-1 max-h-[220px] overflow-y-auto">
              <div className="flex flex-wrap gap-1 text-[9px]">
                <span className="rounded border border-slate-700 px-1 text-slate-300">
                  {meta.score === 1 ? '+1' : meta.score === -1 ? '−1' : '0'}
                </span>
                {meta.verifiability && (
                  <span className="rounded border border-violet-900/50 px-1 text-violet-300/90">
                    {meta.verifiability}
                  </span>
                )}
                {meta.importance && (
                  <span className="rounded border border-slate-700 px-1 text-slate-400">
                    {meta.importance}
                  </span>
                )}
                {meta.slot && (
                  <span className="rounded border border-slate-700 px-1 font-mono text-slate-500">
                    {meta.slot}
                  </span>
                )}
              </div>
              {meta.claimNote && (
                <p className="text-[10px] text-amber-200/90 leading-snug">
                  <span className="text-slate-500">Claim · </span>
                  {meta.claimNote}
                </p>
              )}
              <div>
                <div className="text-[9px] uppercase tracking-wide text-slate-500 mb-0.5">
                  Notes
                </div>
                <ul className="space-y-0.5">
                  {meta.notes.slice(0, 5).map((n) => (
                    <li key={n} className="text-[10px] text-slate-300 leading-snug pl-2 border-l border-slate-700">
                      {n}
                    </li>
                  ))}
                </ul>
              </div>
              {meta.smeTopics.length > 0 && (
                <div>
                  <div className="text-[9px] uppercase tracking-wide text-slate-500 mb-0.5">
                    SME topics
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {meta.smeTopics.map((t) => (
                      <button
                        key={t.id}
                        type="button"
                        title={t.name}
                        className="rounded border border-cyan-900/50 bg-cyan-950/40 px-1.5 py-0.5 text-[9px] text-cyan-200 hover:border-cyan-500"
                        onClick={() => onOpenSme?.(t.id)}
                      >
                        {t.short}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {meta.links.length > 0 && (
                <div>
                  <div className="text-[9px] uppercase tracking-wide text-slate-500 mb-0.5">
                    Links
                  </div>
                  <ul className="space-y-0.5">
                    {meta.links.slice(0, 8).map((link) => (
                      <li key={link.id}>
                        <button
                          type="button"
                          className="w-full text-left text-[10px] text-sky-300/90 hover:text-sky-200 underline-offset-2 hover:underline truncate"
                          title={link.label}
                          onClick={() => {
                            if (link.kind === 'sme' || link.kind === 'preferred') {
                              if (link.smeId) onOpenSme?.(link.smeId)
                            }
                            onLink?.(link)
                          }}
                        >
                          {link.kind === 'source' || link.kind === 'agency'
                            ? '↗ '
                            : link.kind === 'sme'
                              ? '◎ '
                              : '· '}
                          {link.label}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {meta.industries.length > 0 && (
                <div className="text-[8px] text-slate-600 truncate">
                  {meta.industries.slice(0, 4).join(' · ')}
                </div>
              )}
            </div>
            <div className="px-2 py-1 border-t border-slate-800 text-[8px] text-slate-600">
              Illustrative geometry · hover for identity · links open sources / SME
            </div>
          </div>
        </Html>
      )}
    </group>
  )
}

function CameraRig({
  position,
  target,
}: {
  position: [number, number, number]
  target: [number, number, number]
}) {
  const { camera } = useThree()
  useEffect(() => {
    camera.position.set(position[0], position[1], position[2])
    camera.lookAt(target[0], target[1], target[2])
    camera.updateProjectionMatrix()
  }, [camera, position, target])
  return (
    <OrbitControls
      makeDefault
      enablePan
      enableZoom
      enableRotate
      target={target}
      maxPolarAngle={Math.PI * 0.49}
      minDistance={4}
      maxDistance={100}
    />
  )
}

export function MassingCanvas({
  parts,
  objects = [],
  className = '',
  performanceMode = false,
  cameraPosition,
  cameraTarget,
  sky = '#05070f',
  showGrid,
  activeObjectId,
  onSelectObject,
  onLink,
  onOpenSme,
}: {
  /** Terrain + non-pickable scene parts */
  parts: MeshPartSpec[]
  /** Pickable story objects with hover meta */
  objects?: SceneObjectGroup[]
  className?: string
  performanceMode?: boolean
  cameraPosition?: [number, number, number]
  cameraTarget?: [number, number, number]
  sky?: string
  showGrid?: boolean
  activeObjectId?: string | null
  onSelectObject?: (id: string) => void
  onLink?: (link: SceneHoverLink) => void
  onOpenSme?: (smeId: string) => void
}) {
  const pos = cameraPosition ?? ([8, 6, 11] as [number, number, number])
  const target = cameraTarget ?? ([1, 0.5, 0] as [number, number, number])
  const hasTerrain = parts.some((p) => p.id.startsWith('terrain-'))
  const gridOn = showGrid ?? (!hasTerrain && !performanceMode)
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  // Parts that belong to objects are already in groups — only draw loose parts
  const looseParts = parts

  return (
    <div className={`rounded-md overflow-hidden border border-slate-800 bg-black relative ${className}`}>
      <div className="absolute top-1 left-1 z-10 pointer-events-none text-[9px] text-slate-500 bg-black/50 rounded px-1.5 py-0.5">
        Hover objects · menu = identity · notes · SME links
      </div>
      <Canvas
        camera={{ position: pos, fov: 42, near: 0.1, far: 280 }}
        dpr={performanceMode ? [1, 1] : [1, 1.5]}
        gl={{
          antialias: !performanceMode,
          powerPreference: performanceMode ? 'low-power' : 'default',
        }}
        onPointerMissed={() => setHoveredId(null)}
      >
        <color attach="background" args={[sky]} />
        <fog attach="fog" args={[sky, 28, 95]} />
        <ambientLight intensity={0.52} />
        <directionalLight position={[12, 18, 10]} intensity={performanceMode ? 0.85 : 1.15} />
        <directionalLight position={[-8, 6, -4]} intensity={0.28} />
        <hemisphereLight args={['#94a3b8', '#1e293b', 0.35]} />
        {gridOn && (
          <Grid
            args={[60, 60]}
            cellColor="#1f2937"
            sectionColor="#334155"
            infiniteGrid
            fadeDistance={55}
            position={[0, -0.01, 0]}
          />
        )}
        <group>
          {looseParts.map((p) => (
            <PartMesh key={p.id} part={p} />
          ))}
        </group>
        {objects.map((g) => (
          <ObjectGroupMesh
            key={g.id}
            group={g}
            active={activeObjectId === g.id}
            hovered={hoveredId === g.id}
            anyHovered={hoveredId != null}
            onHover={setHoveredId}
            onLeave={() => setHoveredId((cur) => (cur === g.id ? null : cur))}
            onSelect={(id) => {
              setHoveredId(id)
              onSelectObject?.(id)
            }}
            onLink={onLink}
            onOpenSme={onOpenSme}
          />
        ))}
        <CameraRig position={pos} target={target} />
      </Canvas>
    </div>
  )
}

export default MassingCanvas
