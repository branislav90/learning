const [, setState] = useState();
setState(() => { throw error; });   // the updater runs during the next render; the throw lands in render
export {};
