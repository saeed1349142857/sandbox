console.log('script2');
setTimeout(() => {
    console.log('RRRRRR');
    document.querySelector('body').insertAdjacentHTML( 'beforeend', '<h1>scott</h1>' );

    fetch('https://reqres.in/api/users?page=2')
    .then(
      function(response) {
        if (response.status !== 200) {
          console.log('Looks like there was a problem. Status Code: ' +
            response.status);
          return;
        }

        // Examine the text in the response
        response.json().then(function(data) {
          console.log(data);
        });
      }
    )
    .catch(function(err) {
      console.log('Fetch Error :-S', err);
    });

}, 3000);

function button2() {
    document.querySelector('body').insertAdjacentHTML( 'beforeend', '<h1>button2</h1>' );
}