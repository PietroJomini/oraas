# oraas

> .obj render as a service

Render .obj and .mtl files in the web with a minimal, url-based configuration.

## Usage

```
https://pietrojomini.github.io/oraas/index.html?config
```

### Config

| key              | type   | description        | required |
| ---------------- | ------ | ------------------ | -------- |
| obj              | string | .obj URL           | Y        |
| mtl              | string | .mtl URL           | Y        |
| background       | string | background color   | N        |
| fov              | number |                    | N        |
| lighSkyColor     | string |                    | N        |
| lightGroundColor | string |                    | N        |
| fitRation        | number | initial fit ration | N        |
