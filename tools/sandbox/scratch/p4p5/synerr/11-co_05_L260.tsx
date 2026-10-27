<Rating defaultValue={3} onValueChange={track} />                  // uncontrolled
<Rating value={rating} onValueChange={setRating} />                // controlled
<Rating value={rating} onValueChange={(n) => n! >= 1 && setRating(n)} />  // controlled + veto
export {};
