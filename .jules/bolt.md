## 2024-05-24 - Instantiating Intl.NumberFormat is expensive
Learning: `Intl.NumberFormat` instantiation is surprisingly expensive in JavaScript and was called on every render for multiple list items, leading to unnecessary main thread overhead. Caching the instance outside the render loop provides a massive speedup for formatting.
Action: Always cache `Intl.*` formatters globally or outside the component rather than creating new instances on every call.
