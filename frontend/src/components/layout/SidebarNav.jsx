export default function SidebarNav({ activeMenu, onChangeMenu }) {
  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      description: "모니터링",
    },
    {
      id: "compose-editor",
      label: "Compose Editor",
      description: "YAML 편집",
    },
    {
      id: "logs",
      label: "Logs",
      description: "로그 조회",
    },
    {
      id: "settings",
      label: "Settings",
      description: "환경 설정",
    },
  ]

  return (
    <aside className="sticky top-8 hidden h-[calc(100vh-4rem)] w-[260px] shrink-0 lg:block">
      <div className="flex h-full flex-col rounded-3xl border border-slate-800 bg-[linear-gradient(to_bottom,rgba(15,23,42,0.96),rgba(2,6,23,0.96))] p-4 shadow-[0_20px_60px_rgba(2,6,23,0.32)]">
        <div className="border-b border-slate-800 px-2 pb-4">
          <p className="text-xs font-medium uppercase tracking-[0.26em] text-cyan-400">
            Platform
          </p>
          <h2 className="mt-3 text-lg font-semibold tracking-tight text-slate-50">
            Container Ops
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            운영 · 편집 · 로그 워크스페이스
          </p>
        </div>

        <nav className="mt-4 flex-1 space-y-2">
          {menuItems.map((item) => {
            const isActive = activeMenu === item.id

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onChangeMenu?.(item.id)}
                className={`group w-full rounded-2xl border px-4 py-3 text-left transition-all duration-200 ${
                  isActive
                    ? "border-cyan-500/30 bg-cyan-500/10 shadow-[0_0_0_1px_rgba(34,211,238,0.16)]"
                    : "border-transparent bg-transparent hover:border-slate-800 hover:bg-slate-900/60"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p
                      className={`text-sm font-medium ${
                        isActive ? "text-cyan-100" : "text-slate-200"
                      }`}
                    >
                      {item.label}
                    </p>
                    <p
                      className={`mt-1 text-xs ${
                        isActive ? "text-cyan-300/80" : "text-slate-500"
                      }`}
                    >
                      {item.description}
                    </p>
                  </div>

                  <span
                    className={`mt-1 h-2.5 w-2.5 rounded-full transition-all ${
                      isActive
                        ? "bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.9)]"
                        : "bg-slate-700 group-hover:bg-slate-500"
                    }`}
                  />
                </div>
              </button>
            )
          })}
        </nav>

        <div className="border-t border-slate-800 px-2 pt-4">
          <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
              Workspace
            </p>
            <p className="mt-2 text-sm font-medium text-slate-200">
              Design Preview
            </p>
            <p className="mt-1 text-xs leading-5 text-slate-500">
              현재는 메뉴 UI만 반영된 상태이며, 실제 페이지 이동은 연결되지
              않았습니다.
            </p>
          </div>
        </div>
      </div>
    </aside>
  )
}