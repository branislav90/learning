import { onINP, type INPMetricWithAttribution } from "web-vitals/attribution";
onINP((m: INPMetricWithAttribution) => { m.attribution.interactionTarget; m.attribution.inputDelay; m.attribution.processingDuration; m.attribution.presentationDelay; });
