from apply import apply
apply('38-phase-assessment.md', [
(" Executed counts for (a)/(b): see the DOM states above; the `hi` text survived in both."," Executed on 19.3.1: (a) after the click the `section` carried `display: none !important` and `<p>loading</p>` was present, and after the load the section was un-hidden with `data 2`; (b) the old `data 1` section stayed visible with `updating`, then switched to `data 2`; in both runs it was the same `input` node and `hi` survived."),
])
