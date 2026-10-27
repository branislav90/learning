module.exports = { forbidden: [
 { name:'no-app-to-app-imports', severity:'error', from:{path:'^apps/([^/]+)/'}, to:{path:'^apps/(?!\\1/)'} },
 { name:'v2', severity:'error', from:{path:'^apps/([^/]+)/'}, to:{path:'^apps/', pathNot:'^apps/$1/'} },
 { name:'only-public-entrypoints', severity:'error', from:{path:'^(apps|packages)/'}, to:{path:'^packages/[^/]+/src/internal/', pathNot:'^packages/([^/]+)/'} },
 { name:'v3', severity:'error', from:{path:'^(apps|packages)/([^/]+)/'}, to:{path:'^packages/([^/]+)/src/internal/', pathNot:'^packages/$2/'} },
]};
