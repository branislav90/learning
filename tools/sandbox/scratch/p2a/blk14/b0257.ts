// TOY layout for teaching. NOT React's real constants or bit positions.
type Lanes = number;
type Lane = number;

const NoLanes: Lanes = 0;
const SyncLane: Lane = 0b0000001;
const ContinuousLane: Lane = 0b0000010;
const DefaultLane: Lane = 0b0000100;
const TransitionLane1: Lane = 0b0001000;
const TransitionLane2: Lane = 0b0010000;
const TransitionLanes: Lanes = TransitionLane1 | TransitionLane2;
const IdleLane: Lane = 0b1000000;

const mergeLanes = (a: Lanes, b: Lanes): Lanes => a | b;
const removeLanes = (set: Lanes, remove: Lanes): Lanes => set & ~remove;
const includesSomeLane = (a: Lanes, b: Lanes): boolean => (a & b) !== NoLanes;
const isSubsetOfLanes = (set: Lanes, subset: Lanes): boolean => (set & subset) === subset;
const getHighestPriorityLane = (lanes: Lanes): Lane => lanes & -lanes; // lowest set bit

const pending = mergeLanes(mergeLanes(TransitionLane2, DefaultLane), TransitionLane1);
console.log(pending.toString(2));                                // (1)
console.log(getHighestPriorityLane(pending).toString(2));        // (2)
console.log(includesSomeLane(pending, TransitionLanes));         // (3)
console.log(isSubsetOfLanes(pending, SyncLane));                 // (4)
console.log(removeLanes(pending, TransitionLanes).toString(2));  // (5)
console.log(isSubsetOfLanes(TransitionLanes, TransitionLane2));  // (6)
