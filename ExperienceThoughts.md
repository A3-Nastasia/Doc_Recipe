## Naming
`#` (id) names in camelCase
`.` (class) names in kebab-case

## About frontend

```
If `uvicorn` is stuck open Task Manager and end the task (the name is similar).
```

- `content="width=device-width`: site size is equal to size in px which is defined in css. 
- `initial-scale=1.0`: site on device will look exactly like it's defined in css.
```
<meta name="viewport"
    content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
```

---

### Stretch to the end of the page

To stretch any element to the end of the page you need to use `height: 100vh;`. It'll stretch any element. If you already have anything on your page that is already taking up the space, you can decrease this value: for example `height: 80vh;`.

---

### Color variable

To make a coding process easier you can initialize variables in `.css` file:
```
:root {
    variable-name: value;
    ...
}
```

For example:
```
:root {
    --body-color: rgb(255, 255, 255);
}
```
