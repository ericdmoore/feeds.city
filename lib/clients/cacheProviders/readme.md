# Overview

```mermaid
---
title: Cache Provider Interface
---
flowchart TD
    Set -->|name, data| InboundChange(To Bytes)
    Del-->|name| InboundChange 
    Register[Register Byte Transform.ƒs] --> Cache{Internal Cache}
    InboundChange -->|named bytes| Cache{Internal Cache}
    Cache --> |named bytes| Out[From Bytes]
    Out-->|name| Get
    Out-->|name| Peek
    Out-->|name| Has    
```

```mermaid
---
title: Cache Stack Interface
---

flowchart TD
    A[Configured Cache] -->|added to Stack| C(Cache Stack)
    C -->|1| D[inMem Cache Provider]
    C -->|2| F[Dynamo Cache Provider]
    C -->|3| E[S3 Cache Provider]
```
