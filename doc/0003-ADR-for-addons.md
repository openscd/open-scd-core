# OpenSCD Core should support Addons

Date: 2023-06-05

## Status

Open

## Context
If we want OpenSCD to be extendable, we should allow OpenSCD to support `addons`.  An addon is like a plugin, but without the requirement of needing to extend from `HTMLElement`. An `addon` is a default exported function from a file.
an `addon` function gets the `OpenSCD` class as a parameter. from here, it can fetch the document if needed. it can also subscribe to events dispatched to `open-scd`.
By implementing addons, we can minimize the risk of people forking OpenSCD and adding new functionality. If people want extra functionality on OpenSCD, they can create an addon for it.

```
export default function xsdValidate(openSCD: OpenSCD) {
    openSCD.addEventListener('validate', (evt: ValidationEvent) => {
        const { doc } = openSCD;
        // Do actual validation to the doc.
    });
}
```

Another option is to support a new kind of plugin, `background` plugins. These plugins are rendered upon document load, like the `menu` plugins. Except these plugins are not shown in the UI. These plugins use the dom for dependency injection.

When `addons` or `background plugins` are supported, it will be possible to migrate current mixins from OpenSCD into `addons` or `background plugins`.

## Pros and Cons

### Background plugin
#### Pros
It can use the current `plugin` mechanism to load.
#### Cons
- A background plugin is extending from `HTMLElement` but it's not rendering anything. This goes against the `CustomElement` principles.
- The dom can get polluted quickly by creating background plugins

### Addons
#### Pros
An `addon` is a function that's not depending on anything.
The `addon` function gets the `OpenSCD` instance class as a parameter.

#### Cons
`Addons` need to be loaded apart from `plugins` .
