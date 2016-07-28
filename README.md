## dev
> run
```
npm install
MONGODB_URI=mongodb://127.0.0.1 npm run dev

```
open url: http://localhost:3000/products

## Known issues
* Products are not persisted, so whenever server restart, a new list of products will be generated, and if access to `/products/1093bf68-8670-46e0-9e3e-a030e9cc77a4` will result error.
