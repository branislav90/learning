// (a) Dot notation (static properties)
<Tabs.Trigger />                     // import { Tabs } from "./tabs"

// (b) Named exports
import { Tabs, TabsTrigger } from "./tabs";   // <TabsTrigger />

// (c) Namespace import (retains the dot at the call site, no statics needed)
import * as Tabs from "./tabs";                 // <Tabs.Trigger /> where the file exports Root, Trigger, ...
export {};
