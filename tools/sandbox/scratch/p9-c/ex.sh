#!/bin/zsh
# usage: ex.sh file pattern [width]
grep -n -i -- "$2" "$1" | cut -c1-${3:-400} | head -${4:-15}
