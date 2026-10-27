import sys; sys.path.insert(0,'/tmp')
from rep import rep
B='/Users/todorbra/Projects/ReactLearning/react-mastery/'
rep(B+'04-react-architecture/17-data-flow-architecture.md',"const set = (handlers[name] ??= new Set()) as Set<Handler<K>>;","const set = (handlers[name] ??= new Set() as never) as Set<Handler<K>>;   // `as never`: TS cannot correlate the mapped-type slot with K (tsc 5.9 rejects the plain form, TS2322)")
rep(B+'05-design-patterns/15-adapter-strategy-factory.md',"(components as Record<string, ComponentType<B> | undefined>)","(components as unknown as Record<string, ComponentType<B> | undefined>)")
