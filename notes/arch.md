Would prefer a method to load an AST as follows

## Most Basic Usage

```ts
import loadFeed from "AST_THING";
const JSONFEED = loadFeed
  .fromURL("https://www.reddit.com/r/programming/.rss")
  .toJSON();
```

## Parse -> From

> from(s) -<> [use, config, to(s)]

```
.from(AST:AST)
.fromURL(s:string)
.fromJSON(jsonStr : jsonResp )
.fromRSS(jsonStr : jsonResp )
.fromATOM(jsonStr : jsonResp )
.fromCITY(jsonStr : jsonResp )
.fromFeedClass(feedClass: Class, feedData: data )
```

## Stringify -> To

> to(s) -> Promise.resolve()

```
.toCITY() // {string, feed:AST, messages: {}[], warnings: {}[]}
.toRSS() // rss XML string
.toATOM() // atom XML string
.toJSON() // JSON feed string
.toAST() // JSON feed string
.toFeedType( templ: string | Function) // provide a template function or mustache template string
```

## USE Middleware

> use -<> [use, config, to(s) ] config -<> [use, config, to(s) ]

```
.config() // optional
.data() // optional

.use(enhancementFnURL: string) // returns an ASTshell?
.use(enhancementFn:enhancementFn)
.use(enhancementFn:enhancementFn, options:options)
.using(enhancemenFnArr :(enhancementFn | string)[], options:unknown[])
```

## Final

```
.exportConfig()
```

_#Messages_ & _#Warnings_

> both use the SCIPAB interface

```ts
Interface SCIPAB {
    from: string // FeedFunc
    location: string // DataLocation
    situation: string //  (what happened)
    complication: string // (why its a problem)
    implication: string // (why you might care)
    action: string // (what we did to help you)
    benefit: string // (hopefully you like it - because)
}
```
