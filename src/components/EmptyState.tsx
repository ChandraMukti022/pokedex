interface EmptyStateProps {
  title: string
  description?: string
}

export default function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className="rounded-xl bg-white p-8 text-center shadow">
      <h2 className="text-lg font-semibold">{title}</h2>
      {description && <p className="mt-1 text-gray-500">{description}</p>}
    </div>
  )
}