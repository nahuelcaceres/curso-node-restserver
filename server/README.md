# WebServer + RestServer



## Postman documentation
[view endpoints](https://documenter.getpostman.com/view/656054/TWDdhsq9)



# How create a release tag

### ```git tag -a v1.0.0 -m "Basic restserver"```

### ```git push --tags```


After that you need go to github and click on Releases (at the right) edit and publish release to generate
a image ready to download it.


### Notes
heroku logs -n 100 --tail

### React front

    - For use react with our node api (in the same folder group), we have to make is to add a property called
    proxy to our package.json. This will allow us to make requests to our Node server without having to provide the origin it is running on (http://localhotas:3001) every time we make a network request to it:

    ```"proxy": "http://localhost:3001",

