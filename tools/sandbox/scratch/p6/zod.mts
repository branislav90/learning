import { z } from 'zod';   // ⚠ API shown follows Zod's commonly documented style; verify for your major version

const Id = z.union([z.string().min(1), z.number().int()]).transform(String);

const StatusKnown = z.enum(['pending', 'paid', 'shipped', 'cancelled']);
const Status = z.string().transform((s) => {
  const r = StatusKnown.safeParse(s);
  return r.success ? r.data : ({ kind: 'unknown', raw: s } as const);
});

const OrderWire = z.object({
  id: Id,
  status: Status,
  created_at: z.iso.datetime({ offset: true }).transform((s) => Date.parse(s)),
  total: z.string().regex(/^-?\d+$/).transform(Number),
  currency: z.string().regex(/^[A-Z]{3}$/),
  customer: z.object({ id: Id, full_name: z.string(), email: z.string().nullable() }),
  lines: z.array(z.object({
    sku: z.string(),
    qty: z.union([z.number().int().nonnegative(), z.string().regex(/^\d+$/).transform(Number)]),
    unit_price: z.string().regex(/^-?\d+$/).transform(Number),
  })),
});


export const parseOrderWire = (raw: unknown) => OrderWire.parse(raw);   // throws ZodError with paths
const raw={id:7,status:'refunded',created_at:'2024-01-02T10:00:00Z',total:'1999',currency:'EUR',customer:{id:'c1',full_name:'A',email:null},lines:[{sku:'x',qty:'3',unit_price:'5'}]};
const out=parseOrderWire(raw); console.log(JSON.stringify(out));
const ex=Object.assign({},raw,{extra:1}); console.log('unknown keys stripped:', !('extra' in (parseOrderWire(ex) as any)));
try{parseOrderWire({...raw,total:'abc',lines:[{sku:1}]})}catch(e:any){console.log('issue paths',JSON.stringify(e.issues.map((i:any)=>i.path)), e.constructor.name)}
console.log('z.iso exists', typeof (z as any).iso?.datetime);
