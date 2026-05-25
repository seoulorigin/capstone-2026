// 배열 기반 Compose 옵션 입력 섹션의 공통 레이아웃을 렌더링합니다.
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

export default function ComposeArrayFieldGroup({
  title,
  description,
  addLabel,
  emptyMessage,
  items,
  onAdd,
  onRemove,
  renderItem,
}) {
  const normalizedItems = Array.isArray(items) ? items : []

  return (
    <div className="space-y-3 rounded-2xl border border-slate-800 bg-slate-950/40 p-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Label>{title}</Label>

          {description && (
            <p className="mt-1 text-xs text-slate-500">{description}</p>
          )}
        </div>

        <Button type="button" variant="outline" size="sm" onClick={onAdd}>
          {addLabel}
        </Button>
      </div>

      {normalizedItems.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-800 px-3 py-4 text-sm text-slate-500">
          {emptyMessage}
        </div>
      ) : (
        <div className="space-y-3">
          {normalizedItems.map((item, index) => (
            <div
              key={`${title}-${index}`}
              className="grid gap-3 rounded-xl border border-slate-800 bg-slate-950/60 p-3 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto]"
            >
              {renderItem(item, index)}

              <div className="flex items-end">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full md:w-auto"
                  onClick={() => onRemove(index)}
                >
                  삭제
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}