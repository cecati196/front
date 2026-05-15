# Despliegue del Frontend

Este proyecto está preparado para desplegarse en **Cloudflare Pages** (recomendado) y/o **GitHub Pages** (alternativa).

---

## Variables de entorno

Antes de cualquier despliegue, verifica `src/environments/`:

- `environment.ts` (producción) — apunta al API en Railway:
  ```typescript
  apiUrl:         'https://server-production-b648.up.railway.app'
  authServiceUrl: 'https://server-production-b648.up.railway.app'
  ```
- `environment.development.ts` (dev local) — apunta a `http://localhost:8080`

Si la URL del API cambia, actualiza `environment.ts` y vuelve a desplegar.

---

## Opción A — Cloudflare Pages (recomendado)

Cloudflare hace build + deploy automático en cada push a `main`. No requiere ningún comando manual.

### Configuración (una sola vez)

1. Ve a [Cloudflare Dashboard → Pages](https://dash.cloudflare.com/?to=/:account/pages)
2. **Create a project → Connect to Git** → selecciona el repo
3. En la configuración del build:
   - **Framework preset**: `Angular`
   - **Build command**: `npm run build`
   - **Build output directory**: `dist/cecati196`
   - **Root directory**: `front-c196`
4. Variables de entorno: ninguna (todo está en `environment.ts`)
5. Guarda → Cloudflare hace el primer build

### Cómo funciona el routing SPA

El archivo `src/_redirects` se copia automáticamente al build:

```
/*    /index.html   200
```

Cualquier ruta no encontrada (ej. `/cursos`) devuelve `index.html` con status 200, y Angular Router toma el control.

### Cache control

`src/_headers` ya está configurado para:
- `index.html` → nunca se cachea (siempre el deploy más reciente)
- `*.js` / `*.css` con hash → cache 1 año (`outputHashing: 'all'`)
- Cabeceras de seguridad: `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`

### Acceso inicial (sin tocar DNS)

Por defecto, Cloudflare Pages asigna una URL gratuita del tipo `<project-name>.pages.dev`. Esta URL funciona inmediatamente tras el primer build, **sin necesidad de configurar ningún DNS**.

GitHub Pages con tu dominio `cecati196.edu.mx` sigue funcionando en paralelo — ambos despliegues coexisten en URLs distintas hasta que decidas migrar el dominio.

### Migración del dominio custom (opcional, más adelante)

Cuando estés listo para apuntar `cecati196.edu.mx` a Cloudflare:
1. CF Pages → **Custom domains → Set up a custom domain**
2. Sigue las instrucciones para apuntar el DNS (CNAME o registros A)
3. El dominio dejará de servir desde GitHub Pages (un dominio solo puede apuntar a un proveedor a la vez)
4. Opcionalmente elimina el archivo `CNAME` del repo si ya no usarás GH Pages

> Mientras no toques el DNS, GitHub Pages sigue activo con tu dominio personalizado.

---

## Opción B — GitHub Pages (alternativa)

Despliegue manual desde tu máquina:

```bash
cd front-c196
npm run deploy:gh
```

Esto hace tres cosas:
1. `ng build` → genera `dist/cecati196/`
2. Copia `index.html` → `404.html` (truco SPA: GitHub Pages sirve `404.html` cuando no encuentra la ruta, y la app Angular carga desde ahí)
3. `ng deploy --no-build --cname=cecati196.edu.mx` → sube `dist/cecati196/` a la rama `gh-pages` y mantiene el CNAME

### Limitaciones de GitHub Pages

- El truco del 404.html devuelve **status 404** aunque la app cargue (afecta SEO y monitoreo)
- No tiene headers HTTP custom (los archivos `_redirects` y `_headers` son ignorados)
- No tiene preview URLs por PR

Por eso recomiendo Cloudflare Pages para uso productivo.

---

## Resumen rápido

| Acción | Cloudflare Pages | GitHub Pages |
|---|---|---|
| Configurar (1 vez) | Panel web, conectar repo | `npm install` (ya instalado) |
| Desplegar | `git push` (auto) | `npm run deploy:gh` |
| Routing SPA | `_redirects` (status 200) | `404.html` (status 404) |
| Cache control | `_headers` | No |
| Dominio custom | DNS → CF | DNS → GH + CNAME file |
| Preview por PR | Sí, automático | No |
