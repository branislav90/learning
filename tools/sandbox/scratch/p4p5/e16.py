import sys; sys.path.insert(0,'/tmp')
from rep import rep
Q='/Users/todorbra/Projects/ReactLearning/react-mastery/04-react-architecture/'
P='/Users/todorbra/Projects/ReactLearning/react-mastery/05-design-patterns/'
rep(Q+'20-design-systems.md',"The W3C Design Tokens Community Group is standardising a JSON token format; ⚠ the specification has been evolving, so verify the current format before building tooling that depends on it.","The W3C Design Tokens Community Group (DTCG) published its first stable version of the JSON token format spec, 2025.10 (designtokens.org, checked 2026-10-22); check the current version before building tooling that depends on it.")
rep(Q+'27-styling-architecture.md',"`@scope` (⚠ support varies; verify)","`@scope` (MDN lists it as Baseline 2026, newly available since March 2026)")
rep(Q+'22-monorepos-and-shared-packages.md',"Nx: module boundary lint rule, generators; Turborepo: boundaries feature ⚠ newer, verify |","Nx: module boundary lint rule, generators; Turborepo: `turbo boundaries` (documented at turborepo.com/docs/reference/boundaries) |")
rep(Q+'22-monorepos-and-shared-packages.md',"**Task graph configuration (Turborepo-style; ⚠ key names changed between major versions — `pipeline` in v1, `tasks` in v2; verify against the current docs).**","**Task graph configuration (Turborepo-style; key names changed between major versions: `pipeline` in v1, `tasks` in v2, current 2.x).**")
