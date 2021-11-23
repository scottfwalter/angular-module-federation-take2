# Module FederationDemo With CXOne Infra

## Step 1 - NGINX Config Part 1
Since the navigation has not been updated to Angular Router (its coming soon!) you will need to add the following nginx config entries.
You will need to set the alias paths to a value that is on your file system.

```
location /navigation_data/modules/allModulesAndLinks {
    alias "/Users/scott/cxone/zzz/webapp-common-services-poc-scott1/allModulesAndLinks.json";
}
```

```
location ~* /platform-cxone-translations\/en-US\/en-US-cxone-components-translation.*json$ {
    alias "/Users/scott/cxone/zzz/webapp-common-services-poc-scott1/component-translations.json";
}
```

## Step 2 - NGINX Config Part 2
Setup a location for the Angular container app
```
    location /cxone/ {
        proxy_pass http://127.0.0.1:5000/;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_http_version 1.1;
        proxy_cache_bypass $http_upgrade;
    }
```

## Step 3 - NGINX Config Part 3
You may need to add CORS rules to nginx.conf.  I've added mine in the root directory here for reference.

## Step 4 - Build library and install node packages for each app
```
./install.sh
```

## Step 5 - Start up all the servers
```
npm run start:all
```

## Step 6 - Go!
[CXOne Demo](http://na1.dev.localhost:8080/cxone/)







