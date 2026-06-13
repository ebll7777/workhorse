Add your own product images in this folder by category.

Place files inside these subfolders:
- stickers
- paintings
- drawings
- furniture

This app now derives each image path from the product category in src/data/products.js.
Example: a Stickers product image resolves to /products/stickers/<filename>.

If you want to use a different filename, update that product's "image" value in src/data/products.js.
If you add a new category, make sure its category name matches the folder name pattern used by the app:
lowercase with spaces replaced by hyphens.
