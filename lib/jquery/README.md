# Vendored jQuery

- Version: 3.4.1, full minified build (unchanged from the previous CDN dependency).
- Source: https://code.jquery.com/jquery-3.4.1.min.js
- License: MIT; see LICENSE.txt and the original file header.
- SHA-256 (base64): CSXorXvZcTkaix6Yvo6HppcZGetbYMGWSFlBw8HfCJo=

Both index.html and 404.html load this file before Bootstrap and the jQuery
plugins. No CDN fallback is used.

## Deployment

The script path is relative to the HTML document. Upload this directory with
the HTML files. For https://www.inveshub.co/index.html, the script must be
available at https://www.inveshub.co/lib/jquery/jquery-3.4.1.min.js. If the HTML
is served from a subdirectory, preserve the same relative lib/jquery/ path.

Other existing production asset paths are intentionally unchanged.
