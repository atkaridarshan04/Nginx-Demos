# 🚀 Hosting Static and Dynamic Sites with NGINX

This guide walks you through deploying a **static frontend** (like Vite, React, or Vue) using **NGINX**, with support for both static assets and dynamic SPA routing.


## ✅ Step 1: Build and Move Your Static Files to the Web Directory

Before deploying, make sure your static files are ready.

* ✅ **Plain static sites** — HTML, CSS, JS directly (no build step)
* ✅ **Frontend apps (React, Vue, Vite, etc.)** — built using `npm run build`

Now move the files to NGINX’s web root:

```bash
sudo mkdir -p /var/www/web-app
sudo cp -r app/* /var/www/web-app/
sudo chown -R www-data:www-data /var/www/web-app
```

> For Built Frontend Apps, simply replace the `app` folder with `dist`


## ✅ Step 2: Create an NGINX Server Block

Create a new NGINX config:

```bash
sudo vi /etc/nginx/sites-available/web-app
```

Paste the following configuration:

```nginx
server {
    listen 80;
    server_name localhost;  # Replace with your domain or public IP

    root /var/www/web-app;
    index index.html;

    location / {
        # Handle requests for static files
        try_files $uri $uri/ =404;

        # Handle requests for the Single Page Application (SPA)
        # try_files $uri $uri/ /index.html;
    }

    # Static assets (cache for 6 months)
    location ~* \.(?:ico|css|js|svg|woff2?|ttf|otf|eot|jpg|jpeg|png|gif|webp|avif)$ {
        expires 6M;
        access_log off;
        add_header Cache-Control "public";
    }

    # Custom error pages
    error_page 404 /404.html;
    error_page 500 502 503 504 /500.html;

    location = /404.html {
        root /var/www/web-app;
        internal;
    }

    location = /500.html {
        root /var/www/web-app;
        internal;
    }
}
```

> 🔁 This setup serves static files and ensures clean routing for SPAs (`/dashboard`, `/profile`, etc.).


## ✅ Step 3: Enable Your Site

Create a symbolic link to activate your site config:

```bash
sudo ln -s /etc/nginx/sites-available/web-app /etc/nginx/sites-enabled/
```

Disable the default NGINX site (optional):

```bash
sudo rm /etc/nginx/sites-enabled/default
```


## ✅ Step 4: Test and Reload NGINX

Test your config:

```bash
sudo nginx -t
```

Reload NGINX to apply changes:

```bash
sudo systemctl reload nginx
```

✅ Your frontend site is now live at your server’s IP or domain!


## 🌐 Accessing Your App

Open your browser and go to:

```
http://<your-server-ip>/
```

Or, if you're using a domain:

```
http://yourdomain.com/
```


## 🔒 Optional: Add HTTPS with Let’s Encrypt

If you’re using a domain name, secure your site with a free SSL certificate:

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com
```

This will:

* Automatically issue and install an SSL certificate
* Add HTTPS support in your NGINX config
* Set up automatic certificate renewals

---
