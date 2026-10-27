// Configuration (prop explosion)
<Card title="Fleet" subtitle="12 vehicles" icon={<TruckIcon/>} actions={[{label:"Edit", onClick}]} footer="…" />

// Composition (children, slots)
<Card>
  <Card.Header>
    <Card.Title>Fleet</Card.Title>
    <Card.Subtitle>12 vehicles</Card.Subtitle>
  </Card.Header>
  <Card.Actions><Button onClick={…}>Edit</Button></Card.Actions>
</Card>
export {};
