module.exports = function(appendKey, append,metadata) {
  return (`<!doctype html>

  <html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
  
    <title>Perseverance View</title>
    <meta name="description" content="Views from Mars!!">
  
    <link rel="icon" href="/dist/favicon.ico">
  
    <link rel="stylesheet" href="/dist/reset.css">
    <link rel="stylesheet" href="/dist/style.css">
  
  </head>
  
  <body>
    <div id="app"></div>
    <script src="https://unpkg.com/react@17/umd/react.production.min.js" crossorigin></script>
    <script src="https://unpkg.com/react-dom@17/umd/react-dom.production.min.js" crossorigin></script>
    <script type="text/javascript">
      window.${appendKey} = ${append}
      ${metadata && (`window.${appendKey}_metadata = ${metadata}`)}
    </script>
    <script src="/dist/index.js" type="module"></script>
  </body>
  </html>`)
}