from patchlib import apply
apply('09',[
("// mutates (frozen in dev: throws; in prod: silent corruption)","// mutates the store's array (state is auto-frozen by Immer, so in strict-mode code this throws a TypeError, in production too; with non-frozen state it would silently corrupt)"),
("(undefined behaviour; frozen in dev)","(frozen by Immer, so strict-mode code throws a TypeError, verified in development and production)"),
])
