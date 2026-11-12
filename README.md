This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Vista previa con Cloudflare Tunnel

Para compartir esta version en el puerto 3001:

```bash
npm run dev -- --port 3001
```

En otra terminal:

```bash
npx cloudflared tunnel --url http://localhost:3001
```

El hostname generado debe estar en `allowedDevOrigins` en `next.config.ts`
(sin `https://`). Si reinicias el tunel y cambia la URL, actualiza ese valor.
Reinicia el servidor de desarrollo si no recarga la configuracion y luego
recarga la pagina. Mantene ambas terminales abiertas durante la vista previa.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Panel de disponibilidad

El panel privado está en `/admin`. Guarda disponibilidad por servicio y fecha en
MySQL en una agenda compartida; los horarios sin registros se consideran disponibles. El calendario
público consulta estos datos y bloquea la selección si no puede verificarlos.
Consultar una fecha no genera una reserva.

1. Copiá `.env.example` como `.env.local` y completá las credenciales de una base
   de datos MySQL persistente. Generá un secreto con `npx auth@latest secret` y
   configurá `BETTER_AUTH_URL` con la URL pública del sitio en producción.
2. Creá la base indicada en `MYSQL_DATABASE` y ejecutá
   [`database/service-availability.sql`](./database/service-availability.sql).
   Luego ejecutá [`database/shared-schedule.sql`](./database/shared-schedule.sql).
   Este último conserva los cierres diarios anteriores como bloqueos del servicio,
   sin convertirlos en reservas ni borrar la tabla anterior.
3. Generá las tablas de autenticación Better Auth:

   ```bash
   npx auth@latest migrate --config ./src/lib/auth.ts
   ```

4. Creá cada cuenta administradora desde una terminal de confianza. El registro
   público está deshabilitado:

   ```bash
   npx auth@latest create-admin --email admin@example.com --name "Administrador" --role admin --config ./src/lib/auth.ts
   ```

   Repetí el comando para cada administrador. No compartas contraseñas ni
   secretos por chat o repositorio.
5. Reiniciá el servidor Node. En producción, configurá las mismas variables en
   el panel de entorno del hosting y aplicá ambos esquemas antes de publicar.

### Inicio local con Docker

En Windows, generá `.env.local` con valores seguros al azar (no lo subas a Git),
levantá MySQL y aplicá los esquemas:

```powershell
$bytes = New-Object byte[] 48
[System.Security.Cryptography.RandomNumberGenerator]::Fill($bytes)
$secret = [Convert]::ToBase64String($bytes)
$dbPassword = [Guid]::NewGuid().ToString("N")
$rootPassword = [Guid]::NewGuid().ToString("N")
@"
MYSQL_HOST=127.0.0.1
MYSQL_PORT=3306
MYSQL_DATABASE=caicos
MYSQL_USER=caicos_admin
MYSQL_PASSWORD=$dbPassword
MYSQL_ROOT_PASSWORD=$rootPassword
BETTER_AUTH_SECRET=$secret
BETTER_AUTH_URL=http://localhost:3000
ADMIN_INITIAL_PASSWORD=admin1234
"@ | Set-Content -Encoding ascii .env.local
docker compose --env-file .env.local up -d
Get-Content database\service-availability.sql | docker compose --env-file .env.local exec -T mysql mysql -u root "--password=$rootPassword" caicos
$settings = Get-Content .env.local | ConvertFrom-StringData
$env:MYSQL_HOST = $settings.MYSQL_HOST
$env:MYSQL_PORT = $settings.MYSQL_PORT
$env:MYSQL_DATABASE = $settings.MYSQL_DATABASE
$env:MYSQL_USER = $settings.MYSQL_USER
$env:MYSQL_PASSWORD = $settings.MYSQL_PASSWORD
$env:BETTER_AUTH_SECRET = $settings.BETTER_AUTH_SECRET
$env:BETTER_AUTH_URL = $settings.BETTER_AUTH_URL
Get-Content database\shared-schedule.sql | docker compose --env-file .env.local exec -T mysql mysql -u caicos_admin "--password=$($settings.MYSQL_PASSWORD)" caicos
npx auth@latest migrate --config ./src/lib/auth.ts
npx auth@latest create-admin --config ./src/lib/auth.ts --email admin@caicos.local --name Admin --password $settings.ADMIN_INITIAL_PASSWORD --yes
```

La contraseña `admin1234` es solo para pruebas locales; no la uses en producción.
Para iniciar la web, ejecutá `npm run dev`. Para detener MySQL sin borrar los
datos: `docker compose --env-file .env.local stop`.

### Agenda compartida y turnos

- Infantil: dos turnos independientes, 14:00–17:00 y 18:00–21:00.
- Social: 21:00–03:00 del día siguiente. Una reserva infantil impide reservar
  un social en la misma fecha, y viceversa, aunque los horarios no se superpongan.
- Empresarial: inicio y fin personalizados. Un fin anterior al inicio indica
  el día siguiente; inicio y fin iguales no son válidos. Solo se impiden
  superposiciones con reservas, incluyendo las de la madrugada anterior.
- El panel distingue **reservado** y **no disponible (sin reserva)**. Un bloqueo
  manual cierra únicamente el servicio y horario indicados; no activa la
  incompatibilidad infantil/social ni bloquea otros servicios.
- Para liberar un turno, quitá el registro. Las restricciones derivadas se
  recalculan automáticamente. Las escrituras se serializan en MySQL para evitar
  reservas incompatibles desde dos sesiones simultáneas.
- El calendario público exige elegir un horario y lo incluye en la consulta
  de WhatsApp; no crea reservas. Los horarios se interpretan en hora local argentina.

Validación de las reglas: `node --test tests\schedule.test.mjs`.
