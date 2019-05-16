// Some handy functions for making sure events work as expected
function onText(text){
        console.log(text);
}

function onSubmit(e){
        console.log(e)
}

function onClickDiv(e){
        console.log(e)
}

// Main Entry point
async function main()
{
        // preable and preparation
        console.log("Loaded")
        const bigDiv = document.querySelector("#big-div")
        const submit = document.querySelector("#submit")
        const textBox = document.querySelector("#text-input")

        //bigDiv.addEventListener("click", onClickDiv)
        submit.addEventListener("click", onSubmit)
        textBox.addEventListener("input", onText)

        /*
         * Stream of click events from the big blue square
         */
        const events = EventStream(bigDiv, "click")
        /*
         * Running more that one map/filter causes recursion erros
         * Not really sure why....
         */
        events
                .map(e => ({x: e.offsetX, y: e.offsetY}))
                .run(({x, y}) => console.log(`click at (${x}, ${y})`))
                /*
                 * Comment the lines above and
                 * Uncomment the lines below for a different effect
                 */
                //.filter(({offsetX, offsetY}) => offsetX > 5 && offsetY > 6)
                //.run(({offsetX, offsetY}) => console.log(`click at (${offsetX}, ${offsetX})`))
}

/*
 * Lazy stream of events of evenType from elem
 * Produces a new promise and changes event listeners every time the
 * event fires. There's got to be a better way to do this
 */
function EventStream(elem, eventType){
        return new AsyncStream(async function*(){
                let prevFunc = undefined
                while(true){
                        yield await new Promise((resolve, reject) => {
                                if (prevFunc)
                                        elem.removeEventListener(
                                                eventType,
                                                prevFunc)
                                prevFunc = resolve
                                elem.addEventListener(eventType, prevFunc)
                        })
                }
        })
}

/*
 * Adds of common functions on top of asynchronous generators
 * to make them behave more like lazy streams of other languages
 */
function AsyncStream(asyncGenerator){
        this[Symbol.asyncIterator] = asyncGenerator

        /*
         * Returns a new stream with all elements
         * transformed by func
         */
        this.map = func => {
                self = this
                return new AsyncStream(async function*(){
                        for await (const item of self){
                                yield func(item)
                        }
                })
        }

        /*
         * Returns a new stream for which elements make
         * pred return true
         */
        this.filter = pred => {
                self = this
                return new AsyncStream(async function*(){
                        for await (const item of self){
                                if (pred(item)) yield item
                        }
                })
        }

        /*
         * Run the stream, applying func to each item
         * consumed
         * Sort of like a typical reduce, but wihout and accumulator
         */
        this.run = async func => {
                for await (const item of this){
                        func(item)
                }
        }
}
