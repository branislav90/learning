<Card>
  <Card.Header>Title</Card.Header>            {/* found */}
  <Fragment><Card.Footer /></Fragment>         {/* not found: type is Fragment */}
  <MyHeader />                                 {/* not found: renders Card.Header inside, but type is MyHeader */}
  {cond && <Card.Footer />}                    {/* false filtered by toArray; fine */}
</Card>
export {};
