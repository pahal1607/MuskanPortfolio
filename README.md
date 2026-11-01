# Muskan Pandit portfolio

A static portfolio with a private admin panel at `/admin`.

## Put it live (one time)

1. Create a free GitHub account and a new empty repository. Upload every file in this folder to it
   (on github.com use Add file, then Upload files, and drag the folder contents in).
2. Go to vercel.com, sign in with GitHub, choose Add New, then Project, and import the repository.
   Leave every setting as it is and press Deploy.
3. In the Vercel project open the Storage tab, choose Create Database, then Blob, and connect it
   to the project. This is where photos and edits are saved.
4. In Settings, then Environment Variables, add `ADMIN_PASSWORD` with the password for the admin panel.
5. In the Deployments tab press the three dots on the latest deployment and choose Redeploy,
   so the new settings take effect.

## Using the admin panel

Open `your-site.vercel.app/admin`, enter the password, edit, and press Publish.
The public site updates within seconds. Nothing else needs to be uploaded.

## Notes

- The first version of the content lives inside `index.html`. Once you press Publish for the first time,
  the saved version in Blob takes over and edits made in `index.html` are no longer shown.
- To change the password, edit `ADMIN_PASSWORD` and redeploy.
