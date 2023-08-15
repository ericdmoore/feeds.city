# Feed Enhancements

Usually pair well with analysis

Since Analysis can compure interesting stuff, the enhancements are often in charge of wrapping those with meaningful and
well managed side effects.

They might place the analysis in the body within a footer they might add it to the feed as meta data for another
application to pick up.

enhancements need to define default values for all params but more important define the params and how they are
marshalled from the proxy URL

analysis may have params required

- so those must be plugged via defaults as much as reasonable

http:////{{PROXYdomain}}/{{userID}}/id1?p1=a&p2=b&/http://otherdomain.com/atom.xml

With ALL Params VALID:

- returns transformed feed

With all Params Not Valid returns"

- a form where all params are shown and are fillable
- an ID for compact usage {{where this ID keeps all the params except URL}}

## Enhancement Interface

#### Run function

- runs over an AST data structure
- does the computation

#### Cloud Change Functions

> Install Function

- runs all provider install functions, based on validated inputs given
- functions MUST be idempotent

> Remove Function

- functions MUST be idempotent
-

> Provider Functions

- `[providerName]:{install, remove}`
- aws: {install, remove}
- gcloud: {install, remove}
- azure: {install, remove}

> Params

- run: JSON Schema
- cloud:
  - install: JSON Schema
  - remove: JSON Schema
  - aws: JSON Schema
  - gcloud: JSON Schema
  - azure: JSON Schema

> Forms

- embeddable markup, forms for inputting data
- collect the data

## ShortCodes

- addBody = 'addbody'
- addKeyWords= 'addkw'
- addKeywordScores = 'addkws'
- addLighhouseHistory = 'addLHouse'
- addSeoTodos = 'addseo'
- addSubscribables = 'addsub'
- addText2Voice = 'addtext'
- addText2Voice = 'addvoice'
- findBrokenLInks = 'findbroken'
- removeAds = 'rmAds'
- removeRead = 'rmRead'
- scoreAsDuplicates = 'scoreDups'
- preview = 'preview'

http://{{PROXYdomain}}/{{userID}}/{{Enchancement Composition}}/{{ URL }}

Feed Barber Preview

### preview

[true] = show preview

### addBody

['#main'] = Root CSS ['body > '] = CSS Selector

### rmAds

['ez-list'] = listNames

### addSubs

['footer'] = Location To Add

[Submit]

## Response

[ Info | Feed | Console | CompactID ]

### Info

Full URL:

> http:////{{PROXYdomain}}/{{userID}}/atom/preview(show=false)||addBody(css='a'||root='#main')||rmAds(list='')||addsubs/

CompactID

> `zaswf4w3d` -or- [edit]

Compact URL:

> http:////{{PROXYdomain}}/{{userID}}/atom/zaswf4w3d/{{add URL Here}}

### Feed

> Show the Feed

### Console

> Show Funciton Output

## User Developed of Plugins

Plugin as a named folder pattern

- index.ts file that exports an `EnhancementModule` interface
- Can be uploaded as a
  - `tar.gz`
  - others coming soon
- ## Can be given capabilities via Deno permissions
