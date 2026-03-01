import React from 'react'

export const SkeletonCard = () => (
  <div className="glass-card p-6 space-y-4">
    <div className="shimmer h-48 rounded-xl bg-obsidian-800/60" />
    <div className="shimmer h-5 rounded-lg bg-obsidian-800/60 w-3/4" />
    <div className="shimmer h-4 rounded-lg bg-obsidian-800/60 w-full" />
    <div className="shimmer h-4 rounded-lg bg-obsidian-800/60 w-2/3" />
    <div className="flex justify-between items-center pt-2">
      <div className="shimmer h-6 rounded-lg bg-obsidian-800/60 w-24" />
      <div className="shimmer h-10 rounded-xl bg-obsidian-800/60 w-28" />
    </div>
  </div>
)

export const SkeletonList = ({ count = 3 }) => (
  <div className="space-y-4">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="glass-card p-4 flex gap-4 items-center">
        <div className="shimmer w-16 h-16 rounded-xl bg-obsidian-800/60 flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="shimmer h-5 rounded-lg bg-obsidian-800/60 w-1/2" />
          <div className="shimmer h-4 rounded-lg bg-obsidian-800/60 w-3/4" />
        </div>
        <div className="shimmer h-8 rounded-lg bg-obsidian-800/60 w-20" />
      </div>
    ))}
  </div>
)

export const SkeletonText = ({ lines = 3 }) => (
  <div className="space-y-2">
    {Array.from({ length: lines }).map((_, i) => (
      <div
        key={i}
        className="shimmer h-4 rounded-lg bg-obsidian-800/60"
        style={{ width: `${100 - (i * 10)}%` }}
      />
    ))}
  </div>
)
