# My FRP

my attempt at playing around with and build functional reactive streams
A shody attempt at best, but with some cool insights

## TODO
- [ ] Fix recursion error on multiple maps
- [ ] Reduce number of eventListeners/Promises created

## Known Bugs
Applying more than one `map` or `filter` to the stream before `run`ning it 
causes recursion error in firefox. Haven't tested any other browser
