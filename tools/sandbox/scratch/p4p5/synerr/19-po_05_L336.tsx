<Button onClick={save}>Save</Button>                       // OK -> <button type="button">
<Button type="submit">Pay</Button>                          // OK
<Button href="/pricing">Pricing</Button>                    // OK -> <a>
<Button href="/pricing" type="submit">x</Button>            // ERROR: 'type' not on anchor props (when discriminated by href)
<Button href="/pricing" disabled>x</Button>                 // ERROR: 'disabled' not on anchor props
export {};
