# Pin. website

The landing page (`index.html`) and the download page (`download.html`) for
the Pin. app. It is a plain static site: no build step, no settings needed.
The Download APK button links to the app on Google Drive.

## Put it online (GitHub + Vercel)

1. On GitHub, create a new repository (for example `pin`).
2. Click **uploading an existing file**, then drag **everything in this
   folder** into the page (`index.html`, `download.html`, `assets`, and the
   rest). `index.html` must be at the top of the repository, not inside
   another folder. Click **Commit changes**.
3. On vercel.com, click **Add New › Project**, pick the repository, and click
   **Deploy**. Leave every setting as it is (Framework Preset: Other).

Every time you change a file on GitHub, Vercel updates the site by itself.

## Changing the app download

The button points to Google Drive. To use a new file, upload it to Drive,
set sharing to **Anyone with the link**, copy its ID (the long code between
`/d/` and `/view` in the share link), and replace the old ID in
`download.html`. Also update the version, size and SHA-256 checksum there.

## After the first deploy

Change `content="/assets/img/og-image.jpg"` in `index.html` and
`download.html` to your full address, for example
`https://your-site.vercel.app/assets/img/og-image.jpg`, so link previews on
Facebook and LinkedIn show the picture.
